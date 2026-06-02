import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand href="/">⚛️ SBA301</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {/* TODO 1: Thêm NavLink đến '/' với:
                        - data-testid="nav-home"
                        - className={({ isActive }) => isActive ? 'nav-link active fw-bold' : 'nav-link'}
                        - end (prop để chỉ active khi khớp chính xác '/')
                        - label "Trang Chủ" */}

            {/* TODO 2: Thêm NavLink đến '/about' với:
                        - data-testid="nav-about"
                        - className tương tự như trên
                        - label "Giới Thiệu" */}

            {/* TODO 3: Thêm NavLink đến '/contact' với:
                        - data-testid="nav-contact"
                        - className tương tự như trên
                        - label "Liên Hệ" */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
