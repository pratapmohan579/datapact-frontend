import { test, expect } from '@playwright/test';

test.describe('DataPact Enterprise E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate and set local storage auth mock for E2E
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('DATAPACT_API_KEY', 'e2e-test-key');
      localStorage.setItem('DATAPACT_WORKSPACE_ID', 'test-workspace');
    });
  });

  test('Dashboard loads and displays live metrics', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Workspace Health')).toBeVisible();
    await expect(page.locator('text=Data Quality Score')).toBeVisible();
    await expect(page.locator('text=Active Contracts')).toBeVisible();
    await expect(page.locator('text=Open Incidents')).toBeVisible();
  });

  test('Contracts table loads live data via TanStack Query', async ({ page }) => {
    await page.goto('/contracts');
    await expect(page.locator('text=Contract Registry')).toBeVisible();
    
    // Check if the tanstack table renders the headers
    await expect(page.locator('text=Name')).toBeVisible();
    await expect(page.locator('text=Source')).toBeVisible();
    await expect(page.locator('text=Table')).toBeVisible();
  });

  test('Asset Catalog renders successfully', async ({ page }) => {
    await page.goto('/assets');
    await expect(page.locator('text=Asset Catalog')).toBeVisible();
    await expect(page.locator('input[placeholder="Search by asset name, type, or source..."]')).toBeVisible();
  });
});
