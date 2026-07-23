import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// REQUEST interceptor: tự động gắn JWT vào header của mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// RESPONSE interceptor: tự động xử lý khi Token hết hạn (401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getAllOrchids  = ()         => api.get('/orchids/')
export const getOrchidById = (id)       => api.get(`/orchids/${id}`)
export const createOrchid  = (data)     => api.post('/orchids/', data)
export const updateOrchid  = (id, data) => api.put(`/orchids/${id}`, data)
export const deleteOrchid  = (id)       => api.delete(`/orchids/${id}`)
export const loginApi      = (data)     => api.post('/auth/login', data)
export const signupApi     = (data)     => api.post('/auth/signup', data)

export default api
