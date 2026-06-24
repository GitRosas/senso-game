import { defineConfig, devices } from '@playwright/test';
import os from 'node:os';
import path from 'node:path';

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

// Keep Playwright artefacts OUT of the OneDrive-synced project dir: OneDrive
// holds file locks that make `rmdir test-results` fail with EPERM on Windows.
const ARTIFACT_DIR = path.join(os.tmpdir(), 'senso-playwright');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: path.join(ARTIFACT_DIR, 'results'),
  reporter: process.env.CI
    ? 'line'
    : [['html', { open: 'never', outputFolder: path.join(ARTIFACT_DIR, 'report') }], ['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    locale: 'en-US',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Default to the production server (`next start`) — it doesn't rewrite `.next`
    // and is far more stable than `next dev` under parallel workers, especially on
    // OneDrive-synced paths. `pnpm check` always builds first. Set E2E_DEV=1 to use
    // the dev server instead (requires no prior build).
    command: process.env.E2E_DEV ? `pnpm dev --port ${PORT}` : `pnpm start --port ${PORT}`,
    url: baseURL,
    // Always start a fresh server — never silently reuse a stale/broken one on 3000.
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
