import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * Custom hook để truy cập AuthContext.
 * Ném lỗi nếu được dùng ngoài AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider')
  }
  return context
}
