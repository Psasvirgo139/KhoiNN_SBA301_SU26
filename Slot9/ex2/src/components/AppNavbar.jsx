// src/components/AppNavbar.jsx
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function AppNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="md" sticky="top">
      <Container>
        {/* Logo / Brand */}
        <Navbar.Brand as={NavLink} to='/'>
          📝 React Blog
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className='ms-auto'>
            {/* as={NavLink} → tự thêm class 'active' khi URL khớp */}
            <Nav.Link as={NavLink} to='/'      end>🏠 Trang chủ</Nav.Link>
            <Nav.Link as={NavLink} to='/posts'    >📚 Bài viết</Nav.Link>
            <Nav.Link as={NavLink} to='/about'    >ℹ️ Giới thiệu</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
