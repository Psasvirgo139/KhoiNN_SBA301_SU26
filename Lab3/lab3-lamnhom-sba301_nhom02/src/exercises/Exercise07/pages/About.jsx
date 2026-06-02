import { Container, Row, Col, Card } from 'react-bootstrap';

export default function About() {
  return (
    <Container className="mt-5" data-testid="about-page">
      <h2 className="mb-4">📖 Giới Thiệu</h2>

      <Row className="g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Về Môn Học</Card.Title>
              <Card.Text>
                SBA301 là môn học về phát triển web frontend với React.
                Sinh viên sẽ học cách xây dựng Single Page Application (SPA)
                hiện đại sử dụng các công nghệ: React, React Router, Bootstrap.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Nội Dung Chương Trình</Card.Title>
              <ul className="list-unstyled">
                {[
                  'useState và quản lý state',
                  'React Router DOM v6',
                  'CRUD operations',
                  'Form validation',
                  'React Bootstrap components',
                ].map((item) => (
                  <li key={item} className="mb-1">✅ {item}</li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
