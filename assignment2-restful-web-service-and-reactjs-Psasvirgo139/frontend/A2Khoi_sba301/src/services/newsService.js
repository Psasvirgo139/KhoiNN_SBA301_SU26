// TODO-08: goi API quan ly news article
import api from './api'

export async function getPublicNews() {
  const response = await api.get('/news/public')
  return response.data
}

export async function getNews() {
  const response = await api.get('/news')
  return response.data
}

export async function getNewsById(id) {
  const response = await api.get(`/news/${id}`)
  return response.data
}

export async function searchNews(keyword) {
  const response = await api.get('/news/search', { params: { q: keyword } })
  return response.data
}

export async function getNewsHistory(accountId) {
  const response = await api.get(`/news/history/${accountId}`)
  return response.data
}

export async function createNews(news) {
  const response = await api.post('/news', news)
  return response.data
}

export async function updateNews(id, news) {
  const response = await api.put(`/news/${id}`, news)
  return response.data
}

export async function deleteNews(id) {
  await api.delete(`/news/${id}`)
}
