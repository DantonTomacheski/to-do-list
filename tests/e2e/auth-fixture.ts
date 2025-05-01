import { test as base, expect } from '@playwright/test';

// Define uma fixture personalizada que estende o objeto 'page' padrão do Playwright
export const test = base.extend({
  // Sobrescreve a fixture 'page' para executar o onboarding antes dos testes
  page: async ({ page }, use) => {
    // Fazer o onboarding
    await page.goto('http://localhost:5173/');
    await page.getByLabel('Select Language').selectOption('en-US');
    await page.getByRole('button', { name: 'Let\'s Start' }).click();
    await page.getByRole('textbox', { name: 'First Name*' }).click();
    await page.getByRole('textbox', { name: 'First Name*' }).fill('Danton');
    await page.getByRole('textbox', { name: 'First Name*' }).press('Tab');
    await page.getByRole('textbox', { name: 'Last Name*' }).fill('Tomacheski');
    await page.getByRole('button', { name: 'Save Profile' }).click();
    
    // Aguardar redirecionamento para o dashboard
    await page.waitForURL(/.*dashboard/);
    
    // Passa a página autenticada para o teste
    await use(page);
  },
});

// Exporta expect para uso nos arquivos de teste
export { expect };
