import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import Ex01_BasicCounter from './pages/Ex01_BasicCounter'
import Ex02_CounterWithStep from './pages/Ex02_CounterWithStep'
import Ex03_TodoList from './pages/Ex03_TodoList'
import Ex04_ShoppingCart from './pages/Ex04_ShoppingCart'
import Ex05_FormValidation from './pages/Ex05_FormValidation'
import Ex06_Login from './pages/Ex06_Login'

function Home() {
  return (
    <Container className="py-5 text-center">
      <h1 className="fw-bold text-dark mb-3">useReducer – Bài tập thực hành</h1>
      <p className="text-muted fs-5">Chọn bài tập từ thanh điều hướng phía trên để bắt đầu thực hành</p>
    </Container>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('loggedInUser') || 'null')
    } catch {
      return null
    }
  })

  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">useReducer</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={NavLink} to="/ex01" className="px-3">Bài 1 – Counter</Nav.Link>
              <Nav.Link as={NavLink} to="/ex02" className="px-3">Bài 2 – Step</Nav.Link>
              <Nav.Link as={NavLink} to="/ex03" className="px-3">Bài 3 – Todo</Nav.Link>
              <Nav.Link as={NavLink} to="/ex04" className="px-3">Bài 4 – Cart</Nav.Link>
              <Nav.Link as={NavLink} to="/ex05" className="px-3">Bài 5 – Form</Nav.Link>

              {user ? (
                <>
                  <Navbar.Text className="text-white-50 px-2">
                    Chào, <strong className="text-info">{user.fullName}</strong>
                  </Navbar.Text>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2 fw-semibold px-3"
                    onClick={() => {
                      setUser(null)
                      localStorage.removeItem('loggedInUser')
                    }}
                  >
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Nav.Link as={NavLink} to="/ex06" className="px-3">
                  Bài 6 – Login
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ex01" element={<Ex01_BasicCounter />} />
          <Route path="/ex02" element={<Ex02_CounterWithStep />} />
          <Route path="/ex03" element={<Ex03_TodoList />} />
          <Route path="/ex04" element={<Ex04_ShoppingCart />} />
          <Route path="/ex05" element={<Ex05_FormValidation />} />
          <Route
            path="/ex06"
            element={
              <Ex06_Login
                onLoginSuccess={(loggedInUser) => {
                  setUser(loggedInUser)
                  localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
                }}
              />
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
