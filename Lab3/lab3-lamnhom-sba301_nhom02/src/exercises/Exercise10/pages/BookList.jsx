import { useState } from 'react';
import { Container, Row, Col, Table, Button, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getBooksFromStorage, saveBooksToStorage } from '../utils/storage';
import { genres } from '../../../data/books';

export default function BookList() {
  const [books, setBooks] = useState(getBooksFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const navigate = useNavigate();

  let filteredBooks = books;
  if (selectedGenre !== 'Tất cả') {
    filteredBooks = filteredBooks.filter((b) => b.genre === selectedGenre);
  }
  if (searchQuery) {
    filteredBooks = filteredBooks.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  function deleteBook(id) {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      const updated = books.filter((b) => b.id !== id);
      setBooks(updated);
      saveBooksToStorage(updated);
    }
  }

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">📋 Danh Sách Sách</h4>
        </Col>
        <Col xs="auto">
          <Button
            as={Link}
            to="/books/new"
            variant="primary"
            data-testid="add-book-btn"
          >
            + Thêm Sách
          </Button>
        </Col>
      </Row>

      <Row className="mb-3 g-2">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm theo tên sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-books"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            data-testid="genre-filter"
          >
            {genres.map((g) => <option key={g}>{g}</option>)}
          </Form.Select>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Badge bg="secondary">
            {filteredBooks.length} sách
          </Badge>
        </Col>
      </Row>

      {filteredBooks.length === 0 && (
        <Alert variant="info">Không tìm thấy sách nào.</Alert>
      )}

      <Table striped bordered hover responsive data-testid="book-table">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Tên Sách</th>
            <th>Tác Giả</th>
            <th>Thể Loại</th>
            <th>Năm</th>
            <th>Giá</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book, index) => (
            <tr key={book.id} data-testid={`book-row-${book.id}`}>
              <td>{index + 1}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td><Badge bg="info">{book.genre}</Badge></td>
              <td>{book.year}</td>
              <td>{book.price.toLocaleString('vi-VN')}đ</td>
              <td>
                <Badge bg={book.available ? 'success' : 'danger'}>
                  {book.available ? 'Còn hàng' : 'Hết hàng'}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-info" as={Link}
                  to={`/books/${book.id}`} className="me-1"
                  data-testid={`view-book-${book.id}`}>Xem</Button>
                <Button size="sm" variant="outline-warning" as={Link}
                  to={`/books/edit/${book.id}`} className="me-1"
                  data-testid={`edit-book-${book.id}`}>Sửa</Button>
                <Button size="sm" variant="outline-danger"
                  data-testid={`delete-book-${book.id}`}
                  onClick={() => deleteBook(book.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
