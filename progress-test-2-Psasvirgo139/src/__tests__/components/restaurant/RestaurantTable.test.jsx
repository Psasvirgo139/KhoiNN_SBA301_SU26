/**
 * Test suite — RestaurantTable
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RestaurantTable from '../../../components/restaurant/RestaurantTable'

const RESTAURANTS = [
  { id: 1, name: 'BBQ Restaurant', category: 'Casual', owner: 'Hoang', address: 'Hang Bai', priceFrom: 1000, priceTo: 20000 },
  { id: 2, name: 'Pho 24', category: 'Fast Food', owner: 'Nguyen', address: 'Le Loi', priceFrom: 35000, priceTo: 80000 },
]

function renderTable(restaurants, onDelete = () => {}) {
  return render(
    <MemoryRouter>
      <RestaurantTable restaurants={restaurants} onDelete={onDelete} />
    </MemoryRouter>
  )
}

describe('RestaurantTable — danh sách rỗng', () => {
  test('hiển thị "No records found" khi mảng rỗng', () => {
    renderTable([])
    expect(screen.getByText(/no records found/i)).toBeInTheDocument()
  })

  test('không render bảng khi mảng rỗng', () => {
    renderTable([])
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})

describe('RestaurantTable — hiển thị dữ liệu', () => {
  test('render bảng khi có dữ liệu', () => {
    renderTable(RESTAURANTS)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  test('hiển thị đúng số hàng (không tính header)', () => {
    renderTable(RESTAURANTS)
    const rows = screen.getAllByRole('row')
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3)
  })

  test('hiển thị tên restaurant', () => {
    renderTable(RESTAURANTS)
    expect(screen.getByText('BBQ Restaurant')).toBeInTheDocument()
    expect(screen.getByText('Pho 24')).toBeInTheDocument()
  })

  test('hiển thị category', () => {
    renderTable(RESTAURANTS)
    expect(screen.getByText('Casual')).toBeInTheDocument()
  })

  test('hiển thị owner', () => {
    renderTable(RESTAURANTS)
    expect(screen.getByText('Hoang')).toBeInTheDocument()
  })

  test('mỗi hàng có nút/link Delete', () => {
    renderTable(RESTAURANTS)
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2)
  })

  test('mỗi hàng có nút/link View', () => {
    renderTable(RESTAURANTS)
    expect(screen.getAllByRole('button', { name: /view/i })).toHaveLength(2)
  })
})

describe('RestaurantTable — hành động', () => {
  test('click Delete gọi onDelete với đúng restaurant', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    renderTable(RESTAURANTS, handleDelete)

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])

    expect(handleDelete).toHaveBeenCalledWith(RESTAURANTS[0])
  })
})
