import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, InputGroup, Alert } from 'react-bootstrap';

export default function TodoList() {
  // TODO 1: Khai báo state `todos` là mảng rỗng []
  //         Mỗi todo có cấu trúc: { id: number, text: string, completed: boolean }

  // TODO 2: Khai báo state `inputValue` là chuỗi rỗng ''

  // TODO 3: Khai báo hàm `addTodo`:
  //         - Nếu inputValue rỗng (sau trim) thì return sớm
  //         - Thêm todo mới vào mảng: { id: Date.now(), text: inputValue.trim(), completed: false }
  //         - Reset inputValue về ''

  // TODO 4: Khai báo hàm `toggleTodo(id)`:
  //         - Tìm todo có id tương ứng và đảo ngược trạng thái completed của nó
  //         - Cập nhật lại state todos

  // TODO 5: Khai báo hàm `deleteTodo(id)`:
  //         - Lọc bỏ todo có id khỏi mảng todos
  //         - Cập nhật lại state todos

  // TODO 6: Tính biến `completedCount` = số todo có completed === true
  // TODO 7: Tính biến `pendingCount` = số todo có completed === false

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">📝 Danh Sách Công Việc</h5>
            </Card.Header>

            <Card.Body>
              <InputGroup className="mb-3">
                {/* TODO 8: Form.Control với:
                            - placeholder="Nhập công việc mới..."
                            - value bind với inputValue
                            - onChange cập nhật inputValue
                            - onKeyDown: gọi addTodo khi nhấn phím Enter (e.key === 'Enter')
                            - data-testid="todo-input" */}

                {/* TODO 9: Button variant="primary", onClick gọi addTodo, data-testid="add-btn", label "Thêm" */}
              </InputGroup>

              <div className="d-flex gap-2 mb-3 flex-wrap">
                <Badge bg="primary" data-testid="total-count">
                  {/* TODO 10: Hiển thị tổng số todo */}
                  Tổng: 0
                </Badge>
                <Badge bg="success" data-testid="completed-count">
                  {/* TODO 10: Hiển thị số todo đã hoàn thành */}
                  Hoàn thành: 0
                </Badge>
                <Badge bg="warning" text="dark" data-testid="pending-count">
                  {/* TODO 10: Hiển thị số todo chưa xong */}
                  Chưa xong: 0
                </Badge>
              </div>

              {/* TODO 11: Nếu todos rỗng, hiển thị:
                          <Alert variant="info" data-testid="empty-message">
                            Chưa có công việc nào! Hãy thêm việc mới.
                          </Alert> */}

              <ListGroup>
                {/* TODO 12: Render danh sách todos, mỗi phần tử là một ListGroup.Item:
                            <ListGroup.Item
                              key={todo.id}
                              data-testid={`todo-item-${todo.id}`}
                              className="d-flex align-items-center gap-2"
                            >
                              - Form.Check (checkbox) checked={todo.completed}
                                onChange gọi toggleTodo(todo.id)
                                data-testid={`toggle-${todo.id}`}
                              - <span> hiển thị todo.text
                                nếu todo.completed thêm style={{ textDecoration: 'line-through', color: '#aaa' }}
                              - Button variant="outline-danger" size="sm" ms-auto
                                onClick gọi deleteTodo(todo.id)
                                data-testid={`delete-btn-${todo.id}`}
                                label "Xóa"
                            </ListGroup.Item> */}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
