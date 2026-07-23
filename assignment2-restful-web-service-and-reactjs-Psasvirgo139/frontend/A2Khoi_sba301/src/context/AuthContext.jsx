// TODO-09: Quan ly trang thai dang nhap toan app
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (account) => {
    setUser(account)
    localStorage.setItem('user', JSON.stringify(account))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const isAdmin = user?.accountRole === 1
  const isStaff = user?.accountRole === 2

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
