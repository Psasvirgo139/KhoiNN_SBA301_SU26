/**
 * Test suite — RestaurantListPage (integration)
 * Mock toàn bộ service calls, test luồng chính.
 */
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useEffect } from 'react'
import RestaurantListPage from '../../pages/RestaurantListPage'

vi.mock('../../services/restaurantService')
vi.mock('../../services/categoryService')

import { getRestaurants, deleteRestaurant } from '../../services/restaurantService'
import { getCategories } from '../../services/categoryService'

const MOCK_RESTAURANTS = [
  { id: 1, name: 'BBQ Restaurant', category: 'Casual', owner: 'Hoang', address: 'Hang Bai', priceFrom: 1000, priceTo: 20000 },
  { id: 2, name: 'Pho 24', category: 'Fast Food', owner: 'Nguyen', address: 'Le Loi', priceFrom: 35000, priceTo: 80000 },
  { id: 3, name: 'Cong Caphe', category: 'Cafe', owner: 'Hoang', address: 'Trieu Viet Vuong', priceFrom: 30000, priceTo: 65000 },
]
const MOCK_CATEGORIES = [
  { id: 1, name: 'Casual' },
  { id: 2, name: 'Fast Food' },
  { id: 3, name: 'Cafe' },
]

function renderPage() {
  // Inject auth state (logged in)
  function LoggedInWrapper({ children }) {
    return (
      <AuthProvider>
        <LoginHelper />
        {children}
      </AuthProvider>
    )
  }
  function LoginHelper() {
    const { dispatch } = useContext(AuthContext)
    // login ngay khi mount
    useEffect(() => {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { id: 1, username: 'admin', name: 'Admin', role: 'admin' } })
    }, [dispatch])
    return null
  }
  return render(
    <MemoryRouter>
      <LoggedInWrapper>
        <RestaurantListPage />
      </LoggedInWrapper>
    </MemoryRouter>
  )
}

beforeEach(() => {
  getRestaurants.mockResolvedValue(MOCK_RESTAURANTS)
  getCategories.mockResolvedValue(MOCK_CATEGORIES)
  deleteRestaurant.mockResolvedValue({})
})

afterEach(() => {
  vi.clearAllMocks()
})

// ─── Load ban đầu ─────────────────────────────────────────────────────────────

describe('RestaurantListPage — load ban đầu', () => {
  test('hiển thị tiêu đề "Restaurant List"', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/restaurant list/i)).toBeInTheDocument()
    })
  })

  test('hiển thị danh sách restaurants sau khi load', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('BBQ Restaurant')).toBeInTheDocument()
      expect(screen.getByText('Pho 24')).toBeInTheDocument()
    })
  })

  test('có nút Add New', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument()
    })
  })

  test('hiển thị MS05 khi API lỗi', async () => {
    getRestaurants.mockRejectedValue(new Error('Network Error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(/internal system error/i)).toBeInTheDocument()
    })
  })
})

// ─── Filter ───────────────────────────────────────────────────────────────────

describe('RestaurantListPage — filter', () => {
  test('lọc theo tên hiển thị đúng kết quả', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getByText('BBQ Restaurant'))

    await user.type(screen.getByPlaceholderText(/restaurant name/i), 'BBQ')
    await user.click(screen.getByRole('button', { name: /filter/i }))

    await waitFor(() => {
      expect(screen.getByText('BBQ Restaurant')).toBeInTheDocument()
      expect(screen.queryByText('Pho 24')).not.toBeInTheDocument()
    })
  })

  test('hiển thị "No records found" khi không có kết quả', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getByText('BBQ Restaurant'))

    await user.type(screen.getByPlaceholderText(/restaurant name/i), 'XYZXYZ')
    await user.click(screen.getByRole('button', { name: /filter/i }))

    await waitFor(() => {
      expect(screen.getByText(/no records found/i)).toBeInTheDocument()
    })
  })
})

// ─── Delete ───────────────────────────────────────────────────────────────────

describe('RestaurantListPage — delete', () => {
  test('click Delete mở DeleteModal', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getAllByRole('button', { name: /delete/i }))
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])

    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    })
  })

  test('click Yes trong modal gọi deleteRestaurant và hiện MS08', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getAllByRole('button', { name: /delete/i }))
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    await waitFor(() => screen.getByRole('button', { name: /^yes$/i }))
    await user.click(screen.getByRole('button', { name: /^yes$/i }))

    await waitFor(() => {
      expect(deleteRestaurant).toHaveBeenCalled()
      expect(screen.getByText(/deleted successfully/i)).toBeInTheDocument()
    })
  })

  test('click Close đóng modal không xóa', async () => {
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => screen.getAllByRole('button', { name: /delete/i }))
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    await waitFor(() => screen.getByRole('button', { name: /close/i }))
    await user.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(deleteRestaurant).not.toHaveBeenCalled()
      expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
    })
  })
})
