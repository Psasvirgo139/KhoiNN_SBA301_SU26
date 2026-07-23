// TODO-09: Chan truy cap theo role (1 = Admin, 2 = Staff)
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(user.accountRole)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedRoute
