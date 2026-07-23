// TODO-08: goi API quan ly account
import api from './api'

export async function getAccounts() {
  const response = await api.get('/accounts')
  return response.data
}

export async function getAccountById(id) {
  const response = await api.get(`/accounts/${id}`)
  return response.data
}

export async function searchAccounts(keyword) {
  const response = await api.get('/accounts/search', { params: { q: keyword } })
  return response.data
}

export async function createAccount(account) {
  const response = await api.post('/accounts', account)
  return response.data
}

export async function updateAccount(id, account) {
  const response = await api.put(`/accounts/${id}`, account)
  return response.data
}

export async function deleteAccount(id) {
  await api.delete(`/accounts/${id}`)
}
