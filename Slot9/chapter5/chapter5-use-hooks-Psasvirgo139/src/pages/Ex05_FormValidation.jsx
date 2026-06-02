/**
 * Bài 5 – Form Validation (useReducer)
 * ======================================
 * Mục tiêu: Quản lý form state phức tạp (values, errors, touched, submitted)
 *           bằng useReducer.
 *
 * Chạy test: npm test -- Ex05
 */
import { useReducer } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
//   {
//     values:    { name: '', email: '', password: '', confirm: '' },
//     errors:    {},      // { fieldName: 'thông báo lỗi' }
//     touched:   {},      // { fieldName: true/false }
//     submitted: false,
//   }
// ─────────────────────────────────────────────
const initialState = {
  values: { name: '', email: '', password: '', confirm: '' },
  errors: {},
  touched: {},
  submitted: false
}

// ─────────────────────────────────────────────
// TODO 2: Viết hàm validate(values)
//   Trả về object errors (rỗng = hợp lệ).
//   Quy tắc:
//   - name:     không được rỗng
//   - email:    phải chứa '@'
//   - password: ít nhất 6 ký tự
//   - confirm:  phải bằng values.password
// ─────────────────────────────────────────────
function validate(values) {
  const errors = {}
  if (!values.name || values.name.trim() === '') {
    errors.name = 'Họ tên không được để trống'
  }
  if (!values.email || !values.email.includes('@')) {
    errors.email = 'Email không hợp lệ'
  }
  if (!values.password || values.password.length < 6) {
    errors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự'
  }
  if (values.confirm !== values.password) {
    errors.confirm = 'Mật khẩu xác nhận không khớp'
  }
  return errors
}

// ─────────────────────────────────────────────
// TODO 3: Viết reducer(state, action)
//
//   Case 'SET_FIELD':
//     - action.payload = { field, value }  (field là tên trường, vd 'name')
//     - Cập nhật values[field] = value
//     - Đánh dấu touched[field] = true
//     - Tính lại errors bằng validate() với values MỚI
//     (Dùng computed property name: { ...state.values, [action.payload.field]: action.payload.value })
//
//   Case 'SUBMIT':
//     - Tính lại errors
//     - Đánh dấu tất cả touched = { name: true, email: true, password: true, confirm: true }
//     - submitted = true nếu Object.keys(errors).length === 0
//
//   Case 'RESET':
//     - Trả về initialState
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      const { field, value } = action.payload
      const newValues = { ...state.values, [field]: value }
      const newTouched = { ...state.touched, [field]: true }
      const newErrors = validate(newValues)
      return {
        ...state,
        values: newValues,
        touched: newTouched,
        errors: newErrors
      }
    }
    case 'SUBMIT': {
      const errors = validate(state.values)
      const touched = { name: true, email: true, password: true, confirm: true }
      const submitted = Object.keys(errors).length === 0
      return {
        ...state,
        errors,
        touched,
        submitted
      }
    }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function Ex05_FormValidation() {
  // TODO 4: Gọi useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, initialState)

  // Helper: trả về thông báo lỗi nếu field đã được touch
  // TODO 5: Hoàn thiện hàm getError
  function getError(field) {
    return state.touched[field] ? state.errors[field] : undefined
  }

  // ─────────────────────────────────────────────
  // TODO 6: Viết hàm handleChange(e)
  //   - Lấy { name, value } từ e.target
  //   - dispatch({ type: 'SET_FIELD', payload: { field: name, value } })
  // ─────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD', payload: { field: name, value } })
  }

  // ─────────────────────────────────────────────
  // TODO 7: Viết hàm handleSubmit(e)
  //   - e.preventDefault()
  //   - dispatch({ type: 'SUBMIT' })
  // ─────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'SUBMIT' })
  }

  return (
    <Card className="mx-auto shadow border-0 rounded-4 overflow-hidden" style={{ maxWidth: 480 }}>
      <Card.Header className="bg-dark text-white text-center py-3">
        <strong className="fs-5">Bài 5 – Form Validation</strong>
      </Card.Header>
      <Card.Body className="p-4 bg-white">

        {/* Thông báo thành công */}
        {state.submitted && (
          <Alert variant="success" className="border-0 shadow-sm mb-4" data-testid="form-success">
            Đăng ký thành công!
          </Alert>
        )}

        {/* TODO 8: Gắn handleSubmit vào onSubmit */}
        <Form onSubmit={handleSubmit} data-testid="register-form" noValidate>

          {/* Trường name */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-muted">Họ tên</Form.Label>
            {/* TODO 9: value, name="name", onChange=handleChange */}
            <Form.Control
              data-testid="input-name"
              name="name"
              placeholder="Họ và tên"
              value={state.values.name}
              onChange={handleChange}
              isInvalid={!!getError('name')}
              className="shadow-sm py-2"
            />
            <Form.Control.Feedback type="invalid" data-testid="error-name" className="fw-semibold text-danger">
              {getError('name')}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Trường email */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-muted">Email</Form.Label>
            {/* TODO 10: value, name="email", onChange=handleChange */}
            <Form.Control
              type="email"
              data-testid="input-email"
              name="email"
              placeholder="email@example.com"
              value={state.values.email}
              onChange={handleChange}
              isInvalid={!!getError('email')}
              className="shadow-sm py-2"
            />
            <Form.Control.Feedback type="invalid" data-testid="error-email" className="fw-semibold text-danger">
              {getError('email')}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Trường password */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-muted">Mật khẩu</Form.Label>
            {/* TODO 11: value, name="password", onChange=handleChange */}
            <Form.Control
              type="password"
              data-testid="input-password"
              name="password"
              placeholder="Tối thiểu 6 ký tự"
              value={state.values.password}
              onChange={handleChange}
              isInvalid={!!getError('password')}
              className="shadow-sm py-2"
            />
            <Form.Control.Feedback type="invalid" data-testid="error-password" className="fw-semibold text-danger">
              {getError('password')}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Trường confirm */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-muted">Xác nhận mật khẩu</Form.Label>
            {/* TODO 12: value, name="confirm", onChange=handleChange */}
            <Form.Control
              type="password"
              data-testid="input-confirm"
              name="confirm"
              placeholder="Nhập lại mật khẩu"
              value={state.values.confirm}
              onChange={handleChange}
              isInvalid={!!getError('confirm')}
              className="shadow-sm py-2"
            />
            <Form.Control.Feedback type="invalid" data-testid="error-confirm" className="fw-semibold text-danger">
              {getError('confirm')}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            {/* TODO 13: Nút submit */}
            <Button type="submit" variant="primary" className="px-4 py-2 shadow-sm fw-semibold" data-testid="btn-submit">
              Đăng ký
            </Button>
            {/* TODO 14: onClick dispatch RESET */}
            <Button type="button" variant="secondary" className="px-4 py-2 shadow-sm fw-semibold" data-testid="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>
              Reset
            </Button>
          </div>

        </Form>
      </Card.Body>
    </Card>
  )
}
