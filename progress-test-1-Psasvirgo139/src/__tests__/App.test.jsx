/**
 * Bài 5 — Integration tests cho App
 *
 * App.jsx tự chứa BrowserRouter, nên không cần bọc thêm MemoryRouter ở đây.
 *
 * Yêu cầu sinh viên hoàn thiện:
 *   - src/App.jsx       (routing + PrivateRoute)
 *   - src/main.jsx      (bọc AuthProvider)
 *   - Tất cả components và pages từ Bài 1–4
 *
 * Tài khoản test:
 *   - admin / 123  (admin, active)
 *   - huy   / 123  (user, active)
 *   - khoi  / 123  (user, INACTIVE — không được login)
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../context/AuthContext'
import App from '../App'

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

// ─── Bài 5 / TC-01: Trạng thái ban đầu ───────────────────────────────────────

describe('Bài 5 | TC-01 — App trạng thái ban đầu', () => {
  test('hiển thị LoginPage khi chưa đăng nhập', () => {
    renderApp()
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
  })

  test('không hiển thị Navbar khi chưa đăng nhập', () => {
    renderApp()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  test('không hiển thị nút Đăng xuất khi chưa đăng nhập', () => {
    renderApp()
    expect(screen.queryByRole('button', { name: /đăng xuất|logout/i }))
      .not.toBeInTheDocument()
  })
})

// ─── Bài 5 / TC-03: Login thành công ─────────────────────────────────────────

describe('Bài 5 | TC-03 — Login thành công → Dashboard', () => {
  test('sau khi login đúng → không còn nút Đăng nhập', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByPlaceholderText(/username/i), 'huy')
    await user.type(screen.getByPlaceholderText(/password/i), '123')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^đăng nhập$/i })).not.toBeInTheDocument()
    })
  })

  test('sau khi login → Navbar xuất hiện', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByPlaceholderText(/username/i), 'huy')
    await user.type(screen.getByPlaceholderText(/password/i), '123')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  test('sau khi login → hiển thị tên user', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByPlaceholderText(/username/i), 'huy')
    await user.type(screen.getByPlaceholderText(/password/i), '123')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getAllByText(/Huy Nguyen|huy/i).length).toBeGreaterThan(0)
    })
  })

  test('tài khoản inactive → không login được, vẫn thấy form', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.type(screen.getByPlaceholderText(/username/i), 'khoi')
    await user.type(screen.getByPlaceholderText(/password/i), '123')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
    })
  })
})

// ─── Bài 5 / TC-05: Đăng xuất ────────────────────────────────────────────────

describe('Bài 5 | TC-05 — Đăng xuất', () => {
  async function loginAs(ue, username, password) {
    await ue.type(screen.getByPlaceholderText(/username/i), username)
    await ue.type(screen.getByPlaceholderText(/password/i), password)
    await ue.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^đăng nhập$/i })).not.toBeInTheDocument()
    })
  }

  test('sau khi logout → hiển thị lại LoginPage', async () => {
    const user = userEvent.setup()
    renderApp()
    await loginAs(user, 'huy', '123')
    const logoutBtn = screen.getAllByRole('button', { name: /đăng xuất|logout/i })[0]
    await user.click(logoutBtn)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
    })
  })

  test('sau khi logout → Navbar biến mất', async () => {
    const user = userEvent.setup()
    renderApp()
    await loginAs(user, 'admin', '123')
    const logoutBtn = screen.getAllByRole('button', { name: /đăng xuất|logout/i })[0]
    await user.click(logoutBtn)
    await waitFor(() => {
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })
  })

  test('sau khi logout → Dashboard biến mất', async () => {
    const user = userEvent.setup()
    renderApp()
    await loginAs(user, 'admin', '123')
    const logoutBtn = screen.getAllByRole('button', { name: /đăng xuất|logout/i })[0]
    await user.click(logoutBtn)
    await waitFor(() => {
      expect(screen.queryByText(/^admin$/i)).not.toBeInTheDocument()
    })
  })
})

// ─── Bài 5 / TC-08: Navbar link phân quyền ───────────────────────────────────

describe('Bài 5 | TC-08 — Navbar link Users phân quyền', () => {
  async function loginAs(ue, username, password) {
    await ue.type(screen.getByPlaceholderText(/username/i), username)
    await ue.type(screen.getByPlaceholderText(/password/i), password)
    await ue.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^đăng nhập$/i })).not.toBeInTheDocument()
    })
  }

  test('admin → Navbar có link "Quản lý Users"', async () => {
    const user = userEvent.setup()
    renderApp()
    await loginAs(user, 'admin', '123')
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /quản lý users/i })).toBeInTheDocument()
    })
  })

  test('user thường → Navbar KHÔNG có link "Quản lý Users"', async () => {
    const user = userEvent.setup()
    renderApp()
    await loginAs(user, 'huy', '123')
    await waitFor(() => {
      expect(screen.queryByRole('link', { name: /quản lý users/i })).not.toBeInTheDocument()
    })
  })
})
