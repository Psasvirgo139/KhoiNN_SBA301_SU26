/**
 * TC-07 — Kiểm thử hàm findUser (utility)
 *
 * Yêu cầu sinh viên:
 *   - src/utils/authHelpers.js  export hàm findUser(username, password)
 *   - db.json (thư mục gốc)     nguồn dữ liệu users — import qua authHelpers.js
 */

import { findUser } from '../../utils/authHelpers'

describe('TC-07 | findUser()', () => {
  test('TC-07a: trả về object user khi username và password đúng (admin)', () => {
    const result = findUser('admin', '123')
    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      username: 'admin',
      role: 'admin',
    })
  })

  test('TC-07b: trả về object user khi username và password đúng (user thường)', () => {
    const result = findUser('user', '123')
    expect(result).not.toBeNull()
    expect(result).toMatchObject({
      username: 'user',
      role: 'user',
    })
  })

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

  test('TC-07f: user object phải có đủ các trường: id, username, name, role', () => {
    const result = findUser('admin', '123')
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('username')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('role')
  })
})