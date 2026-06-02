import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Ex03ValidationPage from '../pages/Ex03ValidationPage'

describe('Ex03 – Validation Form (Context + Reducer)', () => {

  it('không hiển thị lỗi khi chưa tương tác', () => {
    render(<Ex03ValidationPage />)
    expect(screen.queryByText(/không được để trống/i)).not.toBeInTheDocument()
  })

  it('hiển thị lỗi họ tên sau khi blur trường trống', async () => {
    render(<Ex03ValidationPage />)
    const input = screen.getByLabelText(/họ.*tên|full.?name/i)
    fireEvent.focus(input)
    fireEvent.blur(input)
    await waitFor(() =>
      expect(screen.getByText(/không được để trống|bắt buộc/i)).toBeInTheDocument()
    )
  })

  it('hiển thị lỗi email không hợp lệ', async () => {
    render(<Ex03ValidationPage />)
    const input = screen.getByLabelText(/email/i)
    await userEvent.type(input, 'not-an-email')
    fireEvent.blur(input)
    await waitFor(() =>
      expect(screen.getByText(/email không hợp lệ|sai định dạng/i)).toBeInTheDocument()
    )
  })

  it('hiển thị lỗi mật khẩu thiếu chữ hoa', async () => {
    render(<Ex03ValidationPage />)
    const pwdInput = document.querySelectorAll('input[type="password"]')[0]
    await userEvent.type(pwdInput, 'abc123')
    fireEvent.blur(pwdInput)
    await waitFor(() =>
      expect(screen.getByText(/chữ hoa/i)).toBeInTheDocument()
    )
  })

  it('hiển thị lỗi xác nhận mật khẩu không khớp', async () => {
    render(<Ex03ValidationPage />)
    const [pwdInput, confirmInput] = document.querySelectorAll('input[type="password"]')
    await userEvent.type(pwdInput, 'Password1')
    await userEvent.type(confirmInput, 'Password2')
    fireEvent.blur(confirmInput)
    await waitFor(() =>
      expect(screen.getByText(/không khớp/i)).toBeInTheDocument()
    )
  })

  it('ngăn submit khi form chưa hợp lệ', async () => {
    render(<Ex03ValidationPage />)
    fireEvent.click(screen.getByRole('button', { name: /đăng ký|submit/i }))
    await waitFor(() =>
      expect(screen.queryByText(/thành công/i)).not.toBeInTheDocument()
    )
  })

  it('submit thành công khi tất cả trường hợp lệ', async () => {
    render(<Ex03ValidationPage />)
    const [pwdInput, confirmInput] = document.querySelectorAll('input[type="password"]')
    await userEvent.type(screen.getByLabelText(/họ.*tên|full.?name/i), 'Nguyen Van A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(pwdInput, 'Password1')
    await userEvent.type(confirmInput, 'Password1')
    fireEvent.click(screen.getByRole('button', { name: /đăng ký|submit/i }))
    await waitFor(() =>
      expect(screen.getByText(/thành công/i)).toBeInTheDocument()
    , { timeout: 3000 })
  })
})
