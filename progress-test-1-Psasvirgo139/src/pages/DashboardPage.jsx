import { Container } from 'react-bootstrap'
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  return (
    <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Dashboard />
    </Container>
  )
}
