/**
 * Bài 3 – Todo List (useReducer)
 * ================================
 * Mục tiêu: Quản lý danh sách công việc với useReducer.
 *
 * Chạy test: npm test -- Ex03
 */
import { useReducer, useState } from 'react'
import { Card, Form, Button, ListGroup, Badge, ButtonGroup } from 'react-bootstrap'

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
//   - Là mảng rỗng []
//   (mỗi todo: { id, text, done })
// ─────────────────────────────────────────────
const initialState = []

// ─────────────────────────────────────────────
// TODO 2: Viết reducer(state, action)
//
//   Case 'ADD_TODO':
//     - action.payload = { id: Date.now(), text: '...', done: false }
//     - Trả về [...state, action.payload]
//
//   Case 'TOGGLE_TODO':
//     - action.payload = id của todo cần toggle
//     - Dùng .map() để đảo done của todo có id khớp
//
//   Case 'DELETE_TODO':
//     - action.payload = id của todo cần xóa
//     - Dùng .filter() để loại bỏ
//
//   Case 'CLEAR_DONE':
//     - Xóa tất cả todo có done = true
//     - Dùng .filter(t => !t.done)
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload]
    case 'TOGGLE_TODO':
      return state.map(todo => todo.id === action.payload ? { ...todo, done: !todo.done } : todo)
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload)
    case 'CLEAR_DONE':
      return state.filter(todo => !todo.done)
    default:
      return state
  }
}

export default function Ex03_TodoList() {
  // TODO 3: Gọi useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, initialState)

  // Input text (dùng useState riêng – đây là UI state, không phải app state)
  const [text, setText] = useState('')

  // ─────────────────────────────────────────────
  // TODO 4: Viết hàm handleAdd()
  //   - Nếu text.trim() rỗng thì return (không làm gì)
  //   - dispatch ADD_TODO với payload { id: Date.now(), text: text.trim(), done: false }
  //   - setText('') để xóa input
  // ─────────────────────────────────────────────
  function handleAdd() {
    if (!text.trim()) return
    dispatch({
      type: 'ADD_TODO',
      payload: { id: Date.now(), text: text.trim(), done: false }
    })
    setText('')
  }

  // Derived state: đếm số todo chưa xong
  // TODO 5: Tính pendingCount = state.filter(t => !t.done).length
  const pendingCount = state.filter(t => !t.done).length

  return (
    <Card className="mx-auto shadow border-0 rounded-4 overflow-hidden" style={{ maxWidth: 500 }}>
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <strong className="fs-5">Bài 3 – Todo List</strong>
        <div className="d-flex align-items-center gap-2">
          {/* TODO 6: Hiển thị pendingCount trong Badge */}
          <Badge bg="primary" className="px-3 py-2 fs-6 rounded-pill" data-testid="pending-count">
            {pendingCount}
          </Badge>
          <span className="small text-light">việc chưa xong</span>
        </div>
      </Card.Header>
      <Card.Body className="p-4 bg-light">

        {/* Form thêm todo */}
        <div className="d-flex gap-2 mb-4">
          <Form.Control
            data-testid="todo-input"
            placeholder="Nhập công việc..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="shadow-sm py-2"
          />
          {/* TODO 7: onClick gọi handleAdd */}
          <Button variant="primary" className="px-4 shadow-sm fw-semibold" data-testid="btn-add-todo" onClick={handleAdd}>
            Thêm
          </Button>
        </div>

        {/* Danh sách todo */}
        {/* TODO 8: Render state.map(todo => ...) */}
        <ListGroup data-testid="todo-list" className="mb-4 shadow-sm rounded-3 overflow-hidden">
          {state.map(todo => (
            <ListGroup.Item
              key={todo.id}
              data-testid={`todo-item-${todo.id}`}
              className="d-flex justify-content-between align-items-center border-0 border-bottom py-3 bg-white"
            >
              <span
                style={{
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? '#6c757d' : '#212529',
                  fontWeight: todo.done ? 'normal' : '500'
                }}
                className="fs-6 text-truncate pe-3"
              >
                {todo.text}
              </span>
              <ButtonGroup size="sm" className="shadow-sm">
                {/* nút Toggle: data-testid={`btn-toggle-${todo.id}`}, dispatch TOGGLE_TODO */}
                <Button
                  variant={todo.done ? "outline-secondary" : "outline-success"}
                  className="fw-semibold px-3"
                  data-testid={`btn-toggle-${todo.id}`}
                  onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                >
                  {todo.done ? 'Chưa xong' : 'Xong'}
                </Button>
                {/* nút Delete: data-testid={`btn-delete-${todo.id}`}, dispatch DELETE_TODO */}
                <Button
                  variant="outline-danger"
                  className="fw-semibold px-3"
                  data-testid={`btn-delete-${todo.id}`}
                  onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                >
                  Xóa
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Nút xóa tất cả đã xong */}
        {/* TODO 9: onClick dispatch CLEAR_DONE */}
        <div className="text-end">
          <Button
            variant="outline-danger"
            size="sm"
            className="fw-semibold px-3 shadow-sm"
            data-testid="btn-clear-done"
            onClick={() => dispatch({ type: 'CLEAR_DONE' })}
          >
            Xóa việc đã xong
          </Button>
        </div>

      </Card.Body>
    </Card>
  )
}
