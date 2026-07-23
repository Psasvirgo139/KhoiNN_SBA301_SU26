/**
 * TC-03 — Đăng nhập tài khoản 'user' → Badge xanh
 * TC-04 — Đăng nhập tài khoản 'admin' → Badge đỏ
 *
 * Yêu cầu sinh viên:
 *   - src/components/Dashboard.jsx
 *   - src/context/AuthContext.jsx  (AuthProvider, AuthContext)
 *   - src/hooks/useAuth.js
 */

import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from '../../context/AuthContext'
import Dashboard from '../../components/Dashboard'

const ADMIN_USER = { id: 1, username: 'admin', name: 'Admin User', role: 'admin' }
const NORMAL_USER = { id: 2, username: 'user', name: 'Normal User', role: 'user' }

// Helper: render Dashboard với user đã được login vào context
function renderDashboardWithUser(user) {
  function Wrapper({ children }) {
    return <AuthProvider>{children}</AuthProvider>
  }

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

  const utils = render(<LoginAndRender />, { wrapper: Wrapper })

  // trigger login
  act(() => {
    utils.getByTestId('login-trigger').click()
  })

  return utils
}

// ─── TC-03: Tài khoản user thường ────────────────────────────────────────────

describe('TC-03 | Dashboard — tài khoản user thường', () => {
  test('hiển thị tên user', () => {
    renderDashboardWithUser(NORMAL_USER)
    expect(screen.getByText(/Normal User/i)).toBeInTheDocument()
  })

  test('hiển thị username', () => {
    renderDashboardWithUser(NORMAL_USER)
    // Dùng getAllByText vì nhiều element cùng chứa text "user"
    // (tên "Normal User" và badge role "user" đều match /user/i)
    expect(screen.getAllByText(/user/i).length).toBeGreaterThan(0)
  })

  test('Badge role hiển thị chữ "user"', () => {
    renderDashboardWithUser(NORMAL_USER)
    // Tìm badge/element chứa text "user" (role)
    const badge = screen.getByText(/^user$/i)
    expect(badge).toBeInTheDocument()
  })

  test('Badge role KHÔNG có class text-danger / bg-danger cho user thường', () => {
    renderDashboardWithUser(NORMAL_USER)
    const badge = screen.getByText(/^user$/i)
    expect(badge.className).not.toMatch(/danger/i)
  })

  test('hiển thị nút Đăng xuất', () => {
    renderDashboardWithUser(NORMAL_USER)
    expect(
      screen.getByRole('button', { name: /đăng xuất|logout/i })
    ).toBeInTheDocument()
  })
})

// ─── TC-04: Tài khoản admin ───────────────────────────────────────────────────

describe('TC-04 | Dashboard — tài khoản admin', () => {
  test('hiển thị tên admin', () => {
    renderDashboardWithUser(ADMIN_USER)
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument()
  })

  test('Badge role hiển thị chữ "admin"', () => {
    renderDashboardWithUser(ADMIN_USER)
    const badge = screen.getByText(/^admin$/i)
    expect(badge).toBeInTheDocument()
  })

  test('Badge role admin có class danger (màu đỏ)', () => {
    renderDashboardWithUser(ADMIN_USER)
    const badge = screen.getByText(/^admin$/i)
    // React Bootstrap Badge bg="danger" → class "bg-danger" hoặc "text-bg-danger"
    expect(badge.className).toMatch(/danger/i)
  })

  test('Badge role user thường có class success (màu xanh)', () => {
    renderDashboardWithUser(NORMAL_USER)
    const badge = screen.getByText(/^user$/i)
    expect(badge.className).toMatch(/success/i)
  })
})