import { Badge, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { state, dispatch } = useAuth()
  const { user } = state

  if (!user) {
    return null
  }

  return (
    <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '500px', width: '100%' }}>
      <Card.Body className="p-4 p-md-5 text-center">
        <div className="avatar-circle mx-auto mb-4 d-flex align-items-center justify-content-center bg-gradient-primary">
          <span className="text-white fs-1 fw-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </span>
        </div>

        <h3 className="fw-bold mb-2 text-dark">{user.name}</h3>
        <p className="text-muted small mb-3">@{user.username}</p>

        <div className="mb-4">
          <Badge
            bg={user.role === 'admin' ? 'danger' : 'success'}
            className="px-3 py-2 rounded-pill fs-6 text-uppercase"
          >
            {user.role}
          </Badge>
        </div>

        <div className="d-flex flex-column gap-2 mt-4">
          {user.role === 'admin' && (
            <Link
              to="/users"
              className="btn btn-outline-primary py-2.5 rounded-3 fw-semibold transition-all"
            >
              Xem danh sách Users
            </Link>
          )}

          <Button
            variant="danger"
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="py-2.5 rounded-3 fw-semibold border-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
