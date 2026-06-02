import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert } from 'react-bootstrap';
import { products } from '../../data/products';

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);

  // TODO 1: Khai báo hàm `addToCart(product)`:
  //         - Kiểm tra xem product đã có trong cart chưa (so sánh id)
  //         - Nếu đã có: tăng quantity lên 1
  //         - Nếu chưa có: thêm { ...product, quantity: 1 } vào cart

  // TODO 2: Khai báo hàm `removeFromCart(id)`:
  //         - Xóa item có id khỏi cart

  // TODO 3: Khai báo hàm `increaseQty(id)`:
  //         - Tăng quantity của item có id lên 1

  // TODO 4: Khai báo hàm `decreaseQty(id)`:
  //         - Nếu quantity === 1: xóa item khỏi cart
  //         - Nếu quantity > 1: giảm quantity xuống 1

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container fluid className="mt-4 px-4">
      <h4 className="mb-4">🛒 Cửa Hàng</h4>

      <Row>
        <Col lg={7}>
          <h5 className="mb-3">
            Sản phẩm{' '}
            <Badge bg="secondary" data-testid="cart-count">
              {/* TODO 5: Hiển thị số lượng item trong giỏ (cartItemCount) */}
              0
            </Badge>
          </h5>

          <Row className="g-3">
            {products.map((product) => {
              const inCart = cart.find((c) => c.id === product.id);
              return (
                <Col key={product.id} xs={12} sm={6} xl={4}>
                  <Card data-testid={`product-${product.id}`} className="h-100 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ height: 140, objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={{ fontSize: '0.9rem' }}>{product.name}</Card.Title>
                      <div className="fw-bold text-danger mb-auto">
                        {product.price.toLocaleString('vi-VN')}đ
                      </div>
                      <Button
                        variant={inCart ? 'success' : 'primary'}
                        size="sm"
                        className="mt-2"
                        data-testid={`add-to-cart-${product.id}`}
                        onClick={/* TODO 6: gọi addToCart(product) */undefined}
                      >
                        {inCart ? `✓ Đã thêm (${inCart.quantity})` : 'Thêm vào giỏ'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm sticky-top" style={{ top: 16 }}>
            <Card.Header className="bg-warning">
              <h5 className="mb-0">🛍️ Giỏ Hàng ({cartItemCount ?? 0} sản phẩm)</h5>
            </Card.Header>

            <Card.Body style={{ maxHeight: 400, overflowY: 'auto' }}>
              {/* TODO 7: Nếu cart rỗng, hiển thị <Alert variant="secondary">Giỏ hàng trống</Alert> */}

              {/* TODO 8: Render danh sách items trong cart dưới dạng Table:
                          <Table size="sm" responsive>
                            <tbody>
                              {cart.map(item => (
                                <tr key={item.id} data-testid={`cart-item-${item.id}`}>
                                  <td>{item.name}</td>
                                  <td className="text-center">
                                    <Button size="sm" variant="outline-secondary"
                                      data-testid={`decrease-qty-${item.id}`}
                                      onClick={() => decreaseQty(item.id)}>−</Button>
                                    <span data-testid={`quantity-${item.id}`} className="mx-2">{item.quantity}</span>
                                    <Button size="sm" variant="outline-secondary"
                                      data-testid={`increase-qty-${item.id}`}
                                      onClick={() => increaseQty(item.id)}>+</Button>
                                  </td>
                                  <td className="text-end text-danger fw-bold">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                  </td>
                                  <td>
                                    <Button size="sm" variant="outline-danger"
                                      data-testid={`remove-from-cart-${item.id}`}
                                      onClick={() => removeFromCart(item.id)}>✕</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table> */}
            </Card.Body>

            <Card.Footer className="text-end">
              <strong>
                Tổng cộng:{' '}
                <span className="text-danger" data-testid="cart-total">
                  {/* TODO 9: Hiển thị cartTotal.toLocaleString('vi-VN') + 'đ' */}
                  0đ
                </span>
              </strong>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
