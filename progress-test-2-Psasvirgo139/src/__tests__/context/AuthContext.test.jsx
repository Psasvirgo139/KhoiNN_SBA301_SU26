/**
 * Kiểm thử AuthContext — reducer logic và Provider
 *
 * Yêu cầu sinh viên:
 *   - src/context/AuthContext.jsx export: AuthProvider, AuthContext
 *   - src/hooks/useAuth.js        export: useAuth
 */

import { render, screen, act } from '@testing-library/react'
import { useContext } from 'react'
import { AuthContext, AuthProvider } from '../../context/AuthContext'
import { useAuth } from '../../hooks/useAuth'

// Component helper đọc state qua AuthContext trực tiếp
function StateReader() {
  const { state } = useContext(AuthContext)
  return (
    <div>
      <span data-testid="auth">{state.isAuthenticated ? 'true' : 'false'}</span>
      <span data-testid="user">{state.user ? state.user.username : 'null'}</span>
      <span data-testid="error">{state.error ?? 'null'}</span>
    </div>
  )
}

// Component helper dispatch action
function ActionDispatcher({ actionType, payload }) {
  const { dispatch } = useContext(AuthContext)
  return (
    <button onClick={() => dispatch({ type: actionType, payload })}>
      dispatch
    </button>
  )
}

function renderWithProvider(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>)
}

// ─── Initial State ───────────────────────────────────────────────────────────

describe('AuthContext — initial state', () => {
  test('isAuthenticated mặc định là false', () => {
    renderWithProvider(<StateReader />)
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
  })

  test('user mặc định là null', () => {
    renderWithProvider(<StateReader />)
    expect(screen.getByTestId('user')).toHaveTextContent('null')
  })

  test('error mặc định là null', () => {
    renderWithProvider(<StateReader />)
    expect(screen.getByTestId('error')).toHaveTextContent('null')
  })
})

// ─── LOGIN_SUCCESS ────────────────────────────────────────────────────────────

describe('AuthContext — LOGIN_SUCCESS', () => {
  const fakeUser = { id: 1, username: 'admin', name: 'Admin', role: 'admin' }

  test('isAuthenticated chuyển thành true', async () => {
    renderWithProvider(
      <>
        <StateReader />
        <ActionDispatcher actionType="LOGIN_SUCCESS" payload={fakeUser} />
      </>
    )
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByTestId('auth')).toHaveTextContent('true')
  })

  test('user được lưu vào state', async () => {
    renderWithProvider(
      <>
        <StateReader />
        <ActionDispatcher actionType="LOGIN_SUCCESS" payload={fakeUser} />
      </>
    )
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByTestId('user')).toHaveTextContent('admin')
  })

  test('error được xóa sau LOGIN_SUCCESS', async () => {
    renderWithProvider(
      <>
        <StateReader />
        <ActionDispatcher actionType="LOGIN_SUCCESS" payload={fakeUser} />
      </>
    )
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByTestId('error')).toHaveTextContent('null')
  })
})

// ─── LOGIN_FAILURE ────────────────────────────────────────────────────────────

describe('AuthContext — LOGIN_FAILURE', () => {
  const errorMsg = 'Sai username hoặc password!'

  test('isAuthenticated vẫn là false', async () => {
    renderWithProvider(
      <>
        <StateReader />
        <ActionDispatcher actionType="LOGIN_FAILURE" payload={errorMsg} />
      </>
    )
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
  })

  test('error được set đúng thông báo', async () => {
    renderWithProvider(
      <>
        <StateReader />
        <ActionDispatcher actionType="LOGIN_FAILURE" payload={errorMsg} />
      </>
    )
    await act(async () => {
      screen.getByRole('button').click()
    })
    expect(screen.getByTestId('error')).toHaveTextContent(errorMsg)
  })
})

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

describe('AuthContext — LOGOUT', () => {
  const fakeUser = { id: 1, username: 'admin', name: 'Admin', role: 'admin' }

  test('sau LOGOUT, isAuthenticated về false', async () => {
    renderWithProvider(
      <>
        <StateReader />
        <ActionDispatcher actionType="LOGIN_SUCCESS" payload={fakeUser} />
      </>
    )
    // login trước
    await act(async () => { screen.getByRole('button').click() })
    expect(screen.getByTestId('auth')).toHaveTextContent('true')

    // đổi action thành LOGOUT
    render(
      <AuthProvider>
        <StateReader />
        <ActionDispatcher actionType="LOGOUT" payload={null} />
      </AuthProvider>
    )
    const buttons = screen.getAllByRole('button')
    await act(async () => { buttons[buttons.length - 1].click() })
    const authEls = screen.getAllByTestId('auth')
    expect(authEls[authEls.length - 1]).toHaveTextContent('false')
  })
})

// ─── TC-06: useAuth ngoài Provider ────────────────────────────────────────────

describe('TC-06 | useAuth() ngoài AuthProvider', () => {
  test('ném lỗi khi dùng useAuth ngoài Provider', () => {
    const BreakingComponent = () => {
      useAuth()
      return null
    }
    // Suppress console.error do React in test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<BreakingComponent />)).toThrow(
      'useAuth phải được dùng bên trong AuthProvider'
    )
    spy.mockRestore()
  })
})
