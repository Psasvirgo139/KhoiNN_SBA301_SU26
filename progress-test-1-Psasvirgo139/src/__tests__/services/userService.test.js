/**
 * Bài 6 — Kiểm thử userService
 *
 * Yêu cầu sinh viên:
 *   - src/services/userService.js
 *   - export: getUsers(), getUserById(id), findUserByCredentials(username, password)
 *
 * Validation bắt buộc cho findUserByCredentials:
 *   - Trả về null nếu username hoặc password rỗng
 *   - Trả về null nếu credentials sai
 *   - Trả về null nếu tài khoản có status !== 'active'
 *   - Trả về Promise<user> nếu credentials đúng VÀ status === 'active'
 */

import { getUsers, getUserById, findUserByCredentials } from '../../services/userService'

describe('Bài 6 | getUsers()', () => {
  test('trả về Promise resolves mảng users', async () => {
    const users = await getUsers()
    expect(Array.isArray(users)).toBe(true)
  })

  test('có ít nhất 2 users', async () => {
    const users = await getUsers()
    expect(users.length).toBeGreaterThanOrEqual(2)
  })

  test('mỗi user có đủ trường id, username, name, role, status', async () => {
    const users = await getUsers()
    users.forEach((u) => {
      expect(u).toHaveProperty('id')
      expect(u).toHaveProperty('username')
      expect(u).toHaveProperty('name')
      expect(u).toHaveProperty('role')
      expect(u).toHaveProperty('status')
    })
  })

  test('có ít nhất 1 user với role admin', async () => {
    const users = await getUsers()
    expect(users.some((u) => u.role === 'admin')).toBe(true)
  })
})

describe('Bài 6 | getUserById()', () => {
  test('trả về đúng user theo id', async () => {
    const user = await getUserById(1)
    expect(user).not.toBeNull()
    expect(user.id).toBe(1)
  })

  test('trả về null khi id không tồn tại', async () => {
    const user = await getUserById(9999)
    expect(user).toBeNull()
  })
})

describe('Bài 6 | findUserByCredentials()', () => {
  // ── Credentials đúng, active ─────────────────────────────────────────────────

  test('trả về user khi username + password đúng (admin, active)', async () => {
    const user = await findUserByCredentials('admin', '123')
    expect(user).not.toBeNull()
    expect(user.username).toBe('admin')
    expect(user.role).toBe('admin')
    expect(user.status).toBe('active')
  })

  test('trả về user khi username + password đúng (user thường, active)', async () => {
    const user = await findUserByCredentials('huy', '123')
    expect(user).not.toBeNull()
    expect(user.role).toBe('user')
    expect(user.status).toBe('active')
  })

  // ── Credentials sai ──────────────────────────────────────────────────────────

  test('trả về null khi password sai', async () => {
    const user = await findUserByCredentials('admin', 'wrong')
    expect(user).toBeNull()
  })

  test('trả về null khi username không tồn tại', async () => {
    const user = await findUserByCredentials('ghost', '123')
    expect(user).toBeNull()
  })

  test('trả về null khi cả hai trường rỗng', async () => {
    const user = await findUserByCredentials('', '')
    expect(user).toBeNull()
  })

  // ── Status inactive ───────────────────────────────────────────────────────────

  test('trả về null khi tài khoản có status === "inactive"', async () => {
    const user = await findUserByCredentials('khoi', '123')  // credentials đúng nhưng inactive
    expect(user).toBeNull()
  })
})
