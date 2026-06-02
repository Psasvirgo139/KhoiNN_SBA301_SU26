// src/pages/Home.jsx
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { posts } from '../data/posts';
import RegistrationForm from '../components/RegistrationForm'

function Home() {
  // Lấy 2 bài mới nhất hiển thị preview
  const latestPosts = posts.slice(0, 2);

  return (
    <Container className="py-5">
      {/* Hero section */}
      <Row className="mb-5">
        <Col>
          <Card className="text-center p-5 bg-primary text-white">
            <Card.Body>
              <h1>📝 React Blog</h1>
              <p className='lead'>
                Nơi chia sẻ kiến thức React, Hooks và Frontend
              </p>
              <Badge bg='light' text='dark' className='me-2'>
                {posts.length} bài viết
              </Badge>
              <Button as={Link} to='/posts' variant='light' className='mt-3'>
                Xem tất cả bài viết →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    
      {/* Bài viết mới nhất */}
      <h4 className='mb-3'>Bài viết mới nhất</h4>
      <Row>
        {latestPosts.map(post => (
          <Col md={6} key={post.id} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Badge bg='primary' className='mb-2'>{post.category}</Badge>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className='text-muted'>
                  {post.body.substring(0, 80)}...
                </Card.Text>
                <Button as={Link} to={`/posts/${post.id}`} variant='outline-primary' size='sm'>
                  Đọc tiếp →
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
        {/* Registration Form */}
        <RegistrationForm/>
    </Container>
  );
}

export default Home;
