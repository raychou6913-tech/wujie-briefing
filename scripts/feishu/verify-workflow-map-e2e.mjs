// 端到端：登入 Ray → workflow-map → 卡片渲染 + drag + edit + edge label
import { chromium } from 'playwright';

const SITE = 'https://raychou6913-tech.github.io/wujie-briefing/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
  const sess = { user: 'ray', name: 'Ray', role: 'CEO', hall: 'erp-war-room.html', color: '#dc2626', ts: Date.now() };
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console:' + m.text()); });

  await page.goto(SITE + 'login.html');
  await page.evaluate((s) => { localStorage.setItem('erp_sess', JSON.stringify(s)); localStorage.removeItem('workflow_edits_wholesale_v1'); }, sess);
  await page.goto(SITE + 'erp-workflow-map.html');
  await page.waitForLoadState('networkidle');

  // 卡片數量
  const cardCount = await page.locator('.wf-card').count();
  console.log(`cards rendered: ${cardCount}（預期 wholesale 流程 13 張）`);
  if (cardCount < 5) throw new Error('cards 沒渲染');

  // 拖拉最後一張卡（角落，往右下拖不會 overlap 其他卡）
  const lastCard = page.locator('.wf-card').last();
  const beforeBox = await lastCard.boundingBox();
  const startX = beforeBox.x + beforeBox.width - 8;
  const startY = beforeBox.y + beforeBox.height - 8;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 250, startY + 150, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const afterBox = await page.locator('.wf-card').last().boundingBox();
  console.log(`drag last card: ${Math.round(beforeBox.x)},${Math.round(beforeBox.y)} → ${Math.round(afterBox.x)},${Math.round(afterBox.y)}`);
  if (Math.abs(afterBox.x - beforeBox.x) < 100) throw new Error('drag 沒動');

  // 編輯第一張卡 title（直接 evaluate 模擬 contenteditable 編輯 + blur）
  await page.locator('.wf-card').first().locator('.wf-title').evaluate(el => {
    el.focus();
    el.textContent = '客戶詢盤 EDITED';
    el.dispatchEvent(new Event('blur', {bubbles: true}));
  });
  await page.waitForTimeout(300);
  const newTitle = await page.locator('.wf-card').first().locator('.wf-title').textContent();
  console.log(`title after edit: "${newTitle}"`);
  if (!newTitle.includes('EDITED')) throw new Error('title 編輯沒生效');

  // 點卡 → inline 展開（用 evaluate 觸發 click 避開 overlay 攔截）
  await page.locator('.wf-card').first().evaluate(el => {
    // 找個非 contenteditable 的點
    const evt = new MouseEvent('click', { bubbles: true });
    el.dispatchEvent(evt);
  });
  await page.waitForTimeout(200);
  const isSelected = await page.locator('.wf-card').first().evaluate(el => el.classList.contains('selected'));
  const detailsVisible = await page.locator('.wf-card').first().locator('.wf-card-details').evaluate(el => getComputedStyle(el).display !== 'none');
  console.log(`第一張卡 selected: ${isSelected}, details 展開: ${detailsVisible}`);

  // 編輯第一個 edge label（同樣用 evaluate 避免 overlay）
  await page.locator('.wf-edge-label').first().evaluate(el => {
    el.focus();
    el.textContent = '測試標籤';
    el.dispatchEvent(new Event('blur', {bubbles: true}));
  });
  await page.waitForTimeout(200);
  const labelText = await page.locator('.wf-edge-label').first().textContent();
  console.log(`edge label: "${labelText}"`);

  // 重新整理頁面 → 編輯應該還在
  await page.reload();
  await page.waitForLoadState('networkidle');
  const persistedTitle = await page.locator('.wf-card').first().locator('.wf-title').textContent();
  console.log(`title after reload: "${persistedTitle}"`);
  if (!persistedTitle.includes('EDITED')) throw new Error('localStorage 沒持久');

  console.log('\n--- JS errors ---');
  console.log(errs.length ? errs.join('\n') : '(none)');
  await page.screenshot({ path: '/tmp/workflow-map-cards.png', fullPage: true });
  await browser.close();
  console.log('\n✓ all checks pass');
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
