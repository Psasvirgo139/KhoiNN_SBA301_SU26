import { Navbar, Container, Button, Nav } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'

/**
 * AppNavbar — thanh điều hướng hiển thị khi đã đăng nhập.
 * Render thẻ <nav> (role="navigation") thông qua React Bootstrap Navbar.
 */
function AppNavbar() {
  const { state, dispatch } = useAuth()

  return (
    <Navbar bg="dark" variant="dark" expand="lg" role="navigation">
      <Container>
        <Navbar.Brand href="/">Restaurant App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Restaurants</Nav.Link>
            <Nav.Link href="/categories">Categories</Nav.Link>
            <Nav.Link href="/categories/add">Add Category</Nav.Link>
          </Nav>
          <Navbar.Text className="me-3 text-white">
            {state.user?.name}
          </Navbar.Text>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => dispatch({ type: 'LOGOUT' })}
          >
            Đăng xuất
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar


