/**
 * Records a 9:16 signup walkthrough for TikTok / WhatsApp / Reels.
 * Usage: node scripts/record-signup-demo.mjs
 */
import { join } from 'node:path';
import {
  caption,
  demoPaths,
  installOverlay,
  launchRecordedPage,
  resetVideoDir,
  saveRecordedWebm,
  showEndCard,
  sleep,
  tap,
  typeInto,
  waitForApp,
} from './lib/demo-record.mjs';

const { demoDir, videoDir } = demoPaths(import.meta.url);
const BASE_URL = process.env.DEMO_URL || 'http://127.0.0.1:3001';

resetVideoDir(videoDir);
await waitForApp(BASE_URL);

const { browser, context, page } = await launchRecordedPage(videoDir);

try {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await installOverlay(page);
  await caption(page, 'Open AjoFlow');
  await sleep(2200);

  const startCta = page.getByRole('button', { name: /Start Saving/i }).first();
  await startCta.waitFor({ state: 'visible' });
  await caption(page, 'Tap Start Saving');
  await tap(page, startCta);
  await page.waitForURL('**/signup**');
  await page.waitForLoadState('networkidle');
  await installOverlay(page);
  await caption(page, 'Create your account');
  await sleep(1400);

  await page.evaluate(() => {
    document.querySelector('form')?.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      },
      true,
    );
  });

  const email = 'adaeze.demo@email.com';
  await caption(page, 'Enter your name');
  await typeInto(page, page.getByLabel('Full name'), 'Adaeze Okonkwo', 70);
  await sleep(500);

  await caption(page, 'Add your email');
  await typeInto(page, page.getByLabel('Email address'), email, 55);
  await sleep(450);

  await caption(page, 'Add your phone number');
  await typeInto(page, page.locator('#signup-phone'), '08031234567', 70);
  await sleep(450);

  await caption(page, 'Create a password');
  await typeInto(page, page.locator('#signup-password'), 'SaveTogether1', 60);
  await sleep(350);
  await typeInto(page, page.locator('#signup-confirm-password'), 'SaveTogether1', 50);
  await sleep(400);

  const terms = page.locator('form input[type="checkbox"]').first();
  await caption(page, 'Agree to terms');
  await tap(page, terms.locator('xpath=..'));
  await sleep(400);

  const submit = page.getByRole('button', { name: 'Create account' });
  await caption(page, 'Create account');
  await tap(page, submit);
  await sleep(1100);

  await page.evaluate((pendingEmail) => {
    const card = document.querySelector('#auth-main .rounded-2xl.border.bg-white') || document.querySelector('section')?.parentElement;
    if (!card) return;
    card.innerHTML = `
      <section class="space-y-6">
        <div class="flex flex-col items-center text-center space-y-4 pt-2">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl" style="background:#1A35D41A">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A35D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em]" style="color:#F5A623">One more step</p>
            <h2 class="mt-2 text-[1.85rem] leading-tight" style="color:#0D1A6E">
              <span style="font-style:italic;font-weight:400">Check your </span>
              <span style="font-weight:800;letter-spacing:-0.02em">inbox.</span>
            </h2>
            <p class="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
              We sent a verification link to
              <span class="font-semibold" style="color:#0D1A6E"> ${pendingEmail}</span>.
              Click the link in that email to activate your savings account.
            </p>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-3">
          ${[
            ['1', 'Open the email from AjoFlow'],
            ['2', 'Click the "Verify my email" button'],
            ['3', "You'll be redirected to your dashboard"],
          ].map(([step, text]) => `
            <div class="flex items-center gap-3">
              <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style="background:#1A35D4">${step}</div>
              <p class="text-sm text-slate-600">${text}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }, email);
  await installOverlay(page);
  await caption(page, 'Verify your email — then you are in');
  await sleep(4200);

  await showEndCard(page, {
    title: 'Start saving today.',
    subtitle: 'Create your account in minutes. Verify your email, then join a group.',
    domain: 'ajoflow.com',
  });
  await sleep(3600);
} finally {
  await context.close();
  await browser.close();
}

const dest = saveRecordedWebm(videoDir, join(demoDir, 'ajoflow-signup-demo.webm'));
console.log(dest);
