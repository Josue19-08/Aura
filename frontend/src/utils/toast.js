import toast from 'react-hot-toast'
import { getErrorDetails } from './errorMessages'

const baseStyle = {
  background: '#1C1C2E',
  color: '#F0F0F5',
  border: '1px solid rgba(136, 136, 170, 0.2)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}

export function notifySuccess(message) {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      ...baseStyle,
      color: '#00E5CC',
      border: '1px solid rgba(0, 229, 204, 0.25)',
    },
    iconTheme: {
      primary: '#00E5CC',
      secondary: '#1C1C2E',
    },
  })
}

export function notifyInfo(message) {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: 'i',
    style: baseStyle,
  })
}

export function notifyError(error) {
  const details = typeof error === 'string' ? { message: error } : getErrorDetails(error)

  toast.error(details.message, {
    duration: 6000,
    position: 'top-right',
    style: {
      ...baseStyle,
      color: '#FF6B35',
      border: '1px solid rgba(255, 107, 53, 0.25)',
    },
    iconTheme: {
      primary: '#FF6B35',
      secondary: '#1C1C2E',
    },
  })
}

export const showSuccess = notifySuccess
export const showInfo = notifyInfo
export const showError = notifyError

export function showLoading(message) {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      ...baseStyle,
      color: '#8888AA',
    },
  })
}
