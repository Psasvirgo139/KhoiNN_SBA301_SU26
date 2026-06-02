/**
 * Bài 2 – Counter với Step & History (useReducer)
 * =================================================
 * Mục tiêu: Mở rộng counter – cho phép thay đổi step,
 *           lưu 10 giá trị lịch sử gần nhất.
 *
 * Chạy test: npm test -- Ex02
 */
import { useReducer } from 'react'
import { Card, Button, ButtonGroup, Form, ListGroup, Badge } from 'react-bootstrap'

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
//   {
//     count:   0,
//     step:    1,
//     history: []   // mảng lưu các giá trị count trước đó
//   }
// ─────────────────────────────────────────────
const initialState = {
  count: 0,
  step: 1,
  history: []
}

// ─────────────────────────────────────────────
// TODO 2: Viết reducer(state, action)
//
//   Case 'INCREMENT':
//     - count mới = count + step
//     - history mới = [...history.slice(-9), count]  ← lưu count CŨ
//     - Trả state mới với count và history đã cập nhật
//
//   Case 'DECREMENT':
//     - Tương tự INCREMENT nhưng count - step
//
//   Case 'RESET':
//     - Trả về initialState
//
//   Case 'SET_STEP':
//     - action.payload là giá trị step mới (Number)
//     - Trả state mới với step = action.payload
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history.slice(-9), state.count]
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - state.step,
        history: [...state.history.slice(-9), state.count]
      }
    case 'RESET':
      return initialState
    case 'SET_STEP':
      return {
        ...state,
        step: action.payload
      }
    default:
      return state
  }
}

export default function Ex02_CounterWithStep() {
  // TODO 3: Gọi useReducer
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Card className="mx-auto shadow border-0 rounded-4 overflow-hidden" style={{ maxWidth: 480 }}>
      <Card.Header className="bg-dark text-white text-center py-3">
        <strong className="fs-5">Bài 2 – Counter với Step & History</strong>
      </Card.Header>
      <Card.Body className="p-4 bg-white">

        {/* Hiển thị count */}
        <div className="text-center mb-4">
          {/* TODO 4: Hiển thị state.count */}
          <h1 className="display-2 fw-bold text-primary mb-0" data-testid="count-display">{state.count}</h1>
        </div>

        {/* Điều chỉnh Step */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold text-muted">Step (bước nhảy)</Form.Label>
          {/* TODO 5: value={state.step}, onChange dispatch SET_STEP với Number(e.target.value) */}
          <Form.Control
            type="number"
            data-testid="step-input"
            min={1}
            value={state.step}
            onChange={(e) => dispatch({ type: 'SET_STEP', payload: Number(e.target.value) })}
            className="shadow-sm py-2"
          />
        </Form.Group>

        {/* Các nút */}
        <ButtonGroup className="w-100 mb-4 shadow-sm">
          {/* TODO 6: dispatch DECREMENT */}
          <Button variant="outline-danger" className="py-2 fw-bold" data-testid="btn-decrement" onClick={() => dispatch({ type: 'DECREMENT' })}>−</Button>
          {/* TODO 7: dispatch RESET */}
          <Button variant="outline-secondary" className="py-2 fw-semibold" data-testid="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>Reset</Button>
          {/* TODO 8: dispatch INCREMENT */}
          <Button variant="outline-success" className="py-2 fw-bold" data-testid="btn-increment" onClick={() => dispatch({ type: 'INCREMENT' })}>+</Button>
        </ButtonGroup>

        {/* Lịch sử */}
        <div>
          <small className="text-muted fw-semibold">Lịch sử (10 gần nhất):</small>
          {/* TODO 9: Render state.history.map(...) bên trong div này
                      Mỗi phần tử dùng <Badge> hoặc <span> có data-testid="history-item" */}
          <div data-testid="history-list" className="mt-2 d-flex flex-wrap gap-2">
            {state.history.map((val, idx) => (
              <Badge key={idx} bg="light" text="dark" className="border px-3 py-2 fs-6 shadow-sm rounded-pill" data-testid="history-item">
                {val}
              </Badge>
            ))}
          </div>
        </div>

      </Card.Body>
    </Card>
  )
}
