import { test, expect } from './auth-fixture';

test('verifica elementos vazios na dashboard', async ({ page }) => {

  await page.getByText('No task groups yet').click();
  await expect(page.locator('#root')).toContainText('No task groups yet');
  await expect(page.getByText('No projects in progress yet')).toBeVisible();
});