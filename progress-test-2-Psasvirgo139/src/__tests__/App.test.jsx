/**
 * TC-05 — Đăng xuất → quay về LoginPage, Navbar biến mất
 * TC-06 — useAuth ngoài Provider ném lỗi  (đã có trong AuthContext.test.jsx)
 *
 * Integration test: kết hợp AuthProvider + App
 *
 * Yêu cầu sinh viên:
 *   - src/App.jsx             (hoàn thiện skeleton)
 *   - src/main.jsx            (bọc AuthProvider)
 *   - src/components/AppNavbar.jsx
 *   - src/pages/LoginPage.jsx
 *   - src/pages/DashboardPage.jsx
 */

import { render, screen, act, waitFor } from '@testing-library/react'
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

// ─── TC-01 (integration): Trạng thái ban đầu ─────────────────────────────────

describe('TC-01 (integration) | App — trạng thái ban đầu', () => {
  test('hiển thị LoginPage khi chưa đăng nhập', () => {
    renderApp()
    expect(
      screen.getByRole('button', { name: /đăng nhập/i })
    ).toBeInTheDocument()
  })

  test('không hiển thị Navbar khi chưa đăng nhập', () => {
    renderApp()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  test('không hiển thị Dashboard khi chưa đăng nhập', () => {
    renderApp()
    expect(screen.queryByRole('button', { name: /đăng xuất|logout/i }))
      .not.toBeInTheDocument()
  })
})

// ─── TC-03 (integration): Login thành công → DashboardPage ───────────────────

describe('TC-03 (integration) | Login thành công → Dashboard', () => {
  test('sau khi login đúng → không còn nút Đăng nhập', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      'user'
    )
    await user.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      '123'
    )
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /^đăng nhập$/i })
      ).not.toBeInTheDocument()
    })
  })

  test('sau khi login → Navbar xuất hiện', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      'user'
    )
    await user.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      '123'
    )
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  test('sau khi login → hiển thị tên user', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      'user'
    )
    await user.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      '123'
    )
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    await waitFor(() => {
      // Tên user phải xuất hiện (Normal User hoặc tên bất kỳ từ data)
      expect(screen.getAllByText(/Normal User|user/i).length).toBeGreaterThan(0)
    })
  })
})

// ─── TC-05: Đăng xuất ────────────────────────────────────────────────────────

describe('TC-05 | Đăng xuất', () => {
  async function loginAs(userEvent, username, password) {
    await userEvent.type(
      screen.getByPlaceholderText(/username/i) || screen.getByLabelText(/username/i),
      username
    )
    await userEvent.type(
      screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i),
      password
    )
    await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }))
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^đăng nhập$/i }))
        .not.toBeInTheDocument()
    })
  }

  test('sau khi logout → hiển thị lại LoginPage', async () => {
    const user = userEvent.setup()
    renderApp()

    await loginAs(user, 'user', '123')

    // Click logout — dùng getAllByRole vì cả AppNavbar lẫn Dashboard đều có nút logout
    const logoutBtn = screen.getAllByRole('button', { name: /đăng xuất|logout/i })[0]
    await user.click(logoutBtn)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /đăng nhập/i })
      ).toBeInTheDocument()
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
      // Badge admin/user không còn
      expect(screen.queryByText(/admin/i)).not.toBeInTheDocument()
    })
  })
})