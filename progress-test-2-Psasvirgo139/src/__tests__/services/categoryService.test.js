/**
 * Test suite — categoryService.js
 */
import axios from 'axios'
import { getCategories } from '../../services/categoryService'

vi.mock('axios')

const BASE = 'http://localhost:8080'
const MOCK_CATEGORIES = [
  { id: 1, name: 'Casual' },
  { id: 2, name: 'Fine Dining' },
  { id: 3, name: 'Fast Food' },
]

describe('getCategories()', () => {
  test('gọi đúng endpoint GET /categories', async () => {
    axios.get.mockResolvedValue({ data: MOCK_CATEGORIES })
    await getCategories()
    expect(axios.get).toHaveBeenCalledWith(`${BASE}/categories`)
  })

  test('trả về mảng categories', async () => {
    axios.get.mockResolvedValue({ data: MOCK_CATEGORIES })
    const result = await getCategories()
    expect(result).toEqual(MOCK_CATEGORIES)
  })
})
