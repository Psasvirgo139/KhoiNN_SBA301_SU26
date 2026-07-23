import db from '../../db.json'

export async function getUsers() {
  return Promise.resolve(db.users)
}

export async function getUserById(id) {
  const user = db.users.find(u => u.id === id)
  return Promise.resolve(user ?? null)
}

export async function findUserByCredentials(username, password) {
  if (!username || !password) {
    return Promise.resolve(null)
  }
  const user = db.users.find(u => u.username === username && u.password === password)
  if (!user) {
    return Promise.resolve(null)
  }
  if (user.status !== 'active') {
    return Promise.resolve(null)
  }
  return Promise.resolve(user)
}
