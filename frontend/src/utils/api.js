import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('[API Error]', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const productsAPI = {
  getAll:        ()         => api.get('/api/products'),
  getById:       (id)       => api.get(`/api/products/${id}`),
  getByCategory: (category) => api.get(`/api/products?category=${category}`)
}

export const ordersAPI = {
  create:    (orderData) => api.post('/api/orders', orderData),
  getById:   (id)        => api.get(`/api/orders/${id}`),
  getStatus: (id)        => api.get(`/api/orders/${id}/status`)
}

export default api
