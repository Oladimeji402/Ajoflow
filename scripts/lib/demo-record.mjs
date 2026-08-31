import { chromium } from 'playwright';
import { mkdirSync, readdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function demoPaths(scriptUrl) {
  const root = join(dirname(fileURLToPath(scriptUrl)), '..');
  const demoDir = join(root, 'demo');
  const videoDir = join(demoDir, '.playwright-video');
  mkdirSync(demoDir, { recursive: true });
  return { root, demoDir, videoDir };
}

export function resetVideoDir(videoDir) {
  if (existsSync(videoDir)) rmSync(videoDir, { recursive: true });
  mkdirSync(videoDir, { recursive: true });
}

export async function waitForApp(baseUrl) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/signup`, { redirect: 'manual' });
      if (res.ok || res.status === 307 || res.status === 308) return;
    } catch {
      // still booting
    }
    await sleep(800);
  }
  throw new Error(`App did not start at ${baseUrl}`);
}

export async function launchRecordedPage(videoDir) {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    recordVideo: { dir: videoDir, size: { width: 1080, height: 1920 } },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(25_000);
  return { browser, context, page };
}

export async function installOverlay(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal, [data-next-badge-root] { display: none !important; }
      #demo-pointer {
        position: fixed; top: 0; left: 0; z-index: 2147483646;
        width: 18px; height: 18px; margin-left: -4px; margin-top: -4px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #fff 0 28%, #F5A623 32% 100%);
        box-shadow: 0 4px 12px rgba(13,26,110,0.28);
        pointer-events: none;
        transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
      }
      #demo-caption-wrap {
        position: fixed; left: 12px; right: 12px; top: 48px; z-index: 2147483645;
        pointer-events: none; text-align: center;
      }
      #demo-caption {
        display: inline-block; max-width: 100%;
        background: rgba(13,26,110,0.94);
        color: #fff; font-size: 13px; font-weight: 700; line-height: 1.25;
        letter-spacing: -0.02em;
        padding: 8px 12px; border-radius: 12px;
        box-shadow: 0 8px 20px rgba(13,26,110,0.22);
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      }
    `,
  });
  await page.evaluate(() => {
    if (!document.getElementById('demo-pointer')) {
      const p = document.createElement('div');
      p.id = 'demo-pointer';
      document.body.appendChild(p);
    }
    if (!document.getElementById('demo-caption-wrap')) {
      const wrap = document.createElement('div');
      wrap.id = 'demo-caption-wrap';
      wrap.innerHTML = '<div id="demo-caption"></div>';
      document.body.appendChild(wrap);
    }
  });
}

export async function caption(page, text) {
  await page.evaluate((t) => {
    const el = document.getElementById('demo-caption');
    if (el) el.textContent = t;
  }, text);
}

export async function pointAt(page, locator) {
  const box = await locator.boundingBox();
  if (!box) return;
  const x = box.x + Math.min(box.width * 0.55, box.width - 12);
  const y = box.y + box.height / 2;
  await page.evaluate(({ x, y }) => {
    const p = document.getElementById('demo-pointer');
    if (p) p.style.transform = `translate(${x}px, ${y}px)`;
  }, { x, y });
  await sleep(280);
}

export async function tap(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  await pointAt(page, locator);
  await locator.click({ delay: 40 });
}

export async function typeInto(page, locator, value, delay = 42) {
  await locator.scrollIntoViewIfNeeded();
  await pointAt(page, locator);
  await locator.click();
  await locator.pressSequentially(value, { delay });
}

export async function showEndCard(page, { title, subtitle, domain = 'ajoflow.com' }) {
  await page.evaluate(({ title, subtitle, domain }) => {
    document.documentElement.style.background = '#0D1A6E';
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;background:radial-gradient(800px 600px at 20% 0%, #1A35D4 0%, #0D1A6E 55%);color:#fff;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center">
        <p style="font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#F5A623;margin-bottom:14px">AjoFlow</p>
        <h1 style="font-size:32px;line-height:1.08;letter-spacing:-0.04em;font-weight:800;margin:0 0 12px">${title}</h1>
        <p style="font-size:15px;line-height:1.45;color:rgba(255,255,255,0.62);max-width:320px;margin:0 0 28px">${subtitle}</p>
        <div style="background:#F5A623;color:#0D1A6E;font-weight:800;font-size:16px;padding:12px 22px;border-radius:999px">${domain}</div>
      </div>
    `;
  }, { title, subtitle, domain });
}

export function saveRecordedWebm(videoDir, destPath) {
  const recorded = readdirSync(videoDir).find((f) => f.endsWith('.webm'));
  if (!recorded) throw new Error('Playwright did not write a video file');
  copyFileSync(join(videoDir, recorded), destPath);
  return destPath;
}
