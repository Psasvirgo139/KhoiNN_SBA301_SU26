import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

/**
 * Lấy danh sách tất cả restaurants từ API.
 * Endpoint: GET /restaurants
 *
 * @returns {Promise<Array>} mảng restaurant objects
 */
export async function getRestaurants() {
  // TODO: Gọi axios.get(`${BASE_URL}/restaurants`)
  const response = await axios.get(`${BASE_URL}/restaurants`)
  // TODO: Trả về response.data
  return response.data
}

/**
 * Lấy thông tin chi tiết một restaurant.
 * Endpoint: GET /restaurants/:id
 *
 * @param {number|string} id
 * @returns {Promise<object>} restaurant object
 */
export async function getRestaurantById(id) {
  // TODO: Gọi axios.get(`${BASE_URL}/restaurants/${id}`)
  const response = await axios.get(`${BASE_URL}/restaurants/${id}`)
  // TODO: Trả về response.data
  return response.data
}

/**
 * Tạo mới restaurant.
 * Endpoint: POST /restaurants
 *
 * @param {object} restaurantData  { name, category, owner, address, priceFrom, priceTo, openDate }
 * @returns {Promise<object>} restaurant vừa tạo
 */
export async function addRestaurant(restaurantData) {
  // TODO: Gọi axios.post(`${BASE_URL}/restaurants`, restaurantData)
  const response = await axios.post(`${BASE_URL}/restaurants`, restaurantData)
  // TODO: Trả về response.data
  return response.data
}

/**
 * Xóa restaurant.
 * Endpoint: DELETE /restaurants/:id
 *
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteRestaurant(id) {
  // TODO: Gọi axios.delete(`${BASE_URL}/restaurants/${id}`)
  await axios.delete(`${BASE_URL}/restaurants/${id}`)
}
