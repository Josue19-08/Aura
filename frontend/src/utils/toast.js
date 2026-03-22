import toast from 'react-hot-toast'

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#1C1C2E',
      color: '#00E5CC',
      border: '1px solid rgba(0, 229, 204, 0.2)',
      backdropFilter: 'blur(20px)'
    },
    iconTheme: {
      primary: '#00E5CC',
      secondary: '#1C1C2E'
    }
  })
}

export const showError = (message) => {
  toast.error(message, {
    duration: 6000,
    position: 'top-right',
    style: {
      background: '#1C1C2E',
      color: '#FF6B35',
      border: '1px solid rgba(255, 107, 53, 0.2)',
      backdropFilter: 'blur(20px)'
    },
    iconTheme: {
      primary: '#FF6B35',
      secondary: '#1C1C2E'
    }
  })
}

export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#1C1C2E',
      color: '#F0F0F5',
      backdropFilter: 'blur(20px)'
    }
  })
}

export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#1C1C2E',
      color: '#8888AA',
      backdropFilter: 'blur(20px)'
    }
  })
}
