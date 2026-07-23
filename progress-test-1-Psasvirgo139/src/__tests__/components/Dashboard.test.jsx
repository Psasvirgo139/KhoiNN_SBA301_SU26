/**
 * Bài 4 — Kiểm thử Dashboard
 *
 * Yêu cầu sinh viên:
 *   - src/components/Dashboard.jsx
 *   - src/context/AuthContext.jsx
 *   - src/hooks/useAuth.js
 *
 * Validation bắt buộc:
 *   - Hiển thị user.name
 *   - Badge role='user' → class success (màu xanh), text "user"
 *   - Badge role='admin' → class danger (màu đỏ), text "admin"
 *   - Nút Đăng xuất → dispatch LOGOUT
 *   - Chỉ admin thấy link "Xem danh sách Users" → /users
 *   - User thường KHÔNG thấy link đó
 */

import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, AuthContext } from '../../context/AuthContext'
import Dashboard from '../../components/Dashboard'

const ADMIN_USER  = { id: 1, username: 'admin',  name: 'Admin User',  role: 'admin', status: 'active' }
const NORMAL_USER = { id: 3, username: 'huy',    name: 'Huy Nguyen',  role: 'user',  status: 'active' }

function renderDashboardWithUser(user) {
  function LoginAndRender() {
    const { dispatch } = useContext(AuthContext)
    return (
      <>
        <button
          data-testid="login-trigger"
          onClick={() => dispatch({ type: 'LOGIN_SUCCESS', payload: user })}
        >
          login
        </button>
        <Dashboard />
      </>
    )
  }
  const utils = render(
    <MemoryRouter>
      <AuthProvider>
        <LoginAndRender />
      </AuthProvider>
    </MemoryRouter>
  )
  act(() => { utils.getByTestId('login-trigger').click() })
  return utils
}

// ─── Bài 4 / TC-03: User thường ──────────────────────────────────────────────

describe('Bài 4 | TC-03 — Dashboard tài khoản user thường', () => {
  test('hiển thị tên user', () => {
    renderDashboardWithUser(NORMAL_USER)
    expect(screen.getByText(/Huy Nguyen/i)).toBeInTheDocument()
  })

  test('Badge role hiển thị chữ "user"', () => {
    renderDashboardWithUser(NORMAL_USER)
    expect(screen.getByText(/^user$/i)).toBeInTheDocument()
  })

  test('Badge role user thường có class success (màu xanh)', () => {
    renderDashboardWithUser(NORMAL_USER)
    const badge = screen.getByText(/^user$/i)
    expect(badge.className).toMatch(/success/i)
  })

  test('Badge role user thường KHÔNG có class danger', () => {
    renderDashboardWithUser(NORMAL_USER)
    const badge = screen.getByText(/^user$/i)
    expect(badge.className).not.toMatch(/danger/i)
  })

  test('hiển thị nút Đăng xuất', () => {
    renderDashboardWithUser(NORMAL_USER)
    expect(screen.getByRole('button', { name: /đăng xuất|logout/i })).toBeInTheDocument()
  })

  test('user thường → KHÔNG thấy link "Xem danh sách Users"', () => {
    renderDashboardWithUser(NORMAL_USER)
    expect(screen.queryByRole('link', { name: /xem danh sách users/i }))
      .not.toBeInTheDocument()
  })
})

// ─── Bài 4 / TC-04: Admin ────────────────────────────────────────────────────

describe('Bài 4 | TC-04 — Dashboard tài khoản admin', () => {
  test('hiển thị tên admin', () => {
    renderDashboardWithUser(ADMIN_USER)
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument()
  })

  test('Badge role hiển thị chữ "admin"', () => {
    renderDashboardWithUser(ADMIN_USER)
    expect(screen.getByText(/^admin$/i)).toBeInTheDocument()
  })

  test('Badge role admin có class danger (màu đỏ)', () => {
    renderDashboardWithUser(ADMIN_USER)
    const badge = screen.getByText(/^admin$/i)
    expect(badge.className).toMatch(/danger/i)
  })

  test('admin → thấy link "Xem danh sách Users"', () => {
    renderDashboardWithUser(ADMIN_USER)
    expect(screen.getByRole('link', { name: /xem danh sách users/i })).toBeInTheDocument()
  })
})
