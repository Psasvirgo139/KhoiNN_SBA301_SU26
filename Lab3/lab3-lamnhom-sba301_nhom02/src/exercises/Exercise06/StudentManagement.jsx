import { useState } from 'react';
import {
  Container, Row, Col, Table, Button, Badge, Form,
  Modal, Alert, InputGroup,
} from 'react-bootstrap';
import { initialStudents, classNames, statusOptions } from '../../data/students';

const EMPTY_FORM = { name: '', studentId: '', className: 'SE1701', gpa: '', status: 'Đang học' };

export default function StudentManagement() {
  // TODO 1: Khai báo state `students` với giá trị khởi tạo là initialStudents

  // TODO 2: Khai báo state `showModal` với giá trị khởi tạo là false

  // TODO 3: Khai báo state `editingId` với giá trị khởi tạo là null
  //         (null = đang thêm mới, có giá trị = đang sửa)

  // TODO 4: Khai báo state `formData` với giá trị khởi tạo là EMPTY_FORM

  // TODO 5: Khai báo state `filterClass` với giá trị khởi tạo là 'Tất cả'

  // TODO 6: Khai báo state `formError` với giá trị khởi tạo là ''

  // TODO 7: Khai báo hàm `openAddModal()`:
  //         - Đặt editingId = null, formData = EMPTY_FORM, formError = '', showModal = true

  // TODO 8: Khai báo hàm `openEditModal(student)`:
  //         - Đặt editingId = student.id
  //         - Đặt formData = { name, studentId, className, gpa, status } từ student
  //         - Đặt formError = '', showModal = true

  // TODO 9: Khai báo hàm `handleSave()`:
  //         - Kiểm tra: name, studentId, gpa không được rỗng
  //         - GPA phải là số từ 0.0 đến 4.0 — nếu sai đặt formError và return
  //         - Nếu editingId === null: thêm sinh viên mới với id = Date.now()
  //         - Nếu editingId có giá trị: cập nhật sinh viên có id = editingId
  //         - Đóng modal (showModal = false)

  // TODO 10: Khai báo hàm `deleteStudent(id)`:
  //          - Hiện window.confirm('Bạn có chắc muốn xóa sinh viên này?')
  //          - Nếu đồng ý: lọc bỏ student có id khỏi mảng students

  // TODO 11: Tính biến `filteredStudents`:
  //          - Nếu filterClass === 'Tất cả': trả về toàn bộ students
  //          - Ngược lại: lọc students có className === filterClass

  const gpaColor = (gpa) => {
    if (gpa >= 3.6) return 'success';
    if (gpa >= 3.0) return 'primary';
    if (gpa >= 2.0) return 'warning';
    return 'danger';
  };

  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">🎓 Quản Lý Sinh Viên</h4>
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            data-testid="add-student-btn"
            onClick={/* TODO: gọi openAddModal */undefined}
          >
            + Thêm sinh viên
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Select
            value={/* TODO: bind filterClass */undefined}
            onChange={/* TODO: cập nhật filterClass */undefined}
            data-testid="filter-class"
          >
            {classNames.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs="auto" className="align-self-center">
          <Badge bg="secondary" data-testid="student-count">
            {/* TODO: Hiển thị số sinh viên đang hiển thị */}
            0 sinh viên
          </Badge>
        </Col>
      </Row>

      <Table striped bordered hover responsive data-testid="student-table">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Họ Tên</th>
            <th>MSSV</th>
            <th>Lớp</th>
            <th>GPA</th>
            <th>Trạng Thái</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {/* TODO 12: Render danh sách filteredStudents:
                      Mỗi hàng là <tr key={s.id} data-testid={`student-row-${s.id}`}>
                        <td>{index + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.studentId}</td>
                        <td>{s.className}</td>
                        <td><Badge bg={gpaColor(s.gpa)}>{s.gpa}</Badge></td>
                        <td>{s.status}</td>
                        <td>
                          <Button size="sm" variant="outline-warning" className="me-1"
                            data-testid={`edit-btn-${s.id}`}
                            onClick={() => openEditModal(s)}>Sửa</Button>
                          <Button size="sm" variant="outline-danger"
                            data-testid={`delete-btn-${s.id}`}
                            onClick={() => deleteStudent(s.id)}>Xóa</Button>
                        </td>
                      </tr> */}
        </tbody>
      </Table>

      {/* Modal Thêm / Sửa Sinh Viên */}
      <Modal
        show={/* TODO: bind showModal */false}
        onHide={() => {/* TODO: đặt showModal = false */}}
        data-testid="student-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {/* TODO 13: Hiển thị "Thêm Sinh Viên" nếu editingId === null, ngược lại "Sửa Sinh Viên" */}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* TODO 14: Nếu formError không rỗng, hiển thị <Alert variant="danger">{formError}</Alert> */}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Họ Tên</Form.Label>
              <Form.Control
                name="name"
                value={/* TODO: bind formData.name */undefined}
                onChange={/* TODO: cập nhật formData */undefined}
                data-testid="modal-name-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>MSSV</Form.Label>
              <Form.Control
                name="studentId"
                value={/* TODO */undefined}
                onChange={/* TODO */undefined}
                data-testid="modal-studentid-input"
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Lớp</Form.Label>
                  <Form.Select
                    name="className"
                    value={/* TODO */undefined}
                    onChange={/* TODO */undefined}
                    data-testid="modal-class-select"
                  >
                    {classNames.filter((c) => c !== 'Tất cả').map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>GPA</Form.Label>
                  <Form.Control
                    name="gpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={/* TODO */undefined}
                    onChange={/* TODO */undefined}
                    data-testid="modal-gpa-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Trạng Thái</Form.Label>
              <Form.Select
                name="status"
                value={/* TODO */undefined}
                onChange={/* TODO */undefined}
                data-testid="modal-status-select"
              >
                {statusOptions.map((s) => <option key={s}>{s}</option>)}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => {/* TODO: đặt showModal = false */}}>
            Hủy
          </Button>
          <Button
            variant="primary"
            data-testid="save-student-btn"
            onClick={/* TODO 15: gọi handleSave */undefined}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
