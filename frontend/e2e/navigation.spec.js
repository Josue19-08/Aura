import { test, expect } from '@playwright/test'
import { expectNoHorizontalOverflow } from './helpers'

test('opens and closes the keyboard shortcut dialog', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('?')
  await expect(page.getByRole('dialog', { name: 'Keyboard Help' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Keyboard Help' })).toHaveCount(0)
})

test('wallet-required routes render the connect prompt', async ({ page }) => {
  await page.goto('/register')
  await expect(page.getByRole('heading', { name: 'Register Product' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Connect Wallet' })).toBeVisible()

  await page.goto('/transfer')
  await expect(page.getByRole('heading', { name: 'Transfer Custody' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Connect Wallet' })).toBeVisible()
})

test('mobile navigation does not overflow the viewport', async ({ page }) => {
  await page.goto('/')
  await expectNoHorizontalOverflow(page)
})
