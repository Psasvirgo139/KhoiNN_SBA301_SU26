import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export const searchShoes = async (name, category, page = 0, size = 5) => {
  const params = { page, size }
  if (name) params.name = name
  if (category) params.category = category
  const res = await axios.get(`${API_BASE}/shoes/search`, { params })
  return res.data
}

export const getShoesById = async (id) => {
  const res = await axios.get(`${API_BASE}/shoes/${id}`)
  return res.data
}

export const createShoes = async (shoes) => {
  const res = await axios.post(`${API_BASE}/shoes`, shoes)
  return res.data
}

export const deleteShoes = async (id) => {
  await axios.delete(`${API_BASE}/shoes/${id}`)
}

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`)
  return res.data
}
