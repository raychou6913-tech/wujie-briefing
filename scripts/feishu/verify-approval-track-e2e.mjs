// 端到端驗證：Bevis approve 3 筆 → handoff 到珮玲 → 珮玲開 modal 看到 → pass/chase
import { chromium } from 'playwright';

const SITE = 'https://raychou6913-tech.github.io/wujie-briefing/';
const WORKER = 'https://feishu-proxy.raychou6913.workers.dev';

// 1. 清表 + reseed
async function token() {
  const r = await fetch(`${WORKER}/auth/token`);
  return (await r.json()).tenant_access_token;
}
async function clearAndSeed() {
  const tk = await token();
  const list = await fetch(`${WORKER}/open-apis/bitable/v1/apps/Sg7ObNELHaAdZzshGIFjWPVhpce/tables/tblSgCcB2aFcsPaw/records?page_size=50`, { headers: { Authorization: `Bearer ${tk}` } });
  const items = (await list.json()).data?.items || [];
  for (const it of items) {
    await fetch(`${WORKER}/open-apis/bitable/v1/apps/Sg7ObNELHaAdZzshGIFjWPVhpce/tables/tblSgCcB2aFcsPaw/records/${it.record_id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${tk}` }
    });
  }
  // seed via existing script (re-import side-effect free path: call directly)
  const NOW = Date.now();
  const rows = [
    { 設計名稱:'Chiikawa 桌曆 2026', 'IP品牌':'Chiikawa', '設計師/供應商':'詩彤', 送審階段:'四視圖', 送審輪次:1, 審核狀態:'已提交', 修改備註:'初稿', owner:'bevis', submitted_by:'shitong', created_at:NOW, updated_at:NOW, version:1, urgency:'normal' },
    { 設計名稱:'Snoopy 馬克杯 v2', 'IP品牌':'Snoopy', '設計師/供應商':'外包 · 小李', 送審階段:'彩稿/配色', 送審輪次:2, 審核狀態:'已提交', 修改備註:'第二輪', owner:'bevis', submitted_by:'shitong', created_at:NOW, updated_at:NOW, version:1, urgency:'high' },
    { 設計名稱:'Mofusand 文創包裝', 'IP品牌':'Mofusand', '設計師/供應商':'詩彤', 送審階段:'包裝設計', 送審輪次:1, 審核狀態:'已提交', 修改備註:'版型已定', owner:'bevis', submitted_by:'shitong', created_at:NOW, updated_at:NOW, version:1, urgency:'normal' },
  ];
  for (const r of rows) {
    await fetch(`${WORKER}/open-apis/bitable/v1/apps/Sg7ObNELHaAdZzshGIFjWPVhpce/tables/tblSgCcB2aFcsPaw/records`, {
      method: 'POST', headers: { Authorization: `Bearer ${tk}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: r })
    });
  }
}

// 2. Bevis approve 3 筆 → handoff peilin
async function bevisApproveAll() {
  const list = await (await fetch(`${WORKER}/erp/inbox/design-approve?owner=bevis`)).json();
  for (const it of list.items) {
    await fetch(`${WORKER}/erp/inbox/design-approve/action`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record_id: it.record_id, action: 'approve', version: it.version, actor: 'bevis' })
    });
  }
}

(async () => {
  console.log('[setup] 清表 + reseed 3 筆 + Bevis approve all');
  await clearAndSeed();
  await bevisApproveAll();
  const peilinList = await (await fetch(`${WORKER}/erp/inbox/approval-track?owner=peilin`)).json();
  console.log(`  → peilin pending: ${peilinList.items.length}（預期 3）`);
  if (peilinList.items.length !== 3) throw new Error('handoff failed');

  console.log('\n[browser] 登入 peilin 開 modal');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  const sess = { user: 'peilin', name: '珮玲', role: '企劃 · 版權', hall: 'erp-approval-tracker.html', color: '#7d4cdb', ts: Date.now() };

  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console:' + m.text()); });

  await page.goto(SITE + 'login.html');
  await page.evaluate((s) => localStorage.setItem('erp_sess', JSON.stringify(s)), sess);
  await page.goto(SITE + 'erp-lobby.html');
  await page.waitForLoadState('networkidle');

  // peilin sidebar 應該有「送審追蹤」(data-action="my-approval-tracker")
  const btn = page.locator('[data-action="my-approval-tracker"]');
  console.log(`  送審追蹤 sidebar btn 數量: ${await btn.count()}`);
  await btn.first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/approval-track?'), { timeout: 8000 });
  await page.waitForTimeout(400);

  const cnt = await page.locator('#approval-track-list [data-rid]').count();
  console.log(`  modal 顯示 ${cnt} 筆（預期 3）`);
  if (cnt !== 3) throw new Error('modal mismatch');

  // pass 第一筆
  console.log('\n[action] pass 第一筆');
  await page.locator('#approval-track-list [data-rid]').first().locator('button').first().click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/approval-track?'), { timeout: 8000 });
  await page.waitForTimeout(400);
  const afterPass = await page.locator('#approval-track-list [data-rid]').count();
  console.log(`  → 剩 ${afterPass} 筆（預期 2）`);
  if (afterPass !== 2) throw new Error('pass action failed');

  // chase 第二筆（不會減少 list — state 不變）
  console.log('\n[action] chase 第二筆（state 不變）');
  page.on('dialog', (d) => d.accept('e2e 追問記錄'));
  await page.locator('#approval-track-list [data-rid]').first().locator('button').nth(2).click();
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/approval-track?'), { timeout: 8000 });
  await page.waitForTimeout(400);
  const afterChase = await page.locator('#approval-track-list [data-rid]').count();
  console.log(`  → 剩 ${afterChase} 筆（預期 2 — chase 不改 state）`);

  console.log('\n--- JS errors ---');
  console.log(errs.length ? errs.join('\n') : '(none)');
  await page.screenshot({ path: '/tmp/peilin-approval-track.png' });
  console.log('screenshot: /tmp/peilin-approval-track.png');
  await browser.close();
  console.log('\n✓ all checks pass');
})().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
