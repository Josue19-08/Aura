import { expect } from '@playwright/test'

export async function mockVerifyResponse(page, productId, payload, status = 200) {
  await page.route(`**/api/products/${productId}/verify`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    })
  })
}

export async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1
  })

  expect(hasOverflow).toBe(false)
}
