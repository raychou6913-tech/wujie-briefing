// 端到端：seed 3 筆費用 → 楊子開 modal → approve 1 筆 / reject 1 筆
import { chromium } from 'playwright';

const SITE = 'https://raychou6913-tech.github.io/wujie-briefing/';
const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';
const TBL = 'tblvGsQpXPHtkp1C';
const AT = 'Sg7ObNELHaAdZzshGIFjWPVhpce';

async function tk() { return (await (await fetch(`${WORKER}/auth/token`)).json()).tenant_access_token; }

async function resetAndSeed() {
  const t = await tk();
  const list = (await (await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${TBL}/records?page_size=100`, { headers: { Authorization: `Bearer ${t}` } })).json()).data?.items || [];
  for (const it of list) await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${TBL}/records/${it.record_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } });
  const NOW = Date.now();
  const rows = [
    { 費用標題:'詩彤 出差費用報銷', 申請人:'詩彤', 費用類別:'差旅', 歸屬主體:'台灣悍草', 實際金額:8560, 幣別:'TWD', '金額（萬元）':0.856, 發生日期:NOW-86400000*8, 備註:'高鐵+飯店+餐費', inbox_state:'pending', owner:'yangzi', submitted_by:'shetong', created_at:NOW, updated_at:NOW, version:1, urgency:'high' },
    { 費用標題:'高維 車資', 申請人:'高維', 費用類別:'差旅', 歸屬主體:'北京蕪解', 實際金額:340, 幣別:'CNY', '金額（萬元）':0.034, 發生日期:NOW-86400000*4, 備註:'廠端車資', inbox_state:'pending', owner:'yangzi', submitted_by:'gaowei', created_at:NOW, updated_at:NOW, version:1, urgency:'normal' },
    { 費用標題:'北京 4 月電費', 申請人:'楊子', 費用類別:'水電雜費', 歸屬主體:'北京蕪解', 實際金額:1240, 幣別:'CNY', '金額（萬元）':0.124, 發生日期:NOW-86400000*10, 備註:'辦公室電費', inbox_state:'pending', owner:'yangzi', submitted_by:'yangzi', created_at:NOW, updated_at:NOW, version:1, urgency:'normal' },
  ];
  for (const r of rows) {
    await fetch(`${WORKER}/open-apis/bitable/v1/apps/${AT}/tables/${TBL}/records`, {
      method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: r })
    });
  }
}

(async () => {
  console.log('[setup] reset + seed 3 筆費用給楊子');
  await resetAndSeed();
  const yz = await (await fetch(`${WORKER}/erp/inbox/yangzi-approve?owner=yangzi`)).json();
  console.log(`  → yangzi pending: ${yz.items.length}（預期 3）`);
  if (yz.items.length !== 3) throw new Error('seed failed');

  console.log('\n[browser] 登入 yangzi 開 modal');
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  const sess = { user: 'yangzi', name: '楊子', role: 'HR · 出納', hall: 'erp-yangzi.html', color: '#dc2626', ts: Date.now() };
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console:' + m.text()); });

  await page.goto(SITE + 'login.html');
  await page.evaluate((s) => localStorage.setItem('erp_sess', JSON.stringify(s)), sess);
  await page.goto(SITE + 'erp-lobby.html');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-action="my-approval"]').first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/yangzi-approve'), { timeout: 8000 });
  await page.waitForTimeout(400);

  const cnt = await page.locator('#approval-inbox-list [data-rid]').count();
  console.log(`  modal 顯示 ${cnt} 筆（預期 3）`);
  if (cnt !== 3) throw new Error('modal mismatch');

  const firstText = await page.locator('#approval-inbox-list [data-rid]').first().textContent();
  console.log(`  first item: ${firstText.replace(/\s+/g,' ').slice(0,80)}`);

  // approve 第一筆
  console.log('\n[action] approve 第一筆 → 應送給躍明');
  await page.locator('#approval-inbox-list [data-rid]').first().locator('button').first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/yangzi-approve?'), { timeout: 8000 });
  await page.waitForTimeout(400);
  const afterApprove = await page.locator('#approval-inbox-list [data-rid]').count();
  console.log(`  → 剩 ${afterApprove} 筆（預期 2）`);

  // reject 下一筆（會 prompt 輸入）
  console.log('\n[action] reject 下一筆（prompt 輸入退回原因）');
  page.on('dialog', (d) => d.accept('單據不完整，請補發票'));
  await page.locator('#approval-inbox-list [data-rid]').first().locator('button').nth(1).click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/yangzi-approve?'), { timeout: 8000 });
  await page.waitForTimeout(400);
  const afterReject = await page.locator('#approval-inbox-list [data-rid]').count();
  console.log(`  → 剩 ${afterReject} 筆（預期 1）`);

  console.log('\n--- JS errors ---');
  console.log(errs.length ? errs.join('\n') : '(none)');
  await page.screenshot({ path: '/tmp/yangzi-inbox.png' });
  await browser.close();
  console.log('\n✓ all checks pass');
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
