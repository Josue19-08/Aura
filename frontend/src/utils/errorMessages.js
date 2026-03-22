export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: {
    title: 'Wallet required',
    message: 'Connect a wallet before continuing.',
    action: 'Open the wallet modal and try again.',
  },
  USER_REJECTED: {
    title: 'Transaction rejected',
    message: 'You cancelled the wallet confirmation.',
    action: 'Approve the transaction when you are ready.',
  },
  INSUFFICIENT_FUNDS: {
    title: 'Insufficient funds',
    message: 'Your wallet does not have enough AVAX to complete this action.',
    action: 'Fund the wallet and try again.',
  },
  NETWORK_ERROR: {
    title: 'Network unavailable',
    message: 'Aura could not reach the blockchain or API.',
    action: 'Check your connection and retry in a moment.',
  },
  PRODUCT_NOT_FOUND: {
    title: 'Product not found',
    message: 'This product ID is not registered in Aura.',
    action: 'Verify the ID or scan the QR code again.',
  },
  PRODUCT_INACTIVE: {
    title: 'Product deactivated',
    message: 'This product has been marked as inactive.',
    action: 'Contact the manufacturer for more information.',
  },
  NOT_CUSTODIAN: {
    title: 'Transfer not allowed',
    message: 'Only the current custodian can transfer this product.',
    action: 'Connect with the current custodian wallet.',
  },
  INVALID_ADDRESS: {
    title: 'Invalid address',
    message: 'The new custodian address is not valid.',
    action: 'Paste a valid EVM wallet address.',
  },
  IPFS_ERROR: {
    title: 'Metadata storage failed',
    message: 'Aura could not upload the metadata to IPFS.',
    action: 'Retry the upload in a few moments.',
  },
  VALIDATION_ERROR: {
    title: 'Invalid data',
    message: 'Some fields are missing or contain invalid values.',
    action: 'Review the form and correct the highlighted data.',
  },
  DEFAULT: {
    title: 'Something went wrong',
    message: 'Aura could not complete the requested action.',
    action: 'Retry the action or refresh the page.',
  },
}

const ERROR_PATTERNS = [
  { match: /wallet not connected/i, code: 'WALLET_NOT_CONNECTED' },
  { match: /user rejected|rejected the request|user denied|user rejected transaction/i, code: 'USER_REJECTED' },
  { match: /insufficient funds/i, code: 'INSUFFICIENT_FUNDS' },
  { match: /network error|network unavailable|fetch failed|failed to fetch|network request failed/i, code: 'NETWORK_ERROR' },
  { match: /product not found|not registered|productnotfound/i, code: 'PRODUCT_NOT_FOUND' },
  { match: /productinactive|product inactive|deactivated/i, code: 'PRODUCT_INACTIVE' },
  { match: /not current custodian|not the current custodian|notcurrentcustodian/i, code: 'NOT_CUSTODIAN' },
  { match: /invalid ethereum address|invalid address/i, code: 'INVALID_ADDRESS' },
  { match: /ipfs|pinata/i, code: 'IPFS_ERROR' },
  { match: /validation|required/i, code: 'VALIDATION_ERROR' },
]

export function getErrorDetails(error) {
  const code = error?.code || error?.response?.data?.error?.code
  const message = error?.message || error?.response?.data?.error?.message || error?.toString?.() || ''

  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code]
  }

  const pattern = ERROR_PATTERNS.find(({ match }) => match.test(message))
  if (pattern) {
    return ERROR_MESSAGES[pattern.code]
  }

  return ERROR_MESSAGES.DEFAULT
}

export function getErrorMessage(error) {
  return getErrorDetails(error)
}
