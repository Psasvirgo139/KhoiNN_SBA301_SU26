import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const EMPTY_FORM = { name: '', email: '', phone: '', age: '' };
const EMPTY_ERRORS = { name: '', email: '', phone: '', age: '' };

export default function RegistrationForm() {
  // TODO 1: Khai báo state `formData` với giá trị khởi tạo là EMPTY_FORM

  // TODO 2: Khai báo state `errors` với giá trị khởi tạo là EMPTY_ERRORS

  // TODO 3: Khai báo state `submitted` với giá trị khởi tạo là false

  // TODO 4: Khai báo hàm `handleChange(e)`:
  //         - Cập nhật formData với field tương ứng e.target.name và giá trị e.target.value
  //         - Xóa lỗi của field đó trong errors (đặt về '')

  // TODO 5: Khai báo hàm `validate()`:
  //         - Kiểm tra từng field và trả về object newErrors:
  //           + name: bắt buộc, ít nhất 2 ký tự
  //           + email: bắt buộc, phải chứa '@' và '.'
  //           + phone: bắt buộc, chỉ gồm chữ số, dài 10 ký tự
  //           + age: bắt buộc, là số, từ 16 đến 60
  //         - Trả về newErrors

  // TODO 6: Khai báo hàm `handleSubmit(e)`:
  //         - Gọi e.preventDefault()
  //         - Gọi validate() để lấy newErrors
  //         - Cập nhật state errors = newErrors
  //         - Nếu tất cả các giá trị trong newErrors đều rỗng (''), đặt submitted = true

  // TODO 7: Khai báo hàm `handleReset()`:
  //         - Reset formData về EMPTY_FORM
  //         - Reset errors về EMPTY_ERRORS
  //         - Reset submitted về false

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={7} lg={6}>

          {/* TODO 8: Nếu submitted === true, hiển thị:
                      <Alert variant="success" data-testid="success-message">
                        Đăng ký thành công! Chào mừng {formData.name}.
                        <Button variant="link" onClick={handleReset}>Đăng ký tài khoản khác</Button>
                      </Alert> */}

          {/* TODO 9: Nếu submitted === false, hiển thị form dưới đây */}
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">📋 Form Đăng Ký</h5>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={/* TODO: gọi handleSubmit */undefined} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và Tên <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="Nhập họ và tên"
                    value={/* TODO: bind formData.name */undefined}
                    onChange={/* TODO: gọi handleChange */undefined}
                    isInvalid={/* TODO: errors.name không rỗng */false}
                    data-testid="name-input"
                  />
                  {/* TODO 10: Form.Control.Feedback type="invalid" data-testid="name-error" hiển thị errors.name */}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={/* TODO */undefined}
                    onChange={/* TODO */undefined}
                    isInvalid={/* TODO */false}
                    data-testid="email-input"
                  />
                  {/* TODO: Form.Control.Feedback type="invalid" data-testid="email-error" */}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số Điện Thoại <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="phone"
                    placeholder="0xxxxxxxxx"
                    value={/* TODO */undefined}
                    onChange={/* TODO */undefined}
                    isInvalid={/* TODO */false}
                    data-testid="phone-input"
                  />
                  {/* TODO: Form.Control.Feedback type="invalid" data-testid="phone-error" */}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Tuổi <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="age"
                    type="number"
                    placeholder="16–60"
                    value={/* TODO */undefined}
                    onChange={/* TODO */undefined}
                    isInvalid={/* TODO */false}
                    data-testid="age-input"
                  />
                  {/* TODO: Form.Control.Feedback type="invalid" data-testid="age-error" */}
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="success" data-testid="submit-btn">
                    Đăng Ký
                  </Button>
                  <Button type="button" variant="outline-secondary" onClick={/* TODO */undefined}>
                    Làm Lại
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
