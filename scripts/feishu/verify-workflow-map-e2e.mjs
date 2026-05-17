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

  // 拖拉第一張卡
  const firstCard = page.locator('.wf-card').first();
  const beforeBox = await firstCard.boundingBox();
  await page.locator('.wf-card').first().locator('.wf-drag-handle').hover();
  await page.mouse.down();
  await page.mouse.move(beforeBox.x + 200, beforeBox.y + 100);
  await page.mouse.up();
  await page.waitForTimeout(400);
  const afterBox = await page.locator('.wf-card').first().boundingBox();
  console.log(`drag: ${Math.round(beforeBox.x)},${Math.round(beforeBox.y)} → ${Math.round(afterBox.x)},${Math.round(afterBox.y)}`);
  if (Math.abs(afterBox.x - beforeBox.x) < 50) throw new Error('drag 沒動');

  // 編輯第一張卡的 title
  const title = page.locator('.wf-card').first().locator('.wf-title');
  await title.click({ clickCount: 3 }); // select
  await page.keyboard.type('客戶詢盤 EDITED');
  await page.locator('body').click({ position: { x: 5, y: 5 } }); // blur
  await page.waitForTimeout(200);
  const newTitle = await page.locator('.wf-card').first().locator('.wf-title').textContent();
  console.log(`title after edit: "${newTitle}"`);
  if (!newTitle.includes('EDITED')) throw new Error('title 編輯沒生效');

  // 編輯第一個 edge label
  const firstLabel = page.locator('.wf-edge-label').first();
  await firstLabel.click();
  await page.keyboard.type('測試標籤');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
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
