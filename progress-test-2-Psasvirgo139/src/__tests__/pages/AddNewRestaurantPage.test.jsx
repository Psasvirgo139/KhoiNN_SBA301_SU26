/**
 * Test suite — AddNewRestaurantPage
 * Kiểm tra validation, submit thành công, và nút Back.
 */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AddNewRestaurantPage from '../../pages/AddNewRestaurantPage'

vi.mock('../../services/restaurantService')
vi.mock('../../services/categoryService')

import { addRestaurant } from '../../services/restaurantService'
import { getCategories } from '../../services/categoryService'

const MOCK_CATEGORIES = [
  { id: 1, name: 'Casual' },
  { id: 2, name: 'Fast Food' },
]

function renderPage(initialPath = '/restaurants/add') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AddNewRestaurantPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  getCategories.mockResolvedValue(MOCK_CATEGORIES)
  addRestaurant.mockResolvedValue({ id: 99, name: 'New Restaurant' })
})
afterEach(() => vi.clearAllMocks())

// ─── Render ───────────────────────────────────────────────────────────────────

describe('AddNewRestaurantPage — render', () => {
  test('hiển thị tiêu đề "Add New Restaurant"', () => {
    renderPage()
    expect(screen.getByText(/add new restaurant/i)).toBeInTheDocument()
  })

  test('hiển thị tất cả fields bắt buộc', () => {
    renderPage()
    expect(screen.getByLabelText(/restaurant name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price from/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/price to/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/owner name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/open date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
  })

  test('hiển thị nút Save', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  test('hiển thị nút Back', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  test('dropdown Category load từ API', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Casual' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Fast Food' })).toBeInTheDocument()
    })
  })
})

// ─── Validation ───────────────────────────────────────────────────────────────

describe('AddNewRestaurantPage — validation', () => {
  test('hiển thị lỗi MS01 khi submit form rỗng', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      // Phải có ít nhất 1 lỗi "required"
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0)
    })
  })

  test('hiển thị lỗi MS02 khi price from < 1000', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/price from/i), '500')
    await user.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(screen.getByText(/1000/)).toBeInTheDocument()
    })
  })

  test('hiển thị lỗi khi price to <= price from', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/price from/i), '50000')
    await user.type(screen.getByLabelText(/price to/i), '10000')
    await user.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(
        screen.getByText(/price to must be greater than/i) ||
        screen.getAllByText(/greater than/i)[0]
      ).toBeTruthy()
    })
  })

  test('hiển thị lỗi MS06 khi open date là tương lai', async () => {
    const user = userEvent.setup()
    renderPage()
    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)
    const futureStr = future.toISOString().split('T')[0]
    await user.type(screen.getByLabelText(/open date/i), futureStr)
    await user.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(screen.getByText(/future/i)).toBeInTheDocument()
    })
  })

  test('không gọi API khi form có lỗi', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /save/i }))
    await waitFor(() => {
      expect(addRestaurant).not.toHaveBeenCalled()
    })
  })
})

// ─── Submit thành công ────────────────────────────────────────────────────────

describe('AddNewRestaurantPage — submit thành công', () => {
  async function fillAndSubmit(user) {
    await waitFor(() => screen.getByRole('option', { name: 'Casual' }))
    await user.type(screen.getByLabelText(/restaurant name/i), 'New Restaurant')
    await user.type(screen.getByLabelText(/price from/i), '10000')
    await user.type(screen.getByLabelText(/price to/i), '50000')
    await user.type(screen.getByLabelText(/owner name/i), 'Test Owner')
    await user.type(screen.getByLabelText(/open date/i), '2024-01-15')
    await user.type(screen.getByLabelText(/address/i), 'Test Address')
    await user.selectOptions(screen.getByLabelText(/category/i), 'Casual')
    await user.click(screen.getByRole('button', { name: /save/i }))
  }

  test('gọi addRestaurant với đúng dữ liệu', async () => {
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user)
    await waitFor(() => {
      expect(addRestaurant).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Restaurant', category: 'Casual' })
      )
    })
  })

  test('hiển thị MS04 sau khi tạo thành công', async () => {
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user)
    await waitFor(() => {
      expect(screen.getByText(/created new restaurant successfully/i)).toBeInTheDocument()
    })
  })

  test('hiển thị MS05 khi API lỗi', async () => {
    addRestaurant.mockRejectedValue(new Error('Server Error'))
    const user = userEvent.setup()
    renderPage()
    await fillAndSubmit(user)
    await waitFor(() => {
      expect(screen.getByText(/internal system error/i)).toBeInTheDocument()
    })
  })
})
