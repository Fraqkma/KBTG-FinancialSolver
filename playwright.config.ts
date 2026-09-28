import { defineConfig, devices } from '@playwright/test'
export default defineConfig({ testDir: './apps/web/e2e', fullyParallel: true, reporter: 'list', use: { ...devices['Desktop Chrome'], channel: 'msedge', baseURL: 'http://127.0.0.1:5173' } })
