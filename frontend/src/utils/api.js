import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// Product APIs
export const verifyProduct = async (productId) => {
  return api.get(`/products/verify/${productId}`)
}

export const getProduct = async (productId) => {
  return api.get(`/products/${productId}`)
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

  return response.ipfsHash
}

export const getFromIPFS = async (hash) => {
  return api.get(`/ipfs/${hash}`)
}

// Stats API
export const getStats = async () => {
  return api.get('/stats')
}

export default api
