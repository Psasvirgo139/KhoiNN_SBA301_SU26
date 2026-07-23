/**
 * Test suite — RestaurantFilter
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RestaurantFilter from '../../../components/restaurant/RestaurantFilter'

const CATEGORIES = [
  { id: 1, name: 'Casual' },
  { id: 2, name: 'Fast Food' },
  { id: 3, name: 'Cafe' },
]

describe('RestaurantFilter — render', () => {
  test('hiển thị input Restaurant Name', () => {
    render(<RestaurantFilter categories={CATEGORIES} onFilter={() => {}} />)
    expect(screen.getByPlaceholderText(/restaurant name/i)).toBeInTheDocument()
  })

  test('hiển thị dropdown Category', () => {
    render(<RestaurantFilter categories={CATEGORIES} onFilter={() => {}} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('dropdown chứa "All Categories" làm option mặc định', () => {
    render(<RestaurantFilter categories={CATEGORIES} onFilter={() => {}} />)
    expect(screen.getByRole('option', { name: /all categories/i })).toBeInTheDocument()
  })

  test('dropdown hiển thị đúng số categories từ props', () => {
    render(<RestaurantFilter categories={CATEGORIES} onFilter={() => {}} />)
    // All Categories + 3 categories = 4 options
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  test('hiển thị nút Filter', () => {
    render(<RestaurantFilter categories={CATEGORIES} onFilter={() => {}} />)
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument()
  })
})

describe('RestaurantFilter — behavior', () => {
  test('gọi onFilter với name khi submit', async () => {
    const user = userEvent.setup()
    const handleFilter = vi.fn()
    render(<RestaurantFilter categories={CATEGORIES} onFilter={handleFilter} />)

    await user.type(screen.getByPlaceholderText(/restaurant name/i), 'BBQ')
    await user.click(screen.getByRole('button', { name: /filter/i }))

    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'BBQ' })
    )
  })

  test('gọi onFilter với category khi chọn từ dropdown', async () => {
    const user = userEvent.setup()
    const handleFilter = vi.fn()
    render(<RestaurantFilter categories={CATEGORIES} onFilter={handleFilter} />)

    await user.selectOptions(screen.getByRole('combobox'), 'Casual')
    await user.click(screen.getByRole('button', { name: /filter/i }))

    expect(handleFilter).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Casual' })
    )
  })

  test('gọi onFilter với name rỗng và category rỗng khi không nhập gì', async () => {
    const user = userEvent.setup()
    const handleFilter = vi.fn()
    render(<RestaurantFilter categories={CATEGORIES} onFilter={handleFilter} />)

    await user.click(screen.getByRole('button', { name: /filter/i }))

    expect(handleFilter).toHaveBeenCalledWith({ name: '', category: '' })
  })
})
