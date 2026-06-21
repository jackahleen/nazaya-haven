import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const videoDir = process.env.VIDEO_DIR ?? "_video";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cursorScript = () => {
  if (window.__saiCursor) return;

  const cursor = document.createElement("div");
  cursor.id = "__sai_cursor";
  cursor.style.cssText = [
    "position:fixed",
    "z-index:2147483647",
    "left:0",
    "top:0",
    "width:22px",
    "height:22px",
    "margin:-6px 0 0 -6px",
    "pointer-events:none",
    "transition:transform .05s linear",
    "background:radial-gradient(circle at 35% 35%, #fff 0 30%, #6d28d9 32% 60%, rgba(109,40,217,.25) 62% 100%)",
    "border-radius:50%",
    "box-shadow:0 2px 8px rgba(0,0,0,.4)",
  ].join(";");

  const ring = document.createElement("div");
  ring.style.cssText = [
    "position:fixed",
    "z-index:2147483646",
    "width:40px",
    "height:40px",
    "margin:-20px 0 0 -20px",
    "border:2px solid #6d28d9",
    "border-radius:50%",
    "opacity:0",
    "pointer-events:none",
    "transition:opacity .2s,transform .25s",
  ].join(";");

  document.documentElement.appendChild(cursor);
  document.documentElement.appendChild(ring);
  window.__saiCursor = cursor;
  window.__saiRing = ring;

  document.addEventListener(
    "mousemove",
    (event) => {
      cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px)`;
      ring.style.left = `${event.clientX}px`;
      ring.style.top = `${event.clientY}px`;
    },
    true,
  );
  document.addEventListener(
    "mousedown",
    () => {
      ring.style.opacity = "1";
      ring.style.transform = "scale(.4)";
    },
    true,
  );
  document.addEventListener(
    "mouseup",
    () => {
      ring.style.transform = "scale(1)";
      setTimeout(() => {
        ring.style.opacity = "0";
      }, 180);
    },
    true,
  );
};

await mkdir(videoDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  recordVideo: { dir: videoDir, size: { width: 1600, height: 900 } },
});
await context.addInitScript(cursorScript);
const page = await context.newPage();

let mouseX = 800;
let mouseY = 450;

async function moveTo(x, y) {
  await page.mouse.move(x, y, { steps: 30 });
  mouseX = x;
  mouseY = y;
  await sleep(220);
}

async function click(locator) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await sleep(300);
  const box = await locator.boundingBox();
  if (!box) throw new Error("no bounding box");

  await moveTo(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await sleep(90);
  await page.mouse.up();
  await sleep(400);
}

async function hover(locator) {
  const box = await locator.boundingBox();
  if (box) await moveTo(box.x + box.width / 2, box.y + box.height / 2);
}

async function scroll(total, direction = 1) {
  const steps = 22;
  const deltaY = (total / steps) * direction;
  for (let index = 0; index < steps; index += 1) {
    await page.mouse.wheel(0, deltaY);
    await sleep(45);
  }
}

async function reinjectCursor() {
  await page.evaluate(cursorScript).catch(() => {});
  await moveTo(mouseX, mouseY);
}

async function step(label, fn) {
  try {
    await fn();
    console.log("OK   ", label);
  } catch (error) {
    console.log("SKIP ", label, "-", String(error).split("\n")[0].slice(0, 110));
  }
}

async function waitForButtonGone(name, timeout = 35000) {
  const startedAt = Date.now();
  await sleep(800);

  while (Date.now() - startedAt < timeout) {
    const count = await page.getByRole("button", { name }).count();
    if (!count) return true;
    await sleep(500);
  }

  return false;
}

await step("landing", async () => {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await reinjectCursor();
});
await sleep(1300);
await step("hero pan", async () => {
  await scroll(700, 1);
  await sleep(700);
  await scroll(700, -1);
});
await sleep(800);

await step("get started", async () => {
  const cta = page.getByRole("link", { name: /get started/i }).first();
  if (await cta.count()) await click(cta);
  else await page.goto(`${baseUrl}/login/`);
  await reinjectCursor();
});
await sleep(1100);

await step("enter demo", async () => {
  const demo = page.getByRole("button", { name: /enter demo/i }).first();
  if (await demo.count()) await click(demo);
  else await page.goto(`${baseUrl}/dashboard/`);
  await page.waitForURL(/dashboard/, { timeout: 8000 }).catch(() => {});
  await reinjectCursor();
});
await sleep(1400);
await step("dashboard pan", async () => {
  await scroll(800, 1);
  await sleep(700);
  await scroll(800, -1);
});
await sleep(700);

await step("chat", async () => {
  const box = page.locator('input[type="text"], textarea').last();
  await click(box);
  await box.pressSequentially(
    "I just became a foster parent in Berkeley and need housing assistance. What are my first steps?",
    { delay: 22 },
  );
  await sleep(400);
  const send = page.getByRole("button", { name: /send|ask/i }).first();
  if (await send.count()) await click(send);
  else await box.press("Enter");
  await waitForButtonGone(/sending/i);
});
await sleep(1500);
await step("read reply", async () => {
  await scroll(450, 1);
  await sleep(1200);
  await scroll(300, 1);
});
await sleep(1500);

await step("resources", async () => {
  await page.goto(`${baseUrl}/resources/`, { waitUntil: "networkidle" });
  await reinjectCursor();
});
await sleep(900);

async function searchResources(categoryName) {
  const category = page.getByRole("button", { name: categoryName }).first();
  if (await category.count()) await click(category);

  const zip = page.locator("input").first();
  if (await zip.count()) {
    await click(zip);
    await zip.fill("");
    await zip.pressSequentially("94704", { delay: 90 });
  }

  const search = page.getByRole("button", { name: /^search/i }).first();
  if (await search.count()) await click(search);
  await waitForButtonGone(/searching/i);
  await sleep(800);
}

await step("search housing", async () => {
  await searchResources(/housing/i);
});
await step("browse results", async () => {
  await scroll(750, 1);
  await sleep(1100);
  const card = page.getByRole("heading", { level: 3 }).first();
  if (await card.count()) await hover(card);
  await sleep(900);
  await scroll(550, 1);
  await sleep(900);
});
await sleep(1000);
await step("switch category", async () => {
  await scroll(1100, -1);
  await sleep(500);
  await searchResources(/mental & physical health/i);
});
await step("browse new results", async () => {
  await scroll(800, 1);
  await sleep(1100);
  await scroll(500, 1);
});
await sleep(1200);

await step("legal", async () => {
  await page.goto(`${baseUrl}/legal/`, { waitUntil: "networkidle" });
  await reinjectCursor();
});
await sleep(900);
await step("legal pan", async () => {
  await scroll(700, 1);
});
await sleep(1400);

await context.close();
await browser.close();
console.log("DONE");
