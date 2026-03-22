import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Normalizes axios responses so callers can consume backend payloads without
 * repeating `.data` checks in every screen.
 */
const unwrapData = (response) => response?.data ?? response

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Preserve backend error codes so shared UI error messaging can stay specific.
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const errorPayload = error.response?.data?.error
    const message = typeof errorPayload === 'string'
      ? errorPayload
      : errorPayload?.message || error.message || 'An error occurred'
    const apiError = new Error(message)

    if (errorPayload?.code) {
      apiError.code = errorPayload.code
    }

    if (error.response) {
      apiError.response = error.response
    }

    return Promise.reject(apiError)
  }
)

// Product APIs
export const verifyProduct = async (productId) => {
  const response = await api.post(`/products/${productId}/verify`)
  return unwrapData(response)
}

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}/history`)
  const data = unwrapData(response)

  return {
    ...data.product,
    custodyHistory: data.history,
    currentCustodian: data.currentCustodian,
    metadata: data.metadata,
  }
}

export const registerProduct = async (productData) => {
  return api.post('/products/register', productData)
}

export const transferCustody = async (transferData) => {
  return api.post('/products/transfer', transferData)
}

// IPFS APIs
export const uploadToIPFS = async (metadata, files) => {
  const formData = new FormData()

  // Add metadata as JSON
  formData.append('metadata', JSON.stringify(metadata))

  // Add files
  if (files.certificates) {
    Array.from(files.certificates).forEach((file) => {
      formData.append('certificates', file)
    })
  }

  if (files.images) {
    Array.from(files.images).forEach((file) => {
      formData.append('images', file)
    })
  }

  const response = await api.post('/ipfs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return unwrapData(response).ipfsHash
}

export const getFromIPFS = async (hash) => {
  const response = await api.get(`/ipfs/${hash}`)
  return unwrapData(response).metadata
}

// Stats API
export const getStats = async () => {
  const response = await api.get('/stats')
  return unwrapData(response)
}

export default api
