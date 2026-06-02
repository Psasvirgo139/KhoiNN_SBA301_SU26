import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../../data/products';

export default function ProductDetail() {
  // TODO 1: Lấy `id` từ URL params bằng hook useParams()
  //         Lưu ý: id từ params là string, cần chuyển sang số khi so sánh

  // TODO 2: Khai báo biến `navigate` bằng hook useNavigate()

  // TODO 3: Tìm `product` trong mảng products có id === Number(id)

  // TODO 4: Nếu không tìm thấy product, navigate đến '/404'

  return (
    <Container className="mt-4" data-testid="product-detail">
      <Button
        variant="outline-secondary"
        className="mb-4"
        data-testid="back-btn"
        onClick={() => {/* TODO 5: navigate(-1) để quay lại trang trước */}}
      >
        ← Quay Lại
      </Button>

      {/* TODO 6: Render thông tin sản phẩm nếu product tồn tại:
                  <Row className="g-4">
                    <Col md={5}>
                      <Card.Img src={product.image} style={{ borderRadius: 8 }} />
                    </Col>
                    <Col md={7}>
                      <h2>{product.name}</h2>
                      <Badge bg="info" className="mb-3">{product.category}</Badge>
                      <h3 className="text-danger">{product.price.toLocaleString('vi-VN')}đ</h3>
                      <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item>⭐ Đánh giá: {product.rating}/5</ListGroup.Item>
                        <ListGroup.Item>📦 Còn hàng: {product.stock} sản phẩm</ListGroup.Item>
                        <ListGroup.Item>🏷️ Danh mục: {product.category}</ListGroup.Item>
                      </ListGroup>
                      <Button variant="primary" size="lg" className="mt-4">
                        Thêm vào giỏ hàng
                      </Button>
                    </Col>
                  </Row> */}
    </Container>
  );
}
