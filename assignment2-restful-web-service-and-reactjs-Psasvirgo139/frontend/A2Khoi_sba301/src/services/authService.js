// TODO-08: goi API dang nhap
import api from './api'

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}
