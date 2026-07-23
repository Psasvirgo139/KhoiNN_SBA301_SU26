import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppNavBar() {
  const { pathname } = useLocation()
  const { token, currentUser, logout } = useAuth()

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">🌸 Orchid Management</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={pathname === '/'}>Home</Nav.Link>
            {token && <Nav.Link as={Link} to="/add" active={pathname === '/add'}>➕ Add Orchid</Nav.Link>}
          </Nav>
          <Nav>
            {token ? (
              <>
                <Navbar.Text className="me-3 text-light">
                  👤 {currentUser?.sub} ({currentUser?.role ?? 'USER'})
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={logout}>Đăng xuất</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" active={pathname === '/login'}>Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/signup" active={pathname === '/signup'}>Đăng ký</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
