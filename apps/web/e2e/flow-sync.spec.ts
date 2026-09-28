import { expect, test } from '@playwright/test'

test('payday to reviewed Flow Sync suggestion', async ({ page }, testInfo) => {
  const consoleErrors: string[] = []
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('pageerror', error => consoleErrors.push(error.message))
  await page.goto('/')
  await expect(page.getByText('Good morning, Alex')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('desktop-home.png'), fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('link', { name: /Your monthly plan/i }).click()
  await expect(page.getByText('Make payday feel more intentional')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('desktop-flow-sync.png'), fullPage: true })
  const acceptPlan = page.getByRole('button', { name: /Accept this plan/i })
  if (await acceptPlan.isVisible()) {
    await acceptPlan.click()
    await expect(page.getByText(/No money was moved/i)).toBeVisible()
  } else {
    await expect(page.getByRole('button', { name: 'Plan reviewed' })).toBeVisible()
  }
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.getByText('Good morning, Alex')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('link', { name: /Your monthly plan/i }).click()
  await expect(page.getByText('Make payday feel more intentional')).toBeVisible()
  await expect(page.locator('.sidebar')).not.toHaveClass(/sidebar-open/)
  await expect.poll(() => page.locator('.sidebar').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41)).toBeLessThan(-250)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('mobile-flow-sync.png'), fullPage: true, animations: 'disabled' })
  expect(consoleErrors).toEqual([])
})
