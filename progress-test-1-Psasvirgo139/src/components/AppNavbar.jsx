import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AppNavbar() {
  const { state, dispatch } = useAuth()
  const { user } = state

  if (!user) {
    return null
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow" role="navigation">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold fs-4 text-gradient">
          SBA Classroom
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Dashboard
            </Nav.Link>
            {user.role === 'admin' && (
              <Nav.Link as={NavLink} to="/users">
                Quản lý Users
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center gap-3">
            <Navbar.Text className="text-light small">
              Xin chào, <strong className="text-white">{user.name}</strong>
            </Navbar.Text>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => dispatch({ type: 'LOGOUT' })}
              className="px-3 rounded-pill"
            >
              Đăng xuất
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
