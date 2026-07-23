import { Container } from 'react-bootstrap'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100 p-0"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}
    >
      <LoginForm />
    </Container>
  )
}
