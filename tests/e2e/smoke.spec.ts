import { test, expect, type Page } from '@playwright/test';

async function holdTempo(page: Page, ms = 450) {
  const hold = page.getByTestId('tempo-hold');
  await hold.waitFor({ state: 'visible', timeout: 12_000 });
  const box = await hold.boundingBox();
  if (!box) throw new Error('no hold target');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

async function playTempo(page: Page) {
  for (let round = 0; round < 5; round++) {
    await page.getByTestId('start-round').click();
    await holdTempo(page);
    const next = page.getByTestId('next-round');
    await next.waitFor({ state: 'visible', timeout: 12_000 });
    await next.click();
  }
}

test('home loads and lists games', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/(en|pt)$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /Tempo/i }).first()).toBeVisible();
});

test('play Tempo end-to-end and reach the result screen', async ({ page }) => {
  await page.goto('/en/play/tempo/play?mode=easy');
  // No ads during gameplay.
  await expect(page.getByTestId('ad-slot')).toHaveCount(0);
  await playTempo(page);
  await expect(page.getByTestId('result-screen')).toBeVisible({ timeout: 12_000 });
});

test('submit a score and see it on the leaderboard (local fallback)', async ({ page }) => {
  await page.goto('/en/play/tempo/play?mode=easy');
  await playTempo(page);
  await expect(page.getByTestId('result-screen')).toBeVisible({ timeout: 12_000 });

  await page.getByPlaceholder(/anonymous/i).fill('E2E Tester');
  await page.getByRole('button', { name: /submit/i }).click();

  await page.goto('/en/leaderboard/tempo');
  await expect(page.getByText('E2E Tester')).toBeVisible({ timeout: 12_000 });
});

test('a challenge link replays identical targets', async ({ page }) => {
  const url = '/en/play/tempo/play?c=Determin1stic&mode=easy';
  await page.goto(url);
  await page.getByTestId('start-round').click();
  const target = page.getByTestId('current-target');
  await target.waitFor({ state: 'attached', timeout: 12_000 });
  const first = await target.textContent();

  await page.goto(url);
  await page.getByTestId('start-round').click();
  await page.getByTestId('current-target').waitFor({ state: 'attached', timeout: 12_000 });
  const second = await page.getByTestId('current-target').textContent();

  expect(first).not.toBeNull();
  expect(first).toBe(second);
});

test('locale switches between EN and PT', async ({ page }) => {
  await page.goto('/en');
  await page.getByTestId('locale-pt').click();
  await expect(page).toHaveURL(/\/pt/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/sentidos/i);
});
