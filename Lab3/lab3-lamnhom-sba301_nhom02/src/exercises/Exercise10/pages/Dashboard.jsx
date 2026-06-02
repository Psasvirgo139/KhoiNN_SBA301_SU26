import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBooksFromStorage } from '../utils/storage';

export default function Dashboard() {
  const books = getBooksFromStorage();
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.available === true).length;
  const unavailableBooks = books.filter((b) => b.available === false).length;
  const genres = new Set(books.map((b) => b.genre)).size;

  return (
    <Container className="mt-4" data-testid="dashboard-page">
      <h4 className="mb-4">📊 Dashboard</h4>

      <Row className="g-4 mb-5">
        <Col sm={6} lg={3}>
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <div style={{ fontSize: '2.5rem' }}>📚</div>
              <h2 className="fw-bold text-primary" data-testid="stat-total">
                {totalBooks}
              </h2>
              <div className="text-muted">Tổng Số Sách</div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <div style={{ fontSize: '2.5rem' }}>✅</div>
              <h2 className="fw-bold text-success" data-testid="stat-available">
                {availableBooks}
              </h2>
              <div className="text-muted">Còn Hàng</div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="text-center shadow-sm border-danger">
            <Card.Body>
              <div style={{ fontSize: '2.5rem' }}>❌</div>
              <h2 className="fw-bold text-danger" data-testid="stat-unavailable">
                {unavailableBooks}
              </h2>
              <div className="text-muted">Hết Hàng</div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="text-center shadow-sm border-info">
            <Card.Body>
              <div style={{ fontSize: '2.5rem' }}>🏷️</div>
              <h2 className="fw-bold text-info" data-testid="stat-genres">
                {genres}
              </h2>
              <div className="text-muted">Thể Loại</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header>⚡ Thao Tác Nhanh</Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <Button as={Link} to="/books" variant="outline-primary">📋 Xem Danh Sách Sách</Button>
              <Button as={Link} to="/books/new" variant="primary">+ Thêm Sách Mới</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header>📈 Sách Mới Nhất</Card.Header>
            <Card.Body>
              {books.slice(0, 3).map((book) => (
                <div key={book.id} className="d-flex justify-content-between py-1 border-bottom">
                  <span>{book.title}</span>
                  <Link to={`/books/${book.id}`}>Chi tiết</Link>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
