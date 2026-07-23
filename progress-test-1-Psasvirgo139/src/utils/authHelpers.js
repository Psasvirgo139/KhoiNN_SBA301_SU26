import db from '../../db.json'

const USERS = db.users

/**
 * Tìm user hợp lệ theo username và password.
 * Chỉ trả về user nếu credentials đúng VÀ status === 'active'.
 * @param {string} username
 * @param {string} password
 * @returns {Object|null}
 */
export function findUser(username, password) {
  if (!username || !password) {
    return null
  }
  const user = USERS.find(u => u.username === username && u.password === password)
  if (!user) {
    return null
  }
  if (user.status !== 'active') {
    return null
  }
  return user
}
