/**
 * Test suite — DeleteModal
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteModal from '../../../components/restaurant/DeleteModal'

const RESTAURANT = { id: 1, name: 'BBQ Restaurant' }

describe('DeleteModal — render', () => {
  test('không render khi show=false', () => {
    render(
      <DeleteModal show={false} restaurant={RESTAURANT} onConfirm={() => {}} onClose={() => {}} />
    )
    expect(screen.queryByText(/confirmation/i)).not.toBeInTheDocument()
  })

  test('hiển thị modal khi show=true', () => {
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={() => {}} onClose={() => {}} />
    )
    expect(screen.getByText(/confirmation/i)).toBeInTheDocument()
  })

  test('hiển thị tên restaurant trong nội dung', () => {
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={() => {}} onClose={() => {}} />
    )
    expect(screen.getByText(/BBQ Restaurant/i)).toBeInTheDocument()
  })

  test('hiển thị câu hỏi xác nhận xóa', () => {
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={() => {}} onClose={() => {}} />
    )
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
  })

  test('hiển thị nút Yes', () => {
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={() => {}} onClose={() => {}} />
    )
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument()
  })

  test('hiển thị nút Close', () => {
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={() => {}} onClose={() => {}} />
    )
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })
})

describe('DeleteModal — hành động', () => {
  test('click Yes gọi onConfirm', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={onConfirm} onClose={() => {}} />
    )
    await user.click(screen.getByRole('button', { name: /yes/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  test('click Close gọi onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <DeleteModal show={true} restaurant={RESTAURANT} onConfirm={() => {}} onClose={onClose} />
    )
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
