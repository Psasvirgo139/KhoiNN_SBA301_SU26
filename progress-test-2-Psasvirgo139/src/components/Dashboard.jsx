import { Container, Card, Badge, Button } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'

/**
 * Dashboard — hiển thị thông tin user sau khi đăng nhập.
 * Badge role:
 *   admin → bg="danger"  (bg-danger)
 *   user  → bg="success" (bg-success)
 */
function Dashboard() {
  const { state, dispatch } = useAuth()
  const { user } = state

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-success text-white fw-bold">
          Dashboard
        </Card.Header>
        <Card.Body>
          <p>
            Xin chào, <strong>{user?.name}</strong>!
          </p>
          <p>
            Role:{' '}
            <Badge bg={user?.role === 'admin' ? 'danger' : 'success'}>
              {user?.role}
            </Badge>
          </p>
          <Button
            variant="outline-danger"
            onClick={() => dispatch({ type: 'LOGOUT' })}
          >
            Đăng xuất
          </Button>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Dashboard
