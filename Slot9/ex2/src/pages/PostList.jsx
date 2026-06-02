// src/pages/PostList.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { posts } from '../data/posts';

function PostList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Lấy danh sách category không trùng
  const categories = ['Tất cả', ...new Set(posts.map(p => p.category))];

  // Lọc theo tìm kiếm và category
  const filtered = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tất cả' || post.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <Container className="py-4">
      <h2 className='mb-4'>📚 Danh sách bài viết</h2>

      {/* Thanh tìm kiếm */}
      <InputGroup className="mb-3">
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Tìm kiếm bài viết...'
        />
        {search && (
          <Button variant='outline-secondary' onClick={() => setSearch('')}>
            × Xóa
          </Button>
        )}
      </InputGroup>

      {/* Bộ lọc category */}
      <div className='mb-4 d-flex gap-2 flex-wrap'>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Kết quả */}
      {filtered.length === 0 ? (
        <p className='text-muted text-center py-5'>
          Không tìm thấy bài viết nào.
        </p>
      ) : (
        <Row>
          {filtered.map(post => (
            <Col md={6} lg={4} key={post.id} className="mb-4">
              <Card
                className='h-100 shadow-sm'
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <Card.Body>
                  <div className='d-flex justify-content-between mb-2'>
                    <Badge bg='primary'>{post.category}</Badge>
                    <small className='text-muted'>{post.date}</small>
                  </div>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text className='text-muted small'>
                    {post.body.substring(0, 70)}...
                  </Card.Text>
                  <div className='d-flex flex-wrap gap-1 mt-2'>
                    {post.tags.map(tag => (
                      <Badge key={tag} bg='secondary' className='fw-normal'>#{tag}</Badge>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer className='text-muted small'>
                  ✍️ {post.author}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default PostList;
