import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  // TODO 1: Khai báo biến `navigate` bằng hook useNavigate()

  return (
    <Container className="mt-5" data-testid="home-page">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="display-4 fw-bold text-primary">Chào Mừng Đến Với</h1>
          <h2 className="text-secondary mb-4">SBA301 React Course</h2>
          <p className="lead text-muted mb-5">
            Học React từ cơ bản đến nâng cao. Khám phá useState, Routing và nhiều hơn nữa!
          </p>

          <Row className="g-3 mb-5">
            {[
              { icon: '⚛️', title: 'useState', desc: 'Quản lý trạng thái component' },
              { icon: '🛣️', title: 'Routing', desc: 'Điều hướng giữa các trang' },
              { icon: '🎨', title: 'Bootstrap', desc: 'Giao diện đẹp, chuyên nghiệp' },
            ].map((item) => (
              <Col key={item.title} md={4}>
                <Card className="h-100 shadow-sm text-center p-3">
                  <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                  <Card.Title className="mt-2">{item.title}</Card.Title>
                  <Card.Text className="text-muted">{item.desc}</Card.Text>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="primary"
              size="lg"
              data-testid="go-to-about-btn"
              onClick={() => {/* TODO 2: navigate đến '/about' */}}
            >
              Tìm Hiểu Thêm
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              data-testid="go-to-contact-btn"
              onClick={() => {/* TODO 3: navigate đến '/contact' */}}
            >
              Liên Hệ
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
