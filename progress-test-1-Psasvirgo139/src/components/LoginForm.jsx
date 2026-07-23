import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { findUser } from '../utils/authHelpers'

export default function LoginForm() {
  const { state, dispatch } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const user = findUser(username, password)
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Sai username hoặc password!' })
    }
  }

  return (
    <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '420px', width: '100%' }}>
      <Card.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-gradient">Chào mừng trở lại</h2>
          <p className="text-muted small">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        {state.error && (
          <Alert variant="danger" role="alert" className="border-0 rounded-3 mb-4">
            {state.error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label className="small fw-semibold text-secondary">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="py-2.5 rounded-3 border-light bg-light focus-ring"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2.5 rounded-3 border-light bg-light focus-ring"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2.5 rounded-3 fw-bold border-0 shadow-sm text-uppercase"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              letterSpacing: '0.5px'
            }}
          >
            Đăng nhập
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
