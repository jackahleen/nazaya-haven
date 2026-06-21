const { chromium } = await import('playwright');const BASE = 'http://127.0.0.1:3000';
const OUT = process.env.VIDEO_DIR;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function step(label, fn) {
  try { await fn(); console.log('OK   ', label); }
  catch (e) { console.log('SKIP ', label, '-', String(e).split('\n')[0].slice(0, 120)); }
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1366, height: 820 },
  recordVideo: { dir: OUT, size: { width: 1366, height: 820 } },
});
const page = await context.newPage();

// 1) Landing
await step('landing', async () => { await page.goto(BASE, { waitUntil: 'networkidle' }); });
await sleep(2500);
await step('scroll hero', async () => { await page.mouse.wheel(0, 500); await sleep(1200); await page.mouse.wheel(0, 500); await sleep(1200); await page.mouse.wheel(0, -1000); });
await sleep(1500);

// 2) Get Started -> login
await step('get started', async () => {
  const cta = page.getByRole('link', { name: /get started/i }).first();
  if (await cta.count()) await cta.click(); else await page.goto(BASE + '/login/');
});
await sleep(2500);

// 3) Enter demo -> dashboard
await step('enter demo', async () => {
  const demo = page.getByRole('button', { name: /enter demo/i }).first();
  if (await demo.count()) await demo.click(); else await page.goto(BASE + '/dashboard/');
  await page.waitForURL(/dashboard/, { timeout: 8000 }).catch(()=>{});
});
await sleep(3000);
await step('dashboard scroll', async () => { await page.mouse.wheel(0, 700); await sleep(1500); await page.mouse.wheel(0, -700); });
await sleep(1500);

// 4) Live AI chat
await step('open + use chat', async () => {
  const input = page.getByRole('textbox').filter({ hasText: '' }).last();
  const box = page.locator('input[type="text"], textarea').last();
  const target = (await box.count()) ? box : input;
  await target.click();
  await target.fill('I just became a foster parent and need help finding housing assistance nearby.');
  await sleep(1000);
  const send = page.getByRole('button', { name: /send|ask/i }).first();
  if (await send.count()) await send.click(); else await target.press('Enter');
});
await sleep(5000); // let the live AI response stream in
await step('scroll chat', async () => { await page.mouse.wheel(0, 400); });
await sleep(2500);

// 5) Resources search
await step('resources', async () => { await page.goto(BASE + '/resources/', { waitUntil: 'networkidle' }); });
await sleep(2500);
await step('resource search', async () => {
  const cat = page.getByRole('button', { name: /housing/i }).first();
  if (await cat.count()) await cat.click();
  const zip = page.locator('input').filter({ hasNot: page.locator('[type=checkbox]') }).first();
  if (await zip.count()) { await zip.click(); await zip.fill('94704'); }
  const search = page.getByRole('button', { name: /^search/i }).first();
  if (await search.count()) await search.click();
});
await sleep(3500);
await step('scroll results', async () => { await page.mouse.wheel(0, 700); await sleep(1500); await page.mouse.wheel(0, 500); });
await sleep(2500);

// 6) Legal
await step('legal', async () => { await page.goto(BASE + '/legal/', { waitUntil: 'networkidle' }); });
await sleep(3000);
await step('legal scroll', async () => { await page.mouse.wheel(0, 600); await sleep(1500); });
await sleep(2000);

await context.close(); // flush video
await browser.close();
console.log('DONE');