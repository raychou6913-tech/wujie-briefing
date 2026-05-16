// 端到端：seed 1 筆楊子 + backdate → Shawn 看到 stale 標「飛書」+ daysLate
import { chromium } from 'playwright';

const SITE = 'https://raychou6913-tech.github.io/wujie-briefing/';
const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const FEE_TBL = 'tblvGsQpXPHtkp1C';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';

async function tk() { return (await (await fetch(`${WORKER}/auth/token`)).json()).tenant_access_token; }

async function resetAndSeedOld() {
  const t = await tk();
  const list = (await (await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${FEE_TBL}/records?page_size=100`, { headers: { Authorization: `Bearer ${t}` } })).json()).data?.items || [];
  for (const it of list) await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${FEE_TBL}/records/${it.record_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } });
  const NOW = Date.now();
  const OLD = NOW - 6 * 86400000;
  await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${FEE_TBL}/records`, {
    method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { 費用標題:'楊子卡了 6 天的測試案', 申請人:'木子', 費用類別:'差旅', 歸屬主體:'北京蕪解', 實際金額:500, 幣別:'CNY', 發生日期:OLD, inbox_state:'pending', owner:'yangzi', submitted_by:'muzi', created_at:OLD, updated_at:OLD, version:1, urgency:'normal' } })
  });
}

(async () => {
  console.log('[setup] reset + seed 1 筆 backdated 6 天的楊子待審');
  await resetAndSeedOld();
  const chase = await (await fetch(`${WORKER}/erp/inbox/shawn-chase`)).json();
  console.log(`  → Worker shawn-chase: ${chase.items.length} stale（預期 >= 1）`);
  if (!chase.items.length) throw new Error('worker stale 撈空');

  console.log('\n[browser] 登入 shawn 開待催辦 modal');
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  const sess = { user: 'shawn', name: 'Shawn', role: 'COO', hall: 'erp-shawn.html', color: '#dc2626', ts: Date.now() };
  // 清舊的 hidden 避免測試前項目被暫掛
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console:' + m.text()); });

  await page.goto(SITE + 'login.html');
  await page.evaluate((s) => { localStorage.setItem('erp_sess', JSON.stringify(s)); localStorage.removeItem('shawn_chase_hidden_v1'); }, sess);
  await page.goto(SITE + 'erp-lobby.html');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-action="shawn-chase"]').first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/shawn-chase'), { timeout: 8000 });
  await page.waitForTimeout(500);

  const chaseHtml = await page.locator('#chase-list').innerHTML();
  const hasWorkerBadge = chaseHtml.includes('飛書');
  const hasYangziItem = chaseHtml.includes('楊子卡了 6 天');
  console.log(`  modal HTML 包含「飛書」badge: ${hasWorkerBadge}`);
  console.log(`  modal HTML 包含 seed 名稱: ${hasYangziItem}`);
  if (!hasWorkerBadge || !hasYangziItem) {
    console.log('FAIL — HTML head 200:', chaseHtml.slice(0, 200));
    throw new Error('Shawn modal missing worker stale item');
  }

  console.log('\n--- JS errors ---');
  console.log(errs.length ? errs.join('\n') : '(none)');
  await page.screenshot({ path: '/tmp/shawn-chase.png' });
  await browser.close();
  console.log('\n✓ all checks pass');
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
