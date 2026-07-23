/**
 * Test suite — RestaurantDetailPage
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RestaurantDetailPage from '../../pages/RestaurantDetailPage'

vi.mock('../../services/restaurantService')
import { getRestaurantById } from '../../services/restaurantService'

const MOCK_RESTAURANT = {
  id: 1,
  name: 'BBQ Restaurant',
  owner: 'Hoang Dang',
  category: 'Casual',
  priceFrom: 1000,
  priceTo: 20000,
  address: 'Hang Bai, Hoan Kiem',
  openDate: '2025-01-20',
}

function renderPage(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/restaurants/${id}`]}>
      <Routes>
        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="/" element={<div>Restaurant List</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  getRestaurantById.mockResolvedValue(MOCK_RESTAURANT)
})
afterEach(() => vi.clearAllMocks())

describe('RestaurantDetailPage — hiển thị thông tin', () => {
  test('hiển thị tiêu đề "VIEW DETAILS"', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/view details/i)).toBeInTheDocument()
    })
  })

  test('hiển thị Restaurant Name', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('BBQ Restaurant')).toBeInTheDocument()
    })
  })

  test('hiển thị Owner name', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Hoang Dang')).toBeInTheDocument()
    })
  })

  test('hiển thị Category', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Casual')).toBeInTheDocument()
    })
  })

  test('hiển thị Address', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/Hang Bai/i)).toBeInTheDocument()
    })
  })

  test('hiển thị Open Date', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('2025-01-20')).toBeInTheDocument()
    })
  })

  test('gọi getRestaurantById với đúng id', async () => {
    renderPage('1')
    await waitFor(() => {
      expect(getRestaurantById).toHaveBeenCalledWith('1')
    })
  })

  test('hiển thị MS05 khi API lỗi', async () => {
    getRestaurantById.mockRejectedValue(new Error('Not Found'))
    renderPage('999')
    await waitFor(() => {
      expect(screen.getByText(/internal system error/i)).toBeInTheDocument()
    })
  })
})

describe('RestaurantDetailPage — navigation', () => {
  test('có nút Back', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })
  })

  test('click Back → quay về trang danh sách', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => screen.getByRole('button', { name: /back/i }))
    await user.click(screen.getByRole('button', { name: /back/i }))
    await waitFor(() => {
      expect(screen.getByText('Restaurant List')).toBeInTheDocument()
    })
  })
})
