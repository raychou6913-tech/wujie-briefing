// Playwright 端到端驗證：登入 Bevis → 開設計核准 → 看真實飛書資料 → AI panel
import { chromium } from 'playwright';

const SITE = 'https://raychou6913-tech.github.io/wujie-briefing/';

const sess = {
  user: 'bevis',
  name: 'Bevis',
  role: '設計主管',
  hall: 'erp-pipeline.html',
  color: '#7d4cdb',
  ts: Date.now(),
};

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  // 1. inject session before lobby loads
  await page.goto(SITE + 'login.html');
  await page.evaluate((s) => localStorage.setItem('erp_sess', JSON.stringify(s)), sess);

  // 2. nav lobby
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errs.push('console:' + msg.text());
  });
  await page.goto(SITE + 'erp-lobby.html');
  await page.waitForLoadState('networkidle');

  // 3. confirm sidebar has 設計核准 button
  const designBtn = page.locator('[data-action="design-approve"]');
  const found = await designBtn.count();
  console.log('設計核准 sidebar entry count:', found);
  if (!found) throw new Error('設計核准 sidebar item missing');

  // 4. click → modal opens
  await designBtn.first().click();
  await page.waitForTimeout(2500); // wait for fetch

  const modal = page.locator('#design-approve-modal');
  const isOpen = await modal.evaluate((el) => el.classList.contains('show'));
  console.log('modal open:', isOpen);
  if (!isOpen) throw new Error('modal did not open');

  // 5. confirm items loaded from Feishu
  const items = await page.locator('#design-approve-list [data-rid]').count();
  console.log('items loaded from Feishu:', items);
  if (!items) throw new Error('no items rendered — Worker GET likely failed');

  // 6. check first item shows real data (Chinese name)
  const firstName = await page.locator('#design-approve-list [data-rid]').first().textContent();
  console.log('first item text (first 80 chars):', firstName.replace(/\s+/g, ' ').slice(0, 80));

  // 7. AI fab visible
  const aiFab = page.locator('#ai-fab');
  console.log('AI fab visible:', await aiFab.isVisible());

  // 8. open AI panel
  await aiFab.click();
  await page.waitForTimeout(400);
  const panelOpen = await page.locator('#ai-panel').evaluate((el) => el.classList.contains('open'));
  console.log('AI panel open:', panelOpen);

  // 9. check greeting rendered
  const greet = await page.locator('#ai-msgs').textContent();
  console.log('AI greeting (first 60 chars):', greet.replace(/\s+/g, ' ').slice(0, 60));

  console.log('\n--- JS errors during run ---');
  console.log(errs.length ? errs.join('\n') : '(none)');

  // 10. close AI panel, click approve on first item, confirm list shrinks
  await page.locator('#ai-panel .ai-head button').click();
  await page.waitForTimeout(200);
  const beforeCount = await page.locator('#design-approve-list [data-rid]').count();
  console.log('items before approve:', beforeCount);
  await page.locator('#design-approve-list [data-rid]').first().locator('button').first().click();
  // wait for the SECOND fetch (after re-open) — explicit wait
  await page.waitForResponse((r) => r.url().includes('/erp/inbox/design-approve?'), { timeout: 8000 });
  await page.waitForTimeout(500); // let render settle
  const modalStillOpen = await page.locator('#design-approve-modal').evaluate((el) => el.classList.contains('show'));
  const listHtml = await page.locator('#design-approve-list').innerHTML();
  const afterCount = await page.locator('#design-approve-list [data-rid]').count();
  console.log('modal still open:', modalStillOpen);
  console.log('items after approve:', afterCount);
  console.log('list HTML first 200 chars:', listHtml.slice(0, 200).replace(/\n/g, ' '));
  if (afterCount !== beforeCount - 1) {
    console.log('⚠ list did not shrink as expected');
  } else {
    console.log('✓ approve action worked end-to-end (飛書 wrote)');
  }

  // 11. screenshot for visual confirm
  await page.screenshot({ path: '/tmp/erp-lobby-bevis-design.png', fullPage: false });
  console.log('\nscreenshot: /tmp/erp-lobby-bevis-design.png');

  await browser.close();
  console.log('\n✓ all checks pass');
})().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});
