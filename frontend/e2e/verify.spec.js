import { test, expect } from '@playwright/test'
import { expectNoHorizontalOverflow, mockVerifyResponse } from './helpers'

const authenticPayload = {
  success: true,
  data: {
    status: 'authentic',
    verificationCount: 12,
    transactionHash: '0xabc',
    product: {
      id: 42,
      lotId: 'LOT-42',
      productName: 'Ibuprofeno 400mg',
      origin: 'Bogota, Colombia',
      ipfsHash: 'QmHash',
      manufacturer: '0x1234567890abcdef1234567890abcdef12345678',
      createdAt: 1710432000,
    },
    custodyHistory: [
      {
        custodian: '0x1234567890abcdef1234567890abcdef12345678',
        timestamp: 1710432000,
        locationNote: 'Bogota',
      },
    ],
  },
}

const suspiciousPayload = {
  success: true,
  data: {
    ...authenticPayload.data,
    status: 'suspicious',
    verificationCount: 151,
  },
}

test('verifies a product and renders the authentic result state', async ({ page }) => {
  await mockVerifyResponse(page, 42, authenticPayload)
  await page.goto('/verify')

  await page.getByLabel('Product ID').fill('42')
  await page.getByRole('button', { name: 'Verify Product' }).click()

  await expect(page.getByRole('heading', { name: 'AUTHENTIC PRODUCT' })).toBeVisible()
  await expect(page.getByText('Ibuprofeno 400mg')).toBeVisible()
  await expect(page.getByText(/Verification Count/)).toBeVisible()
  await expect(page.getByText(/^12$/)).toBeVisible()
})

test('renders suspicious verification alerts', async ({ page }) => {
  await mockVerifyResponse(page, 151, suspiciousPayload)
  await page.goto('/verify')

  await page.getByLabel('Product ID').fill('151')
  await page.getByRole('button', { name: 'Verify Product' }).click()

  await expect(page.getByRole('heading', { name: 'SUSPICIOUS PRODUCT' })).toBeVisible()
  await expect(page.getByText(/unusually high verification count/i)).toBeVisible()
  await expect(page.getByText(/151/)).toBeVisible()
})

test('shows an actionable error for unknown products', async ({ page }) => {
  await mockVerifyResponse(
    page,
    999,
    {
      success: false,
      error: {
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      },
    },
    404
  )

  await page.goto('/verify')
  await page.getByLabel('Product ID').fill('999')
  await page.getByRole('button', { name: 'Verify Product' }).click()

  const alert = page.getByRole('alert')

  await expect(alert.getByText('Product not found')).toBeVisible()
  await expect(alert.getByText(/This product ID is not registered in Aura/i)).toBeVisible()
  await expect(alert.getByText(/scan the QR code again/i)).toBeVisible()
})

test('keeps the verify page within the mobile viewport', async ({ page }) => {
  await page.goto('/verify')
  await expect(page.getByRole('button', { name: 'Start Camera' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})
