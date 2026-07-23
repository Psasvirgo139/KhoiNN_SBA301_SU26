// Đọc dữ liệu users từ db.json ở thư mục gốc dự án.
// Vite hỗ trợ import JSON trực tiếp — không cần cài thêm loader.
import db from '../../db.json'

const USERS = db.users

/**
 * Tìm user theo username và password.
 * @param {string} username
 * @param {string} password
 * @returns {object|null} user object nếu tìm thấy, null nếu không
 */
export function findUser(username, password) {
  if (!username || !password) return null
  const found = USERS.find(
    (u) => u.username === username && u.password === password
  )
  return found ?? null
}
