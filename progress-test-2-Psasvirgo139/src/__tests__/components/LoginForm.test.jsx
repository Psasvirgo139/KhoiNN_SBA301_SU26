/**
 * TC-01 — Hiển thị form login ban đầu
 * TC-02 — Hiển thị lỗi khi đăng nhập sai
 *
 * Yêu cầu sinh viên:
 *   - src/components/LoginForm.jsx
 *   - src/context/AuthContext.jsx  (AuthProvider)
 *   - src/hooks/useAuth.js         (useAuth)
 *   - src/utils/authHelpers.js     (findUser)
 *   - src/data/users.js
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../context/AuthContext'
import LoginForm from '../../components/LoginForm'

function renderLoginForm() {
  return render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}

// ─── TC-01: Hiển thị ban đầu ─────────────────────────────────────────────────

describe('TC-01 | Hiển thị form login', () => {
  test('render input username', () => {
    renderLoginForm()
    expect(
      screen.getByPlaceholderText(/username/i) ||
      screen.getByLabelText(/username/i)
    ).toBeInTheDocument()
  })

  test('render input password', () => {
    renderLoginForm()
    expect(
      screen.getByPlaceholderText(/password/i) ||
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument()
  })

  test('render nút submit / đăng nhập', () => {
    renderLoginForm()
    expect(
      screen.getByRole('button', { name: /đăng nhập/i })
    ).toBeInTheDocument()
  })

  test('không hiển thị Alert lỗi khi mới mở', () => {
    renderLoginForm()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  test('input password có type="password"', () => {
    renderLoginForm()
    const passwordInput =
      screen.getByPlaceholderText(/password/i) ||
      screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

// ─── TC-02: Đăng nhập sai ────────────────────────────────────────────────────

describe('TC-02 | Đăng nhập với thông tin sai', () => {
  test('hiển thị Alert lỗi khi nhập sai credentials', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      'wronguser'
    )
    await user.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      'wrongpass'
    )
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  test('Alert lỗi chứa thông báo phù hợp', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      'nobody'
    )
    await user.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      'nopass'
    )
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert.textContent).toMatch(/sai|không đúng|lỗi|error/i)
    })
  })

  test('form vẫn còn hiển thị sau khi đăng nhập sai (không chuyển trang)', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      'bad'
    )
    await user.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      'bad'
    )
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
    })
  })
})
