// TODO-08: goi API lay danh sach tag
import api from './api'

export async function getTags() {
  const response = await api.get('/tags')
  return response.data
}
