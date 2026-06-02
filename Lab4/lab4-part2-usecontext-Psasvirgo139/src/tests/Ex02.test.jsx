import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Ex02LoginPage from '../pages/Ex02LoginPage'

describe('Ex02 – Login Form Context', () => {

  it('hiển thị form đăng nhập khi chưa đăng nhập', () => {
    render(<Ex02LoginPage />)
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
  })

  it('hiển thị lỗi khi nhập sai tài khoản', async () => {
    render(<Ex02LoginPage />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'wrong@email.com')
    await userEvent.type(document.querySelector('input[type="password"]'), 'wrongpass')
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByText(/không đúng|sai|không hợp lệ/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('đăng nhập thành công với tài khoản hợp lệ', async () => {
    render(<Ex02LoginPage />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com')
    await userEvent.type(document.querySelector('input[type="password"]'), '123456')
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByText(/dashboard|chào mừng/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('AuthNavbar hiển thị tên user sau khi đăng nhập', async () => {
    render(<Ex02LoginPage />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com')
    await userEvent.type(document.querySelector('input[type="password"]'), '123456')
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByText(/admin|xin chào/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('đăng xuất thành công, quay về LoginForm', async () => {
    render(<Ex02LoginPage />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com')
    await userEvent.type(document.querySelector('input[type="password"]'), '123456')
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => screen.getByText(/dashboard|chào mừng/i), { timeout: 3000 })
    fireEvent.click(screen.getByRole('button', { name: /đăng xuất|logout/i }))
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
  })
})
