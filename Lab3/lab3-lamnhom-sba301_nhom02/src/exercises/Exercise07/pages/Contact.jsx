import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

export default function Contact() {
  return (
    <Container className="mt-5" data-testid="contact-page">
      <h2 className="mb-4">📬 Liên Hệ</h2>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Thông Tin Giảng Viên</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>👤 <strong>Giảng viên:</strong> FPT University</ListGroup.Item>
              <ListGroup.Item>📧 <strong>Email:</strong> sba301@fpt.edu.vn</ListGroup.Item>
              <ListGroup.Item>🏫 <strong>Phòng:</strong> P. Giảng dạy A</ListGroup.Item>
              <ListGroup.Item>⏰ <strong>Giờ hỗ trợ:</strong> Thứ 2 – Thứ 6, 8:00–17:00</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Tài Nguyên Học Tập</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>📚 React Docs: reactjs.org</ListGroup.Item>
              <ListGroup.Item>🛣️ React Router: reactrouter.com</ListGroup.Item>
              <ListGroup.Item>🎨 React Bootstrap: react-bootstrap.github.io</ListGroup.Item>
              <ListGroup.Item>💻 GitHub Classroom: classroom.github.com</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
