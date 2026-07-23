/**
 * Bài 4 — Kiểm thử AppNavbar
 *
 * AppNavbar dùng NavLink từ react-router-dom → cần bọc MemoryRouter.
 *
 * Yêu cầu sinh viên:
 *   - src/components/AppNavbar.jsx
 *   - src/context/AuthContext.jsx
 *   - src/hooks/useAuth.js
 *
 * Validation bắt buộc:
 *   - Render thẻ <nav> (role="navigation")
 *   - Hiển thị user.name
 *   - Nút Đăng xuất → dispatch LOGOUT → isAuthenticated = false
 *   - Có NavLink "Dashboard" → /
 *   - Chỉ admin thấy NavLink "Quản lý Users" → /users
 *   - User thường KHÔNG thấy NavLink đó
 */

import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, AuthContext } from '../../context/AuthContext'
import AppNavbar from '../../components/AppNavbar'

const FAKE_ADMIN = { id: 1, username: 'admin', name: 'Admin User', role: 'admin', status: 'active' }
const FAKE_USER  = { id: 3, username: 'huy',   name: 'Huy Nguyen', role: 'user',  status: 'active' }

function renderNavbarLoggedIn(user = FAKE_ADMIN) {
  function Inner() {
    const { dispatch } = useContext(AuthContext)
    return (
      <>
        <button
          data-testid="login-trigger"
          onClick={() => dispatch({ type: 'LOGIN_SUCCESS', payload: user })}
        >
          login
        </button>
        <AppNavbar />
      </>
    )
  }
  const utils = render(
    <MemoryRouter>
      <AuthProvider>
        <Inner />
      </AuthProvider>
    </MemoryRouter>
  )
  act(() => { utils.getByTestId('login-trigger').click() })
  return utils
}

// ─── Bài 4: Kiểm thử cơ bản ──────────────────────────────────────────────────

describe('Bài 4 | AppNavbar — cơ bản', () => {
  test('hiển thị navigation element', () => {
    renderNavbarLoggedIn()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('hiển thị tên user đang đăng nhập', () => {
    renderNavbarLoggedIn()
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument()
  })

  test('có nút Đăng xuất', () => {
    renderNavbarLoggedIn()
    expect(screen.getByRole('button', { name: /logout|đăng xuất/i })).toBeInTheDocument()
  })

  test('click Đăng xuất → state về unauthenticated', () => {
    function StateChecker() {
      const { state, dispatch } = useContext(AuthContext)
      return (
        <>
          <span data-testid="auth-state">{state.isAuthenticated ? 'in' : 'out'}</span>
          <button
            data-testid="login-trigger"
            onClick={() => dispatch({ type: 'LOGIN_SUCCESS', payload: FAKE_ADMIN })}
          >
            login
          </button>
          <AppNavbar />
        </>
      )
    }
    render(
      <MemoryRouter>
        <AuthProvider>
          <StateChecker />
        </AuthProvider>
      </MemoryRouter>
    )
    act(() => { screen.getByTestId('login-trigger').click() })
    expect(screen.getByTestId('auth-state')).toHaveTextContent('in')
    act(() => { screen.getByRole('button', { name: /logout|đăng xuất/i }).click() })
    expect(screen.getByTestId('auth-state')).toHaveTextContent('out')
  })

  test('có NavLink Dashboard', () => {
    renderNavbarLoggedIn(FAKE_ADMIN)
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })
})

// ─── Bài 4: Phân quyền link ───────────────────────────────────────────────────

describe('Bài 4 | AppNavbar — phân quyền link', () => {
  test('admin → có link "Quản lý Users"', () => {
    renderNavbarLoggedIn(FAKE_ADMIN)
    expect(screen.getByRole('link', { name: /quản lý users/i })).toBeInTheDocument()
  })

  test('user thường → KHÔNG có link "Quản lý Users"', () => {
    renderNavbarLoggedIn(FAKE_USER)
    expect(screen.queryByRole('link', { name: /quản lý users/i })).not.toBeInTheDocument()
  })
})
