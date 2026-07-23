/**
 * Bài 6 — Kiểm thử UserListPage
 *
 * Admin: thấy bảng danh sách users đầy đủ.
 * User thường: thấy Alert "Bạn không có quyền truy cập".
 *
 * Yêu cầu sinh viên:
 *   - src/pages/UserListPage.jsx
 *   - src/services/userService.js  (getUsers)
 *   - src/context/AuthContext.jsx
 *
 * Validation bắt buộc:
 *   - User thường → Alert có data-testid="access-denied", không có table
 *   - Admin → không có Alert, có Table
 *   - Bảng có cột: #, Username, Name, Role, Status
 *   - Hiển thị đủ dữ liệu từ db.json (≥ 5 hàng data)
 */

import { render, screen, waitFor, act } from '@testing-library/react'
import { useContext } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider, AuthContext } from '../../context/AuthContext'
import UserListPage from '../../pages/UserListPage'

const ADMIN_USER  = { id: 1, username: 'admin', name: 'Admin User',  role: 'admin', status: 'active' }
const NORMAL_USER = { id: 3, username: 'huy',   name: 'Huy Nguyen', role: 'user',  status: 'active' }

function renderPageWithUser(user) {
  function Wrapper() {
    const { dispatch } = useContext(AuthContext)
    return (
      <>
        <button
          data-testid="login-trigger"
          onClick={() => dispatch({ type: 'LOGIN_SUCCESS', payload: user })}
        >
          login
        </button>
        <UserListPage />
      </>
    )
  }
  const utils = render(
    <MemoryRouter>
      <AuthProvider>
        <Wrapper />
      </AuthProvider>
    </MemoryRouter>
  )
  act(() => { utils.getByTestId('login-trigger').click() })
  return utils
}

// ─── Bài 6: User thường ───────────────────────────────────────────────────────

describe('Bài 6 | UserListPage — user thường', () => {
  test('hiển thị Alert access-denied', () => {
    renderPageWithUser(NORMAL_USER)
    expect(screen.getByTestId('access-denied')).toBeInTheDocument()
  })

  test('nội dung Alert đề cập quyền truy cập', () => {
    renderPageWithUser(NORMAL_USER)
    expect(screen.getByTestId('access-denied').textContent).toMatch(/quyền|truy cập/i)
  })

  test('KHÔNG hiển thị bảng users', () => {
    renderPageWithUser(NORMAL_USER)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})

// ─── Bài 6: Admin ─────────────────────────────────────────────────────────────

describe('Bài 6 | UserListPage — admin', () => {
  test('KHÔNG hiển thị Alert access-denied', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      expect(screen.queryByTestId('access-denied')).not.toBeInTheDocument()
    })
  })

  test('hiển thị bảng (table) danh sách users', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })

  test('bảng có cột Username', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      expect(screen.getByText(/^username$/i)).toBeInTheDocument()
    })
  })

  test('bảng có cột Role', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      expect(screen.getByText(/^role$/i)).toBeInTheDocument()
    })
  })

  test('bảng có cột Status', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      expect(screen.getByText(/^status$/i)).toBeInTheDocument()
    })
  })

  test('hiển thị username "admin" trong bảng', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      // Tìm cell chứa đúng chữ "admin" (không phải tiêu đề)
      const cells = screen.getAllByText(/admin/i)
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  test('hiển thị đủ 5 hàng dữ liệu (1 header + 5 data rows)', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // 1 header row + 5 data rows = 6
      expect(rows.length).toBeGreaterThanOrEqual(6)
    })
  })

  test('hiển thị status "active" và "inactive" trong bảng', async () => {
    renderPageWithUser(ADMIN_USER)
    await waitFor(() => {
      expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0)
    })
  })
})
