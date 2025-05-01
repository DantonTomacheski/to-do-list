import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:5173/');
  await page.getByLabel('Select Language').selectOption('en-US');
  await page.getByRole('button', { name: "Let's Start" }).click();
  await page.getByRole('textbox', { name: 'First Name*' }).fill('Danton');
  await page.getByRole('textbox', { name: 'Last Name*' }).fill('Tomacheski');
  await page.getByRole('button', { name: 'Save Profile' }).click();
  await page.waitForURL(/.*dashboard/);

  await context.storageState({ path: 'tests/e2e/state.json' });
  await browser.close();
})();
