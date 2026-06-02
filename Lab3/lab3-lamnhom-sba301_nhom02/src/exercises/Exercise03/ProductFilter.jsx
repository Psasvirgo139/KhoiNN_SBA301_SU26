import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { products, categories } from '../../data/products';

export default function ProductFilter() {
  // TODO 1: Khai báo state `selectedCategory` với giá trị khởi tạo là 'Tất cả'

  // TODO 2: Khai báo state `searchQuery` với giá trị khởi tạo là ''

  // TODO 3: Tính biến `filteredProducts`:
  //         - Bắt đầu từ mảng products
  //         - Nếu selectedCategory !== 'Tất cả': lọc các sản phẩm có category === selectedCategory
  //         - Nếu searchQuery không rỗng: lọc tiếp các sản phẩm có name chứa searchQuery (không phân biệt hoa thường)
  //         - Kết quả là mảng sản phẩm đã lọc

  return (
    <Container className="mt-4">
      <h4 className="mb-4">🛍️ Danh Sách Sản Phẩm</h4>

      <Row className="mb-3 g-2">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            {/* TODO 4: Form.Control với:
                        - placeholder="Tìm kiếm sản phẩm..."
                        - value bind với searchQuery
                        - onChange cập nhật searchQuery
                        - data-testid="search-input" */}
          </InputGroup>
        </Col>

        <Col md={7}>
          <div className="d-flex gap-2 flex-wrap">
            {/* TODO 5: Render danh sách nút lọc từ mảng `categories`:
                        Mỗi nút là <Button>:
                        - key={category}
                        - data-testid={`filter-${category}`}
                        - variant khi active: "primary", khi không active: "outline-primary"
                        - onClick: cập nhật selectedCategory
                        - label: category */}
          </div>
        </Col>
      </Row>

      <div className="mb-3">
        <Badge bg="secondary" data-testid="product-count">
          {/* TODO 6: Hiển thị "Tìm thấy X sản phẩm" với X là số lượng filteredProducts */}
          Tìm thấy 0 sản phẩm
        </Badge>
      </div>

      <Row className="g-3" data-testid="product-list">
        {/* TODO 7: Nếu filteredProducts rỗng, hiển thị thông báo "Không tìm thấy sản phẩm nào." */}

        {/* TODO 8: Render danh sách filteredProducts:
                    Mỗi sản phẩm là:
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                      <Card data-testid={`product-card-${product.id}`} className="h-100 shadow-sm">
                        <Card.Img variant="top" src={product.image} style={{ height: 180, objectFit: 'cover' }} />
                        <Card.Body>
                          <Badge bg="info" className="mb-2">{product.category}</Badge>
                          <Card.Title style={{ fontSize: '0.95rem' }}>{product.name}</Card.Title>
                          <div className="fw-bold text-danger">
                            {product.price.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            Còn {product.stock} sản phẩm
                          </div>
                        </Card.Body>
                      </Card>
                    </Col> */}
      </Row>
    </Container>
  );
}
