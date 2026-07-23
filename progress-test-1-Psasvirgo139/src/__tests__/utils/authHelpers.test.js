/**
 * Bài 1 — Kiểm thử hàm findUser (utility)
 *
 * Yêu cầu sinh viên:
 *   - src/utils/authHelpers.js  export hàm findUser(username, password)
 *   - Dữ liệu đọc từ db.json ở thư mục gốc
 *
 * Validation bắt buộc:
 *   - Trả về null nếu username hoặc password rỗng
 *   - Trả về null nếu không tìm thấy username
 *   - Trả về null nếu password sai
 *   - Trả về null nếu tài khoản có status !== 'active'
 *   - Trả về object user nếu credentials đúng VÀ status === 'active'
 */

import { findUser } from '../../utils/authHelpers'

describe('Bài 1 | findUser()', () => {
  // ── Credentials đúng, active ────────────────────────────────────────────────

  test('TC-07a: trả về user khi username + password đúng (admin, active)', () => {
    const result = findUser('admin', '123')
    expect(result).not.toBeNull()
    expect(result).toMatchObject({ username: 'admin', role: 'admin', status: 'active' })
  })

  test('TC-07b: trả về user khi username + password đúng (user thường, active)', () => {
    const result = findUser('huy', '123')
    expect(result).not.toBeNull()
    expect(result).toMatchObject({ username: 'huy', role: 'user', status: 'active' })
  })

  // ── Credentials sai ─────────────────────────────────────────────────────────

  test('TC-07c: trả về null khi password sai', () => {
    const result = findUser('admin', 'wrongpassword')
    expect(result).toBeNull()
  })

  test('TC-07d: trả về null khi username không tồn tại', () => {
    const result = findUser('nonexistent', '123')
    expect(result).toBeNull()
  })

  test('TC-07e: trả về null khi cả hai trường đều rỗng', () => {
    const result = findUser('', '')
    expect(result).toBeNull()
  })

  // ── Status inactive ─────────────────────────────────────────────────────────

  test('TC-07f: trả về null khi tài khoản có status === "inactive"', () => {
    const result = findUser('khoi', '123')   // credentials đúng nhưng inactive
    expect(result).toBeNull()
  })

  // ── Cấu trúc object trả về ──────────────────────────────────────────────────

  test('TC-07g: user object có đủ các trường: id, username, name, role, status', () => {
    const result = findUser('admin', '123')
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('username')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('role')
    expect(result).toHaveProperty('status')
  })
})
