import { expect, test } from '@playwright/test';

test('home page renders', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
});

test('health endpoint reports status', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(['unconfigured', 'ok', 'error']).toContain(body.database);
});

test('sign-out is POST only', async ({ request }) => {
    const response = await request.get('/auth/signout');
    expect(response.status()).toBe(404);
});
