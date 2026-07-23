import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Container } from 'react-bootstrap'

export default function ProtectedRoute({ children, requiredRole }) {
  const { token, currentUser } = useAuth()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && currentUser?.role !== requiredRole) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Bạn không có quyền thực hiện thao tác này. Yêu cầu: <strong>{requiredRole}</strong>
        </Alert>
      </Container>
    )
  }
  
  return children
}
