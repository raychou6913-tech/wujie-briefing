/**
 * audit-full.mjs — 全頁面互動審查腳本
 * 每次執行：逐頁點按鈕、展開 accordion、切 tab、開 modal，全程截圖
 * 輸出到 .screenshots/audit-YYYY-MM-DD-HH-MM/
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';

const BASE = 'http://localhost:8765';
const ts   = new Date().toISOString().replace(/[:.]/g,'-').slice(0,16);
const OUT  = `/Users/yu-hsiangchou/我的專案資料夾/wujie-briefing/.screenshots/audit-${ts}`;

const mk = (user, name, role) => JSON.stringify({ user, name, role, ts: Date.now() });

const PAGES = [
  { file:'erp-war-room.html',    label:'war-room',    sess: mk('ray','Ray','boss') },
  { file:'erp-finance.html',     label:'finance',     sess: mk('yuming','躍明','finance') },
  { file:'erp-shawn.html',       label:'shawn',       sess: mk('shawn','Shawn','coo') },
  { file:'erp-anran.html',       label:'anran',       sess: mk('anran','安然','bj_gm') },
  { file:'erp-pipeline.html',    label:'pipeline',    sess: mk('bevis','Bevis','design_lead') },
  { file:'erp-peiling.html',     label:'peiling',     sess: mk('peilin','珮玲','designer') },
  { file:'erp-shetong.html',     label:'shetong',     sess: mk('shetong','詩彤','designer') },
  { file:'erp-procurement.html', label:'procurement', sess: mk('laige','賴哥','procurement') },
  { file:'erp-crm.html',         label:'crm',         sess: mk('laodong','老董','sales') },
  { file:'erp-ecommerce.html',   label:'ecommerce',   sess: mk('chunlei','春雷','ecommerce') },
  { file:'erp-gaowei.html',      label:'gaowei',      sess: mk('gaowei','高維','logistics') },
  { file:'erp-yangzi.html',      label:'yangzi',      sess: mk('yangzi','楊子','admin') },
];

const issues = [];
function log(label, msg) {
  const line = `[${label}] ${msg}`;
  console.log(line);
  issues.push(line);
}

async function shot(page, label, name) {
  const p = `${OUT}/${label}-${name}.png`;
  await page.screenshot({ path: p, fullPage: true });
  return p;
}

async function safe(fn, fallback = null) {
  try { return await fn(); } catch { return fallback; }
}

// ── per-page interaction checklist ──────────────────────────────────────────

async function auditWarRoom(page, label) {
  await shot(page, label, '00-initial');

  // War room no longer has entity tabs — always shows VAM combined view
  // Verify VAM context strip is visible
  const vamStrip = page.locator('.ectx-panel');
  if (await vamStrip.count() > 0) log(label, '✅ VAM context strip visible');
  else log(label, '❌ VAM context strip missing');

  // KPI tabs
  for (const [btn, panel] of [
    ['kpi-revenue','kpi-revenue'], ['kpi-vs-budget','kpi-vs-budget'], ['kpi-monthly','kpi-monthly']
  ]) {
    await page.locator(`button.kpi-tab`).filter({hasText: /業績收入|季度|月度/}).first().click().catch(()=>{});
    await page.waitForTimeout(300);
  }
  await shot(page, label, '02-kpi-tabs');

  // Expandable accordion sections
  const expandBtns = page.locator('[onclick*="toggleCoverRow"], [onclick*="toggleOrderDetail"], [onclick*="toggleIpDetail"], [onclick*="toggleVamTaxBreak"]');
  const count = await expandBtns.count();
  for (let i = 0; i < Math.min(count, 8); i++) {
    await expandBtns.nth(i).click().catch(()=>{});
    await page.waitForTimeout(200);
  }
  await shot(page, label, '03-expanded');

  // Approval queue - approve button
  const approveBtns = page.locator('button').filter({hasText: /批准|核准|Approve/});
  const ac = await approveBtns.count();
  log(label, `ℹ️  approval buttons visible: ${ac}`);
  if (ac > 0) { await approveBtns.first().click().catch(()=>{}); await page.waitForTimeout(400); }
  await shot(page, label, '04-approval');
}

async function auditFinance(page, label) {
  await shot(page, label, '00-initial');
  // Tabs
  const tabs = page.locator('button.fin-tab, [onclick*="switchFinTab"], .tab-btn');
  const tc = await tabs.count();
  for (let i = 0; i < tc; i++) {
    await tabs.nth(i).click().catch(()=>{}); await page.waitForTimeout(300);
    await shot(page, label, `01-tab-${i}`);
  }
  // Check if cash flow section has an input form
  const inputs = page.locator('input[type="number"], input[type="text"], select');
  const ic = await inputs.count();
  if (ic === 0) log(label, '⚠️  現金流頁面無輸入表單 — 躍明無法填寫數據');
  else log(label, `✅ ${ic} 個輸入欄位可用`);
  await shot(page, label, '02-forms');
}

async function auditShawn(page, label) {
  await shot(page, label, '00-initial');
  // Batch tabs (銷售中/開發中, etc.)
  const tabs = page.locator('.tab-btn, [onclick*="switchTab"], [onclick*="switchWholesaleTab"], [onclick*="switchPopupTab"]');
  const tc = await tabs.count();
  for (let i = 0; i < Math.min(tc, 6); i++) {
    await tabs.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-tabs');
  // Expandable rows
  const rows = page.locator('[onclick*="toggleLogistics"], [onclick*="toggleSupply"], [onclick*="toggleRow"]');
  const rc = await rows.count();
  for (let i = 0; i < Math.min(rc, 5); i++) {
    await rows.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '02-expanded-rows');
  // FAB
  const fab = page.locator('.exp-fab, [onclick*="openExpModal"]');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-expense-modal'); }
  // Close modal
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditAnran(page, label) {
  await shot(page, label, '00-initial');
  // KPI cards expand
  const kpis = page.locator('[onclick*="toggleKpi"], [onclick*="expandKpi"], .kpi-card');
  const kc = await kpis.count();
  for (let i = 0; i < Math.min(kc, 6); i++) {
    await kpis.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-kpi-expanded');
  // Contract rows expand
  const rows = page.locator('[onclick*="toggleContract"], [onclick*="toggleOrder"], [onclick*="toggle"]');
  const rc = await rows.count();
  for (let i = 0; i < Math.min(rc, 5); i++) {
    await rows.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '02-rows-expanded');
  // FAB expense
  const fab = page.locator('.exp-fab');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-expense-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditPipeline(page, label) {
  await shot(page, label, '00-initial');
  // Product card clicks
  const cards = page.locator('.product-card, [onclick*="openProduct"], .pipeline-card');
  const cc = await cards.count();
  log(label, `ℹ️  ${cc} product cards found`);
  if (cc > 0) {
    await cards.first().click().catch(()=>{}); await page.waitForTimeout(400);
    await shot(page, label, '01-card-opened');
    await page.keyboard.press('Escape').catch(()=>{});
  }
  // Stage advance / rollback
  const advance = page.locator('button').filter({hasText:/推進|下一階段|Advance/});
  const ac = await advance.count();
  log(label, `ℹ️  ${ac} advance buttons`);
  await shot(page, label, '02-stage-btns');
  // New product button
  const newBtn = page.locator('button').filter({hasText:/新品|新增/});
  if (await newBtn.count()) { await newBtn.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-new-product-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditPeiling(page, label) {
  await shot(page, label, '00-initial');
  // Quick access buttons
  const btns = page.locator('a[href], button').filter({hasText:/送審|圖庫|更新/});
  const bc = await btns.count();
  log(label, `ℹ️  ${bc} quick access buttons`);
  // IP rows expand
  const rows = page.locator('.ip-row, [onclick*="toggle"]');
  for (let i = 0; i < Math.min(await rows.count(), 5); i++) {
    await rows.nth(i).click().catch(()=>{}); await page.waitForTimeout(150);
  }
  await shot(page, label, '01-ip-expanded');
  // Task expand
  const tasks = page.locator('.task-item, [onclick*="expand"]');
  for (let i = 0; i < Math.min(await tasks.count(), 3); i++) {
    await tasks.nth(i).click().catch(()=>{}); await page.waitForTimeout(150);
  }
  await shot(page, label, '02-tasks');
  // Expense FAB
  const fab = page.locator('.exp-fab');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-expense-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditShetong(page, label) {
  await shot(page, label, '00-initial');
  const fab = page.locator('.exp-fab, .fab');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '01-expense-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
  // t-card is the correct selector for shetong dynamically-rendered tasks
  const tasks = page.locator('.t-card, .task-item, .task-card');
  const tc = await tasks.count();
  log(label, `ℹ️  ${tc} task items`);
  for (let i = 0; i < Math.min(tc, 3); i++) {
    await tasks.nth(i).click().catch(()=>{});
    await page.waitForTimeout(200);
  }
  await shot(page, label, '02-tasks-expanded');
}

async function auditProcurement(page, label) {
  await shot(page, label, '00-initial');
  // PO rows expand
  const rows = page.locator('[onclick*="toggle"], .po-row, [onclick*="expandPO"]');
  for (let i = 0; i < Math.min(await rows.count(), 5); i++) {
    await rows.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-po-expanded');
  // New PO button
  const newBtn = page.locator('button').filter({hasText:/新增|新品|採購/});
  if (await newBtn.count()) { await newBtn.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '02-new-po-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
  // Filter tabs
  const tabs = page.locator('.filter-tab, [onclick*="filterPO"]');
  for (let i = 0; i < Math.min(await tabs.count(), 5); i++) {
    await tabs.nth(i).click().catch(()=>{}); await page.waitForTimeout(150);
  }
  await shot(page, label, '03-filtered');
}

async function auditCRM(page, label) {
  await shot(page, label, '00-initial');
  // Customer cards expand
  const cards = page.locator('.customer-card, [onclick*="toggle"]');
  for (let i = 0; i < Math.min(await cards.count(), 4); i++) {
    await cards.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-cards-expanded');
  // Add customer button
  const addBtn = page.locator('button').filter({hasText:/新增客戶|新客戶/});
  if (await addBtn.count()) { await addBtn.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '02-add-customer'); }
  await page.keyboard.press('Escape').catch(()=>{});
  // FAB
  const fab = page.locator('.exp-fab');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-expense-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditEcommerce(page, label) {
  await shot(page, label, '00-initial');
  // Channel tabs
  const tabs = page.locator('button').filter({hasText:/抖音|小紅書|淘寶|全部/});
  for (let i = 0; i < Math.min(await tabs.count(), 4); i++) {
    await tabs.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-tabs');
  // Activity expand
  const rows = page.locator('[onclick*="toggle"], .activity-row');
  for (let i = 0; i < Math.min(await rows.count(), 4); i++) {
    await rows.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '02-activities');
  // FAB (+)
  const fab = page.locator('.fab, .exp-fab, button.fab-btn');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-fab-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditGaowei(page, label) {
  await shot(page, label, '00-initial');
  // Batch rows expand
  const rows = page.locator('[onclick*="toggle"], .batch-row');
  for (let i = 0; i < Math.min(await rows.count(), 5); i++) {
    await rows.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-batches-expanded');
  // Add batch
  const addBtn = page.locator('button').filter({hasText:/新增批次|新增/});
  if (await addBtn.count()) { await addBtn.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '02-add-batch'); }
  await page.keyboard.press('Escape').catch(()=>{});
  // Expense FAB
  const fab = page.locator('.exp-fab');
  if (await fab.count()) { await fab.first().click().catch(()=>{}); await page.waitForTimeout(400); await shot(page, label, '03-expense-modal'); }
  await page.keyboard.press('Escape').catch(()=>{});
}

async function auditYangzi(page, label) {
  await shot(page, label, '00-initial');
  // Application cards
  const cards = page.locator('.app-card, [onclick*="toggle"], .form-card');
  for (let i = 0; i < Math.min(await cards.count(), 4); i++) {
    await cards.nth(i).click().catch(()=>{}); await page.waitForTimeout(200);
  }
  await shot(page, label, '01-cards');
  // Form type buttons
  const formBtns = page.locator('button').filter({hasText:/費用|請假|採購|招募/});
  if (await formBtns.count()) {
    await formBtns.first().click().catch(()=>{}); await page.waitForTimeout(400);
    await shot(page, label, '02-form-opened');
  }
  await page.keyboard.press('Escape').catch(()=>{});
  // Salary flow steps (yangzi uses .pr-step / .pr-label)
  const steps = page.locator('.pr-step, .pr-label, .salary-step, [onclick*="salaryStep"]');
  log(label, `ℹ️  ${await steps.count()} payroll steps`);
  await shot(page, label, '03-salary-flow');
}

const AUDITORS = {
  'war-room':    auditWarRoom,
  'finance':     auditFinance,
  'shawn':       auditShawn,
  'anran':       auditAnran,
  'pipeline':    auditPipeline,
  'peiling':     auditPeiling,
  'shetong':     auditShetong,
  'procurement': auditProcurement,
  'crm':         auditCRM,
  'ecommerce':   auditEcommerce,
  'gaowei':      auditGaowei,
  'yangzi':      auditYangzi,
};

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const p of PAGES) {
    console.log(`\n▶ ${p.label}`);
    const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => log(p.label, `❌ JS Error: ${e.message}`));
    page.on('console', m => { if (m.type()==='error') log(p.label, `❌ Console error: ${m.text()}`); });

    try {
      await page.goto(`${BASE}/login.html`);
      await page.evaluate(s => localStorage.setItem('erp_sess', s), p.sess);
      await page.goto(`${BASE}/${p.file}`);
      await page.waitForTimeout(2500);

      const auditor = AUDITORS[p.label];
      if (auditor) await auditor(page, p.label);
      else await shot(page, p.label, '00-initial');

      log(p.label, '✅ page audited');
    } catch (e) {
      log(p.label, `❌ audit error: ${e.message}`);
    }
    await ctx.close();
  }

  await browser.close();

  // Write issues report
  const report = issues.join('\n');
  await writeFile(`${OUT}/ISSUES.txt`, report);
  console.log(`\n報告輸出：${OUT}/ISSUES.txt`);
}

run().catch(e => { console.error(e); process.exit(1); });
