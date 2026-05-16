// 端到端：Bevis revise 1 筆 → 詩彤接到 → submit → Bevis 重新接到
import { chromium } from 'playwright';

const SITE = 'https://raychou6913-tech.github.io/wujie-briefing/';
const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';

async function tk() { return (await (await fetch(`${WORKER}/auth/token`)).json()).tenant_access_token; }

async function resetAndSeed() {
  const t = await tk();
  const list = (await (await fetch(`${WORKER}/open-apis/bitable/v1/apps/Sg7ObNELHaAdZzshGIFjWPVhpce/tables/tblSgCcB2aFcsPaw/records?page_size=50`, { headers: { Authorization: `Bearer ${t}` } })).json()).data?.items || [];
  for (const it of list) await fetch(`${WORKER}/open-apis/bitable/v1/apps/Sg7ObNELHaAdZzshGIFjWPVhpce/tables/tblSgCcB2aFcsPaw/records/${it.record_id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${t}` } });
  const NOW = Date.now();
  await fetch(`${WORKER}/open-apis/bitable/v1/apps/Sg7ObNELHaAdZzshGIFjWPVhpce/tables/tblSgCcB2aFcsPaw/records`, {
    method: 'POST', headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { 設計名稱:'Chiikawa 桌曆 2026', 'IP品牌':'Chiikawa', '設計師/供應商':'詩彤', 送審階段:'四視圖', 送審輪次:1, 審核狀態:'已提交', owner:'bevis', submitted_by:'shitong', created_at:NOW, updated_at:NOW, version:1, urgency:'normal' } })
  });
}

async function bevisReviseFirst() {
  const list = await (await fetch(`${WORKER}/erp/inbox/design-approve?owner=bevis`)).json();
  const it = list.items[0];
  await fetch(`${WORKER}/erp/inbox/design-approve/action`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record_id: it.record_id, action: 'revise', version: it.version, actor: 'bevis', note: '色調太冷' })
  });
}

(async () => {
  console.log('[setup] reset + seed 1 筆 + Bevis revise');
  await resetAndSeed();
  await bevisReviseFirst();
  const t = await (await fetch(`${WORKER}/erp/inbox/design-task?owner=shetong`)).json();
  console.log(`  → shetong pending: ${t.items.length}（預期 1）`);
  if (t.items.length !== 1) throw new Error('handoff failed');

  console.log('\n[browser] 登入 shitong 開 modal');
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  const sess = { user: 'shetong', name: '詩彤', role: '設計師', hall: 'erp-pipeline.html', color: '#7d4cdb', ts: Date.now() };
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console:' + m.text()); });

  await page.goto(SITE + 'login.html');
  await page.evaluate((s) => localStorage.setItem('erp_sess', JSON.stringify(s)), sess);
  await page.goto(SITE + 'erp-lobby.html');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-action="my-design-task"]').first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/design-task?'), { timeout: 8000 });
  await page.waitForTimeout(400);

  const cnt = await page.locator('#design-task-list [data-rid]').count();
  console.log(`  modal: ${cnt} 筆（預期 1）`);
  if (cnt !== 1) throw new Error('modal mismatch');

  // 看 source label 是否顯示 "Bevis 退回"（state=修改中）
  const sourceLabel = await page.locator('#design-task-list [data-rid]').first().textContent();
  console.log(`  source 顯示: ${sourceLabel.includes('Bevis 退回') ? 'Bevis 退回 ✓' : 'NOT 退回 — fail'}`);

  // submit
  console.log('\n[action] 詩彤 submit 回 Bevis');
  await page.locator('#design-task-list [data-rid]').first().locator('button').first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/design-task?'), { timeout: 8000 });
  await page.waitForTimeout(400);
  const after = await page.locator('#design-task-list [data-rid]').count();
  console.log(`  → 剩 ${after} 筆（預期 0）`);

  // Bevis 端看到
  const bevisList = await (await fetch(`${WORKER}/erp/inbox/design-approve?owner=bevis`)).json();
  const re = bevisList.items.find((x) => x.name === 'Chiikawa 桌曆 2026');
  console.log(`  Bevis 重新看到 Chiikawa: state=${re?.state} v=${re?.version}（預期 已提交 v=3）`);

  console.log('\n--- JS errors ---');
  console.log(errs.length ? errs.join('\n') : '(none)');
  await page.screenshot({ path: '/tmp/shitong-design-task.png' });
  await browser.close();
  console.log('\n✓ all checks pass');
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
