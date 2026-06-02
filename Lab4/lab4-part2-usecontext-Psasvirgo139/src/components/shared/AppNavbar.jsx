import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

/**
 * AppNavbar – Thanh điều hướng dùng chung cho toàn app.
 * File này đã được cung cấp sẵn, KHÔNG cần chỉnh sửa.
 */
export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">useContext</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/ex01">Bài 1 – Counter</Nav.Link>
            <Nav.Link as={NavLink} to="/ex02">Bài 2 – Login</Nav.Link>
            <Nav.Link as={NavLink} to="/ex03">Bài 3 – Validation</Nav.Link>
            <Nav.Link as={NavLink} to="/ex04">Bài 4 – Theme</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
