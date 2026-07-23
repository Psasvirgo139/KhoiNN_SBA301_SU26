/**
 * Bài 3 — Kiểm thử LoginForm
 *
 * Yêu cầu sinh viên:
 *   - src/components/LoginForm.jsx
 *   - src/context/AuthContext.jsx  (AuthProvider)
 *   - src/hooks/useAuth.js         (useAuth)
 *   - src/utils/authHelpers.js     (findUser — có kiểm tra status)
 *
 * Validation bắt buộc:
 *   - Render đủ input username, input password (type="password"), nút Đăng nhập
 *   - Không hiển thị Alert khi mới mở
 *   - Hiển thị Alert lỗi khi credentials sai
 *   - Hiển thị Alert lỗi khi tài khoản inactive (credentials đúng nhưng status !== 'active')
 *   - Form không chuyển trang khi đăng nhập sai
 */

import { render, screen, waitFor } from '@testing-library/react'
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

// ─── Bài 3 / TC-01: Hiển thị ban đầu ─────────────────────────────────────────

describe('Bài 3 | TC-01 — Hiển thị form login', () => {
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

  test('render nút Đăng nhập', () => {
    renderLoginForm()
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
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

// ─── Bài 3 / TC-02: Đăng nhập sai ────────────────────────────────────────────

describe('Bài 3 | TC-02 — Đăng nhập với thông tin không hợp lệ', () => {
  test('hiển thị Alert lỗi khi credentials sai', async () => {
    const user = userEvent.setup()
    renderLoginForm()
    await user.type(screen.getByPlaceholderText(/username/i), 'wronguser')
    await user.type(screen.getByPlaceholderText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  test('Alert lỗi chứa thông báo phù hợp', async () => {
    const user = userEvent.setup()
    renderLoginForm()
    await user.type(screen.getByPlaceholderText(/username/i), 'nobody')
    await user.type(screen.getByPlaceholderText(/password/i), 'nopass')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toMatch(/sai|không đúng|lỗi|error|inactive/i)
    })
  })

  test('form vẫn hiển thị sau khi đăng nhập sai (không chuyển trang)', async () => {
    const user = userEvent.setup()
    renderLoginForm()
    await user.type(screen.getByPlaceholderText(/username/i), 'bad')
    await user.type(screen.getByPlaceholderText(/password/i), 'bad')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
    })
  })

  test('hiển thị Alert lỗi khi tài khoản inactive (credentials đúng, status="inactive")', async () => {
    const user = userEvent.setup()
    renderLoginForm()
    // khoi: credentials đúng nhưng status === 'inactive' trong db.json
    await user.type(screen.getByPlaceholderText(/username/i), 'khoi')
    await user.type(screen.getByPlaceholderText(/password/i), '123')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
