import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, signupApi } from '../utils/orchidApi'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // lazy initializer: đọc localStorage một lần khi mount
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const navigate = useNavigate()
  const currentUser = token ? decodeToken(token) : null

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password })
    const { accessToken } = res.data
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    navigate('/')
  }, [navigate])

  const signup = useCallback(async (fullName, email, password) => {
    const res = await signupApi({ fullName, email, password })
    const { accessToken } = res.data
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    navigate('/')
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ token, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth phải dùng trong AuthProvider')
  }
  return ctx
}
