/**
 * Mobile walkthrough: signup → login → generate account → fund wallet.
 * Usage: node scripts/record-wallet-demo.mjs
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
const htmlPath = join(demoDir, 'dashboard-fund-walkthrough.html');
const email = 'adaeze.demo@email.com';
const password = 'SaveTogether1';

resetVideoDir(videoDir);
await waitForApp(BASE_URL);

const { browser, context, page } = await launchRecordedPage(videoDir);

async function blockSubmit(page) {
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
}

try {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await installOverlay(page);
  await caption(page, 'Sign up on your phone');
  await sleep(1600);

  const startCta = page.getByRole('button', { name: /Start Saving/i }).first();
  await startCta.waitFor({ state: 'visible' });
  await caption(page, 'Create your account');
  await tap(page, startCta);
  await page.waitForURL('**/signup**');
  await page.waitForLoadState('networkidle');
  await installOverlay(page);
  await sleep(700);
  await blockSubmit(page);

  await caption(page, 'Enter your details');
  await typeInto(page, page.getByLabel('Full name'), 'Adaeze Okonkwo', 48);
  await typeInto(page, page.getByLabel('Email address'), email, 32);
  await typeInto(page, page.locator('#signup-phone'), '08031234567', 45);
  await typeInto(page, page.locator('#signup-password'), password, 36);
  await typeInto(page, page.locator('#signup-confirm-password'), password, 32);

  await caption(page, 'Agree and create account');
  await tap(page, page.locator('form input[type="checkbox"]').first().locator('xpath=..'));
  await sleep(250);
  await tap(page, page.getByRole('button', { name: 'Create account' }));
  await sleep(800);

  await page.evaluate((pendingEmail) => {
    const card = document.querySelector('#auth-main .rounded-2xl.border.bg-white') || document.querySelector('section')?.parentElement;
    if (!card) return;
    card.innerHTML = `
      <section class="space-y-6">
        <div class="flex flex-col items-center text-center space-y-4 pt-2">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl" style="background:#1A35D41A">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A35D4" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em]" style="color:#F5A623">One more step</p>
            <h2 class="mt-2 text-[1.6rem] leading-tight" style="color:#0D1A6E">Check your inbox.</h2>
            <p class="mt-2 text-sm text-slate-500">We sent a verification link to <span class="font-semibold" style="color:#0D1A6E">${pendingEmail}</span>.</p>
          </div>
        </div>
      </section>
    `;
  }, email);
  await installOverlay(page);
  await caption(page, 'Verify email, then sign in');
  await sleep(2200);

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await installOverlay(page);
  await caption(page, 'Sign in to your account');
  await sleep(800);
  await blockSubmit(page);

  await typeInto(page, page.getByLabel('Email address'), email, 32);
  await typeInto(page, page.locator('#login-password'), password, 36);
  await caption(page, 'Tap Sign in');
  await tap(page, page.getByRole('button', { name: 'Sign in' }));
  await sleep(900);

  await page.goto(`file://${htmlPath}`);
  await installOverlay(page);
  await caption(page, 'Wallet starts at ₦0.00');
  await sleep(1800);

  await caption(page, 'Tap Add Money');
  await tap(page, page.locator('#btn-add-money'));
  await sleep(700);

  await caption(page, 'Generate your account number');
  await tap(page, page.locator('#btn-generate'));
  await page.locator('#acct-no').waitFor({ state: 'visible' });
  await sleep(2000);

  await caption(page, 'Transfer ₦25,000 to this account');
  await sleep(2400);

  await caption(page, 'Check for the deposit');
  await tap(page, page.locator('#btn-check'));
  await page.locator('#credited.show').waitFor({ state: 'visible' });
  await sleep(2200);

  await caption(page, 'Balance is now ₦25,000.00');
  await tap(page, page.locator('#back-ready'));
  await sleep(2400);

  await showEndCard(page, {
    title: 'From signup to funded.',
    subtitle: 'Create an account, sign in, generate your number, and watch the amount land.',
    domain: 'ajoflow.com',
  });
  await sleep(3200);
} finally {
  await context.close();
  await browser.close();
}

const dest = saveRecordedWebm(videoDir, join(demoDir, 'ajoflow-wallet-demo.webm'));
console.log(dest);
