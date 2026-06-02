import { Container, Row, Col, Card, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const exercises = [
  {
    path: '/ex01',
    title: 'Bài 1 – Counter',
    badge: 'useContext + useState',
    desc: 'Chia sẻ state đếm qua Context cho nhiều component độc lập.',
    files: ['context/CounterContext.jsx', 'components/counter/*', 'pages/Ex01CounterPage.jsx'],
  },
  {
    path: '/ex02',
    title: 'Bài 2 – Login Form',
    badge: 'useContext + useState',
    desc: 'Quản lý trạng thái đăng nhập toàn app qua AuthContext.',
    files: ['context/AuthContext.jsx', 'components/auth/*', 'pages/Ex02LoginPage.jsx'],
  },
  {
    path: '/ex03',
    title: 'Bài 3 – Validation Form',
    badge: 'useContext + useReducer',
    desc: 'Form đăng ký với validation theo thời gian thực, dùng useReducer.',
    files: ['context/FormContext.jsx', 'reducers/formReducer.js', 'utils/validators.js', 'components/form/*', 'pages/Ex03ValidationPage.jsx'],
  },
  {
    path: '/ex04',
    title: 'Bài 4 – Theme Switcher',
    badge: 'useContext + useState',
    desc: 'Đổi giao diện Light / Dark / System, lưu vào localStorage.',
    files: ['context/ThemeContext.jsx', 'data/themeConfig.js', 'components/theme/*', 'pages/Ex04ThemePage.jsx'],
  },
]

export default function HomePage() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">useContext – Bài tập thực hành</h1>
        <p className="text-muted lead">
          Vận dụng <strong>useContext</strong>, <strong>useState</strong>,{' '}
          <strong>useReducer</strong> và <strong>React Router</strong>
        </p>
      </div>
      <Row xs={1} md={2} className="g-4">
        {exercises.map(ex => (
          <Col key={ex.path}>
            <Card as={Link} to={ex.path} className="h-100 text-decoration-none shadow-sm border-0"
              style={{ transition: 'transform .15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <Card.Body className="p-4">
                <Badge bg="primary" className="mb-2">{ex.badge}</Badge>
                <Card.Title className="text-dark">{ex.title}</Card.Title>
                <Card.Text className="text-muted small">{ex.desc}</Card.Text>
                <hr />
                <p className="mb-1 small fw-semibold text-secondary">Files cần tạo:</p>
                <ul className="mb-0 ps-3">
                  {ex.files.map(f => (
                    <li key={f} className="small text-muted font-monospace">{f}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
