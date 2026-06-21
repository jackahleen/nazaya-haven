const { chromium } = await import('playwright');
const BASE = 'http://127.0.0.1:3000';
const OUT = process.env.VIDEO_DIR;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const CURSOR_JS = () => {
  if (window.__cur) return;
  const c = document.createElement('div'); c.id='__sai_cursor';
  c.style.cssText=['position:fixed','z-index:2147483647','left:0','top:0','width:22px','height:22px','margin:-6px 0 0 -6px','pointer-events:none','transition:transform .05s linear','background:radial-gradient(circle at 35% 35%, #fff 0 30%, #6d28d9 32% 60%, rgba(109,40,217,.25) 62% 100%)','border-radius:50%','box-shadow:0 2px 8px rgba(0,0,0,.4)'].join(';');
  document.documentElement.appendChild(c);
  const ring=document.createElement('div'); ring.style.cssText='position:fixed;z-index:2147483646;width:40px;height:40px;margin:-20px 0 0 -20px;border:2px solid #6d28d9;border-radius:50%;opacity:0;pointer-events:none;transition:opacity .2s,transform .25s';
  document.documentElement.appendChild(ring);
  window.__cur=c; window.__ring=ring;
  document.addEventListener('mousemove',(e)=>{c.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px';},true);
  document.addEventListener('mousedown',()=>{ring.style.opacity='1';ring.style.transform='scale(.4)';},true);
  document.addEventListener('mouseup',()=>{ring.style.transform='scale(1)';setTimeout(()=>ring.style.opacity='0',180);},true);
};

const browser=await chromium.launch();
const context=await browser.newContext({ viewport:{width:1600,height:900}, recordVideo:{dir:OUT,size:{width:1600,height:900}} });
await context.addInitScript(CURSOR_JS);
const page=await context.newPage();
let mx=800,my=450;
async function moveTo(x,y){ await page.mouse.move(x,y,{steps:30}); mx=x;my=y; await sleep(250); }
async function click(loc){ await loc.scrollIntoViewIfNeeded().catch(()=>{}); await sleep(350); const b=await loc.boundingBox(); if(!b) throw new Error('no box'); await moveTo(b.x+b.width/2,b.y+b.height/2); await page.mouse.down(); await sleep(90); await page.mouse.up(); await sleep(450); }
async function hover(loc){ const b=await loc.boundingBox(); if(b){ await moveTo(b.x+b.width/2,b.y+b.height/2); } }
async function scroll(total,dir=1){ const steps=24,dy=(total/steps)*dir; for(let i=0;i<steps;i++){ await page.mouse.wheel(0,dy); await sleep(45);} }
async function reinject(){ await page.evaluate(CURSOR_JS).catch(()=>{}); await moveTo(mx,my); }
async function step(label,fn){ try{ await fn(); console.log('OK   ',label);}catch(e){ console.log('SKIP ',label,'-',String(e).split('\n')[0].slice(0,110)); } }

// 1) Landing
await step('landing',async()=>{ await page.goto(BASE,{waitUntil:'networkidle'}); await reinject(); });
await sleep(1400); await step('hero pan',async()=>{ await scroll(700,1); await sleep(800); await scroll(700,-1); }); await sleep(900);

// 2) Get Started
await step('get started',async()=>{ const cta=page.getByRole('link',{name:/get started/i}).first(); if(await cta.count()) await click(cta); else await page.goto(BASE+'/login/'); await reinject(); });
await sleep(1200);

// 3) Enter demo
await step('enter demo',async()=>{ const d=page.getByRole('button',{name:/enter demo/i}).first(); if(await d.count()) await click(d); else await page.goto(BASE+'/dashboard/'); await page.waitForURL(/dashboard/,{timeout:8000}).catch(()=>{}); await reinject(); });
await sleep(1600); await step('dashboard pan',async()=>{ await scroll(800,1); await sleep(800); await scroll(800,-1); }); await sleep(900);

// 4) Chat (static demo fallback)
await step('chat',async()=>{
  const box=page.locator('input[type="text"], textarea').last(); await click(box);
  await box.pressSequentially('I just became a foster parent — can you help me find housing assistance nearby?',{delay:26});
  await sleep(500);
  const send=page.getByRole('button',{name:/send|ask/i}).first(); if(await send.count()) await click(send); else await box.press('Enter');
});
await sleep(4500); await step('read reply',async()=>{ await scroll(350,1); }); await sleep(1800);

// 5) Resources — search, show results, switch category to show DIFFERENT results
await step('resources',async()=>{ await page.goto(BASE+'/resources/',{waitUntil:'networkidle'}); await reinject(); }); await sleep(1000);
async function runSearch(catName){
  const cat=page.getByRole('button',{name:catName}).first(); if(await cat.count()) await click(cat);
  const zip=page.locator('input').first(); if(await zip.count()){ await click(zip); await zip.fill(''); await zip.pressSequentially('94704',{delay:110}); }
  const s=page.getByRole('button',{name:/^search/i}).first(); if(await s.count()) await click(s);
  await sleep(2200);
}
await step('search housing',async()=>{ await runSearch(/housing/i); });
await step('browse housing results',async()=>{ await scroll(750,1); await sleep(900);
  const card=page.getByRole('heading',{name:/compass|bay area/i}).first(); if(await card.count()) await hover(card); await sleep(900); await scroll(500,1); });
await sleep(1200);
await step('switch to mental health',async()=>{ await scroll(900,-1); await sleep(600); await runSearch(/mental & physical health/i); });
await step('browse new results',async()=>{ await scroll(800,1); await sleep(1000); await scroll(500,1); });
await sleep(1500);

// 6) Legal
await step('legal',async()=>{ await page.goto(BASE+'/legal/',{waitUntil:'networkidle'}); await reinject(); }); await sleep(1000);
await step('legal pan',async()=>{ await scroll(700,1); }); await sleep(1600);

await context.close(); await browser.close(); console.log('DONE');
