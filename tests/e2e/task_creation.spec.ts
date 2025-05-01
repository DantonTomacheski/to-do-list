import { test, expect } from './auth-fixture';

test('Create a new task and verify it appears', async ({ page }) => {
  await page.getByRole('link', { name: 'Calendar' }).click();
  await page.getByRole('button', { name: 'Add a task' }).click();
  await page.getByRole('textbox', { name: 'Task Title' }).click();
  await page.getByRole('textbox', { name: 'Task Title' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Task Title' }).fill('T');
  await page.getByRole('textbox', { name: 'Task Title' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Task Title' }).fill('Task do dantinho');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('task descriptionnn');
  await page.getByRole('button', { name: 'High' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByLabel('Task Task do dantinho, status').getByRole('heading')).toContainText('Task do dantinho');
  await page.getByText('to-do').nth(1).click();
  await expect(page.getByLabel('Task Task do dantinho, status').getByLabel('Change status')).toContainText('inprogress');
});