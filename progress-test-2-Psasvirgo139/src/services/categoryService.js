import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

/**
 * Lấy danh sách categories từ API.
 * Endpoint: GET /categories
 *
 * @returns {Promise<Array>} mảng category objects [{ id, name }]
 */
export async function getCategories() {
  // TODO: Gọi axios.get(`${BASE_URL}/categories`)
  const response = await axios.get(`${BASE_URL}/categories`)
  // TODO: Trả về response.data
  return response.data
}

/**
 * Thêm danh mục mới vào API.
 * Endpoint: POST /categories
 *
 * @param {object} categoryData  { id, name }
 * @returns {Promise<object>} category vừa tạo
 */
export async function addCategory(categoryData) {
  const response = await axios.post(`${BASE_URL}/categories`, categoryData)
  return response.data
}

/**
 * Xóa danh mục qua API.
 * Endpoint: DELETE /categories/:id
 *
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  await axios.delete(`${BASE_URL}/categories/${id}`)
}

