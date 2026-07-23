/**
 * Test suite — Pagination
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../../../components/restaurant/Pagination'

describe('Pagination — ẩn khi chỉ 1 trang', () => {
  test('không render gì khi totalPages = 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} totalRecords={5} pageSize={5} />
    )
    expect(container.firstChild).toBeNull()
  })

  test('không render gì khi totalPages = 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} totalRecords={0} pageSize={5} />
    )
    expect(container.firstChild).toBeNull()
  })
})

describe('Pagination — hiển thị khi nhiều trang', () => {
  test('hiển thị nút Previous', () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={() => {}} totalRecords={15} pageSize={5} />
    )
    expect(screen.getByTitle(/previous/i) || screen.getByLabelText(/previous/i) ||
      document.querySelector('.page-item:first-child')).toBeTruthy()
  })

  test('hiển thị nút Next', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} totalRecords={15} pageSize={5} />
    )
    expect(document.querySelector('.page-item:last-child')).toBeTruthy()
  })

  test('hiển thị đúng số trang', () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} totalRecords={15} pageSize={5} />
    )
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  test('hiển thị thông tin "Show x of y records"', () => {
    render(
      <Pagination currentPage={1} totalPages={2} onPageChange={() => {}} totalRecords={7} pageSize={5} />
    )
    expect(screen.getByText(/7 records/i) || screen.getByText(/show/i)).toBeTruthy()
  })
})

describe('Pagination — hành động', () => {
  test('click số trang gọi onPageChange với đúng số', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} totalRecords={15} pageSize={5} />
    )
    await user.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  test('click Next gọi onPageChange(currentPage + 1)', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} totalRecords={15} pageSize={5} />
    )
    // Next button — last page-item
    const nextItem = document.querySelectorAll('.page-item')
    const nextBtn = nextItem[nextItem.length - 1].querySelector('a, button')
    await user.click(nextBtn)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
