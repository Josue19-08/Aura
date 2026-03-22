export const ERROR_MESSAGES = {
  // Wallet Errors
  'user rejected transaction': {
    title: 'Transaction Rejected',
    message: 'You cancelled the transaction. No changes were made.',
    action: 'Try again when ready'
  },
  'insufficient funds': {
    title: 'Insufficient Funds',
    message: "You don't have enough AVAX to complete this transaction.",
    action: 'Add AVAX to your wallet from the faucet'
  },
  'network error': {
    title: 'Network Error',
    message: 'Unable to connect to Avalanche network.',
    action: 'Check your internet connection and try again'
  },
  'user denied': {
    title: 'Permission Denied',
    message: 'You denied the wallet connection request.',
    action: 'Connect your wallet to continue'
  },

  // Contract Errors
  'NotCurrentCustodian': {
    title: 'Unauthorized Transfer',
    message: 'Only the current custodian can transfer this product.',
    action: 'Verify you are using the correct wallet'
  },
  'ProductNotFound': {
    title: 'Product Not Found',
    message: "This product ID doesn't exist in our system.",
    action: 'Double-check the product ID and try again'
  },
  'ProductInactive': {
    title: 'Product Deactivated',
    message: 'This product has been marked as inactive.',
    action: 'Contact the manufacturer for more information'
  },
  'AlreadyRegistered': {
    title: 'Already Registered',
    message: 'This product has already been registered.',
    action: 'Use a unique product ID'
  },

  // Validation Errors
  'VALIDATION_ERROR': {
    title: 'Invalid Input',
    message: 'Some fields contain invalid data.',
    action: 'Please review and correct the highlighted fields'
  },
  'required': {
    title: 'Required Field',
    message: 'This field is required.',
    action: 'Please fill in all required fields'
  },

  // IPFS Errors
  'IPFS_ERROR': {
    title: 'Storage Error',
    message: 'Unable to upload metadata to decentralized storage.',
    action: 'Please try again in a few moments'
  },
  'Failed to fetch': {
    title: 'Connection Error',
    message: 'Unable to connect to the server.',
    action: 'Check your internet connection'
  },

  // API Errors
  'Network request failed': {
    title: 'Network Error',
    message: 'Unable to reach the server.',
    action: 'Please check your connection and try again'
  },
  '404': {
    title: 'Not Found',
    message: 'The requested resource was not found.',
    action: 'Verify the information and try again'
  },
  '500': {
    title: 'Server Error',
    message: 'An error occurred on the server.',
    action: 'Please try again later'
  },

  // Default
  default: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred.',
    action: 'Please try again or contact support if the problem persists'
  }
}

export function getErrorMessage(error) {
  if (!error) return ERROR_MESSAGES.default

  const errorString = error.message || error.toString()

  // Check for known error patterns
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (errorString.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  return ERROR_MESSAGES.default
}
