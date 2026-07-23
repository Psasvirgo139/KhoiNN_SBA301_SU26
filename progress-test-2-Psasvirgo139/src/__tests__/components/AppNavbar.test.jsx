/**
 * Kiểm thử AppNavbar
 *
 * Yêu cầu sinh viên:
 *   - src/components/AppNavbar.jsx
 *   - src/context/AuthContext.jsx  (AuthProvider, AuthContext)
 *   - src/hooks/useAuth.js
 */

import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { AuthProvider, AuthContext } from '../../context/AuthContext'
import AppNavbar from '../../components/AppNavbar'

const FAKE_USER = { id: 1, username: 'admin', name: 'Admin User', role: 'admin' }

function renderNavbarLoggedIn(user = FAKE_USER) {
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
    <AuthProvider>
      <Inner />
    </AuthProvider>
  )
  act(() => { utils.getByTestId('login-trigger').click() })
  return utils
}

describe('AppNavbar', () => {
  test('hiển thị brand name của app', () => {
    renderNavbarLoggedIn()
    // Brand có thể là "Auth App", tên app, hoặc tên bất kỳ
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('hiển thị tên user đang đăng nhập', () => {
    renderNavbarLoggedIn()
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument()
  })

  test('có nút/link Logout', () => {
    renderNavbarLoggedIn()
    expect(
      screen.getByRole('button', { name: /logout|đăng xuất/i })
    ).toBeInTheDocument()
  })

  test('click Logout → dispatch LOGOUT (state về unauthenticated)', async () => {
    function StateChecker() {
      const { state, dispatch } = useContext(AuthContext)
      return (
        <>
          <span data-testid="auth-state">{state.isAuthenticated ? 'in' : 'out'}</span>
          <button
            data-testid="login-trigger"
            onClick={() => dispatch({ type: 'LOGIN_SUCCESS', payload: FAKE_USER })}
          >
            login
          </button>
          <AppNavbar />
        </>
      )
    }

    render(
      <AuthProvider>
        <StateChecker />
      </AuthProvider>
    )

    // login
    act(() => { screen.getByTestId('login-trigger').click() })
    expect(screen.getByTestId('auth-state')).toHaveTextContent('in')

    // logout qua navbar
    act(() => {
      screen.getByRole('button', { name: /logout|đăng xuất/i }).click()
    })
    expect(screen.getByTestId('auth-state')).toHaveTextContent('out')
  })
})
