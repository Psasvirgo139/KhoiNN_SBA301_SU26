import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Alert, Modal } from 'react-bootstrap'
import { listOfUser } from '../data/userData'

const initialState = {
  values: { username: '', password: '' },
  errors: {},
  isSubmitting: false,
  showSuccessModal: false,
  user: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      const { field, value } = action.payload
      return {
        ...state,
        values: { ...state.values, [field]: value },
        errors: { ...state.errors, [field]: undefined, login: undefined }
      }
    }
    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        errors: {}
      }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        isSubmitting: false,
        showSuccessModal: true,
        user: action.payload,
        errors: {}
      }
    case 'SUBMIT_FAILURE':
      return {
        ...state,
        isSubmitting: false,
        errors: action.payload
      }
    case 'CLOSE_MODAL':
      return {
        ...state,
        showSuccessModal: false
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function Ex06_Login({ onLoginSuccess }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD', payload: { field: name, value } })
  }

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: 'SUBMIT_START' })

    const { username, password } = state.values
    const errors = {}

    if (!username || username.trim() === '') {
      errors.username = 'Tên đăng nhập không được để trống'
    }
    if (!password || password.trim() === '') {
      errors.password = 'Mật khẩu không được để trống'
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SUBMIT_FAILURE', payload: errors })
      return
    }

    // Giả lập độ trễ kết nối (micro-animation loading) để tăng trải nghiệm premium
    setTimeout(() => {
      const matchedUser = listOfUser.find(
        u => u.username === username.trim() && u.password === password
      )

      if (matchedUser) {
        dispatch({ type: 'SUBMIT_SUCCESS', payload: matchedUser })
      } else {
        dispatch({
          type: 'SUBMIT_FAILURE',
          payload: { login: 'Tài khoản hoặc mật khẩu không chính xác!' }
        })
      }
    }, 800)
  }

  function handleContinue() {
    dispatch({ type: 'CLOSE_MODAL' })
    if (onLoginSuccess && state.user) {
      onLoginSuccess(state.user)
    }
    navigate('/')
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        overflowY: 'auto'
      }}
    >
      {/*  <div className="d-flex align-items-center justify-content-center py-4"> */}
      <Card
        className="border-0 shadow-lg p-4 rounded-4 text-white"
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle mb-3 shadow"
              style={{ width: 64, height: 64 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-shield-lock-fill" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="d8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.7 2.878 9.505C5.105 13.13 6.945 13.9 8 13.9c1.055 0 2.895-.77 4.98-2.703 2.09-1.805 3.475-5.028 2.88-9.505a1.54 1.54 0 0 0-1.044-1.263C13.843.825 12.695.56 12 0zm0 8a1.5 1.5 0 0 1 .5 2.915c-.386.198-.825.198-1.213 0A1.5 1.5 0 0 1 8 8" />
              </svg>
            </div>
            <h3 className="fw-bold tracking-wide mb-1">ĐĂNG NHẬP</h3>
            <p className="text-white-50 small">Vui lòng đăng nhập để tiếp tục sử dụng hệ thống</p>
          </div>

          {state.errors.login && (
            <Alert variant="danger" className="border-0 shadow-sm text-center py-2 mb-3">
              {state.errors.login}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} noValidate>
            {/* Username input */}
            <Form.Group className="mb-3">
              <Form.Label className="text-white-50 fw-semibold small">Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Nhập tên đăng nhập (vd: admin)"
                value={state.values.username}
                onChange={handleChange}
                isInvalid={!!state.errors.username}
                disabled={state.isSubmitting}
                className="bg-transparent text-white border-secondary py-2 shadow-none"
                style={{
                  colorScheme: 'dark',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              />
              <Form.Control.Feedback type="invalid" className="fw-semibold text-warning">
                {state.errors.username}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password input */}
            <Form.Group className="mb-4">
              <Form.Label className="text-white-50 fw-semibold small">Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={state.values.password}
                onChange={handleChange}
                isInvalid={!!state.errors.password}
                disabled={state.isSubmitting}
                className="bg-transparent text-white border-secondary py-2 shadow-none"
                style={{
                  colorScheme: 'dark',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              />
              <Form.Control.Feedback type="invalid" className="fw-semibold text-warning">
                {state.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2 fw-semibold shadow border-0"
              disabled={state.isSubmitting}
              style={{
                background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                transition: 'all 0.3s ease'
              }}
            >
              {state.isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Đang xác thực...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <span className="text-white-50 small">Tài khoản mặc định: <strong>admin / 123456</strong></span>
          </div>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal
        show={state.showSuccessModal}
        onHide={handleContinue}
        centered
        backdrop="static"
        keyboard={false}
        style={{ position: 'fixed', zIndex: 9999 }}
      >
        <Modal.Header className="bg-success text-white border-0 py-3">
          <Modal.Title className="fw-bold fs-5 d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            Thành Công
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4 bg-light">
          <h4 className="fw-bold text-success mb-2">Đăng Nhập Thành Công!</h4>
          <p className="text-muted mb-0">
            Chào mừng <strong>{state.user?.fullName}</strong> đã quay trở lại hệ thống.
          </p>
        </Modal.Body>
        <Modal.Footer className="bg-light border-0 justify-content-center pb-3">
          <Button variant="success" className="px-4 py-2 fw-semibold" onClick={handleContinue}>
            Tiếp tục
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
