import { registerProduct } from './api'

/**
 * Parse CSV text into an array of product objects.
 * Expected columns: lotId, productName, origin (required); manufacturer, expirationDate (optional)
 */
export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return { products: [], errors: [{ row: 0, errors: ['File is empty or missing header row'] }] }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const products = []
  const errors = []

  lines.slice(1).forEach((line, idx) => {
    const row = idx + 2 // 1-indexed, skip header
    const values = line.split(',').map(v => v.trim())
    const entry = {}
    headers.forEach((h, i) => { entry[h] = values[i] || '' })

    const rowErrors = []
    if (!entry.lotid && !entry.lotId) rowErrors.push('Missing lotId')
    if (!entry.productname && !entry.productName) rowErrors.push('Missing productName')
    if (!entry.origin) rowErrors.push('Missing origin')

    if (rowErrors.length > 0) {
      errors.push({ row, errors: rowErrors })
    } else {
      products.push({
        lotId: entry.lotid || entry.lotId,
        productName: entry.productname || entry.productName,
        origin: entry.origin,
        metadata: {
          manufacturer: entry.manufacturer || '',
          expirationDate: entry.expirationdate || entry.expirationDate || ''
        }
      })
    }
  })

  return { products, errors }
}

/**
 * Register products one by one, reporting progress via the onProgress callback.
 * @param {Array} products - validated product objects
 * @param {Function} onProgress - called after each attempt with progress state
 * @returns {{ results, successCount, failCount }}
 */
export async function registerProductsBatch(products, onProgress) {
  const results = []
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    try {
      const result = await registerProduct(product)
      results.push({ success: true, product, result })
      successCount++
    } catch (error) {
      results.push({ success: false, product, error: error.message || 'Unknown error' })
      failCount++
    }

    onProgress({
      current: i + 1,
      total: products.length,
      successCount,
      failCount,
      percentage: Math.round(((i + 1) / products.length) * 100)
    })

    // Small delay to avoid rate limiting
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return { results, successCount, failCount }
}

/**
 * Generate a downloadable CSV of registration results.
 */
export function exportResultsCSV(results) {
  const header = 'lotId,productName,origin,status,productId,error'
  const rows = results.map(r => {
    const p = r.product
    const status = r.success ? 'success' : 'failed'
    const productId = r.result?.data?.productId ?? ''
    const error = r.error ? `"${r.error.replace(/"/g, '""')}"` : ''
    return `${p.lotId},${p.productName},${p.origin},${status},${productId},${error}`
  })
  return [header, ...rows].join('\n')
}

export const CSV_TEMPLATE = `lotId,productName,origin,manufacturer,expirationDate
LOT-2024-001,Ibuprofeno 400mg,Bogotá Colombia,Pharma Corp,2027-03-15
LOT-2024-002,Acetaminofen 500mg,Medellín Colombia,Pharma Corp,2027-04-20`
