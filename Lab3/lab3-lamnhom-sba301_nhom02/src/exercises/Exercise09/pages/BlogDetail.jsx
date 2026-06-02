import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogPosts } from '../../../data/blogPosts';

export default function BlogDetail() {
  // TODO 1: Lấy `id` từ URL params bằng useParams()

  // TODO 2: Khai báo `navigate` bằng useNavigate()

  // TODO 3: Tìm `post` trong blogPosts có id === Number(id)

  // TODO 4: Nếu không tìm thấy post, hiển thị:
  //         <Container className="mt-4">
  //           <p>Bài viết không tồn tại.</p>
  //           <Button onClick={() => navigate('/')}>Quay lại danh sách</Button>
  //         </Container>

  return (
    <Container className="mt-4" data-testid="blog-detail">
      <Button
        variant="outline-secondary"
        className="mb-4"
        data-testid="back-to-blog-btn"
        onClick={() => {/* TODO 5: navigate(-1) */}}
      >
        ← Quay Lại Blog
      </Button>

      {/* TODO 6: Render chi tiết bài viết:
                  <Row className="justify-content-center">
                    <Col lg={8}>
                      <img src={post.image} alt={post.title}
                        className="w-100 rounded mb-4"
                        style={{ maxHeight: 350, objectFit: 'cover' }} />

                      <div className="d-flex gap-3 mb-3 align-items-center">
                        <Badge bg="info" data-testid="post-category">{post.category}</Badge>
                        <small className="text-muted">{post.date}</small>
                        <small className="text-muted">✍️ {post.author}</small>
                      </div>

                      <h2 data-testid="post-title">{post.title}</h2>
                      <p className="lead text-muted">{post.excerpt}</p>
                      <hr />
                      <div data-testid="post-content">{post.content}</div>

                      <hr className="mt-5" />
                      <div className="d-flex justify-content-between">
                        <Button as={Link} to="/" variant="outline-primary">
                          ← Tất cả bài viết
                        </Button>
                      </div>
                    </Col>
                  </Row> */}
    </Container>
  );
}
