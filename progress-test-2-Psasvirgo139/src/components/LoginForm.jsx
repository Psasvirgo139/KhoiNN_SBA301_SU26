import { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { findUser } from '../utils/authHelpers'

/**
 * Form đăng nhập.
 * - Dùng useAuth() để đọc state.error và gọi dispatch.
 * - Gọi findUser() khi submit để xác thực.
 * - Dispatch LOGIN_SUCCESS hoặc LOGIN_FAILURE tuỳ kết quả.
 */
function LoginForm() {
  const { state, dispatch } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (state.isAuthenticated) {
    return <Navigate to="/categories/add" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = findUser(username, password)
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Sai username hoặc password!' })
    }
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ minWidth: 360 }}>
        <Card.Header className="bg-primary text-white text-center fw-bold">
          Đăng nhập
        </Card.Header>
        <Card.Body>
          {state.error && (
            <Alert variant="danger">{state.error}</Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                Đăng nhập
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="text-muted text-center small">
          © 2024 Lab useContext
        </Card.Footer>
      </Card>
    </div>
  )
}

export default LoginForm
