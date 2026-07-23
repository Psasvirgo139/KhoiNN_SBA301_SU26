// TODO-08: goi API quan ly category
import api from './api'

export async function getCategories() {
  const response = await api.get('/categories')
  return response.data
}

export async function searchCategories(keyword) {
  const response = await api.get('/categories/search', { params: { q: keyword } })
  return response.data
}

export async function createCategory(category) {
  const response = await api.post('/categories', category)
  return response.data
}

export async function updateCategory(id, category) {
  const response = await api.put(`/categories/${id}`, category)
  return response.data
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`)
}
