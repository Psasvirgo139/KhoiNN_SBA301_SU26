import React from 'react'
import { Navbar, Container } from 'react-bootstrap'

export const Header = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  const formattedDate = `${dd}/${mm}/${yyyy}`

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm py-3" style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)' }}>
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-3 text-white">
          Logo
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="text-light fw-semibold fs-5">
            Date: {formattedDate}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
