import { createContext, useReducer } from 'react'

// Export AuthContext để test file có thể import trực tiếp
export const AuthContext = createContext(null)

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
}

/**
 * Reducer xử lý 3 action types:
 *  LOGIN_SUCCESS  → đăng nhập thành công, lưu user, xóa error
 *  LOGIN_FAILURE  → đăng nhập thất bại, lưu error message
 *  LOGOUT         → reset về initialState
 */
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        isAuthenticated: false,
        user: null,
        error: action.payload,
      }
    case 'LOGOUT':
      return { ...initialState }
    default:
      return state
  }
}

/**
 * AuthProvider — bọc toàn bộ app, cung cấp { state, dispatch } qua context.
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
