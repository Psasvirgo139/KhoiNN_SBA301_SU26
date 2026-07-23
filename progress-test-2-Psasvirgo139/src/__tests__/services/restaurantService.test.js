/**
 * Test suite — restaurantService.js
 * Mock axios để kiểm tra các hàm gọi API đúng endpoint.
 */
import axios from 'axios'
import {
  getRestaurants,
  getRestaurantById,
  addRestaurant,
  deleteRestaurant,
} from '../../services/restaurantService'

vi.mock('axios')

const BASE = 'http://localhost:8080'

const MOCK_RESTAURANTS = [
  { id: 1, name: 'BBQ Restaurant', category: 'Casual', owner: 'Hoang', address: 'Hang Bai', priceFrom: 1000, priceTo: 20000, openDate: '2025-01-20' },
  { id: 2, name: 'Pho 24', category: 'Fast Food', owner: 'Nguyen', address: 'Le Loi', priceFrom: 35000, priceTo: 80000, openDate: '2024-06-15' },
]

// ─── getRestaurants ───────────────────────────────────────────────────────────

describe('getRestaurants()', () => {
  test('gọi đúng endpoint GET /restaurants', async () => {
    axios.get.mockResolvedValue({ data: MOCK_RESTAURANTS })
    await getRestaurants()
    expect(axios.get).toHaveBeenCalledWith(`${BASE}/restaurants`)
  })

  test('trả về mảng restaurants', async () => {
    axios.get.mockResolvedValue({ data: MOCK_RESTAURANTS })
    const result = await getRestaurants()
    expect(result).toEqual(MOCK_RESTAURANTS)
  })
})

// ─── getRestaurantById ────────────────────────────────────────────────────────

describe('getRestaurantById()', () => {
  test('gọi đúng endpoint GET /restaurants/:id', async () => {
    axios.get.mockResolvedValue({ data: MOCK_RESTAURANTS[0] })
    await getRestaurantById(1)
    expect(axios.get).toHaveBeenCalledWith(`${BASE}/restaurants/1`)
  })

  test('trả về đúng restaurant object', async () => {
    axios.get.mockResolvedValue({ data: MOCK_RESTAURANTS[0] })
    const result = await getRestaurantById(1)
    expect(result).toEqual(MOCK_RESTAURANTS[0])
  })
})

// ─── addRestaurant ────────────────────────────────────────────────────────────

describe('addRestaurant()', () => {
  const newData = { name: 'New Place', category: 'Cafe', owner: 'Test', address: 'HN', priceFrom: 5000, priceTo: 50000, openDate: '2024-01-01' }

  test('gọi đúng endpoint POST /restaurants', async () => {
    axios.post.mockResolvedValue({ data: { id: 99, ...newData } })
    await addRestaurant(newData)
    expect(axios.post).toHaveBeenCalledWith(`${BASE}/restaurants`, newData)
  })

  test('trả về restaurant vừa tạo', async () => {
    const created = { id: 99, ...newData }
    axios.post.mockResolvedValue({ data: created })
    const result = await addRestaurant(newData)
    expect(result).toEqual(created)
  })
})

// ─── deleteRestaurant ─────────────────────────────────────────────────────────

describe('deleteRestaurant()', () => {
  test('gọi đúng endpoint DELETE /restaurants/:id', async () => {
    axios.delete.mockResolvedValue({})
    await deleteRestaurant(1)
    expect(axios.delete).toHaveBeenCalledWith(`${BASE}/restaurants/1`)
  })
})
