import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function AppNavBar() {
  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active fw-bold text-warning' : 'nav-link text-light';

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand>📚 Quản Lý Sách</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <NavLink to="/" data-testid="nav-dashboard" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/books" data-testid="nav-books" className={linkClass}>
              Danh Sách Sách
            </NavLink>
            <NavLink to="/books/new" data-testid="nav-add-book" className={linkClass}>
              + Thêm Sách
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
