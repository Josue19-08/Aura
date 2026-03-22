import toast from 'react-hot-toast'
import { getErrorDetails } from './errorMessages'

const baseStyle = {
  background: '#1C1C2E',
  color: '#F0F0F5',
  border: '1px solid rgba(136, 136, 170, 0.2)',
}

export function notifySuccess(message) {
  toast.success(message, {
    duration: 4000,
    style: {
      ...baseStyle,
      border: '1px solid rgba(0, 229, 204, 0.25)',
    },
  })
}

export function notifyInfo(message) {
  toast(message, {
    duration: 4000,
    icon: 'i',
    style: baseStyle,
  })
}

export function notifyError(error) {
  const details = typeof error === 'string' ? { message: error } : getErrorDetails(error)

  toast.error(details.message, {
    duration: 6000,
    style: {
      ...baseStyle,
      border: '1px solid rgba(255, 107, 53, 0.25)',
    },
  })
}
