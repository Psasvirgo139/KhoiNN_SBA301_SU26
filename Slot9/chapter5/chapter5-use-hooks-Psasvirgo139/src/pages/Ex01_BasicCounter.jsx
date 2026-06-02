/**
 * Bài 1 – Basic Counter (useReducer)
 * ====================================
 * Mục tiêu: Tạo counter với useReducer thay vì useState.
 *
 * Chạy test: npm test -- Ex01
 */
import { useReducer } from 'react'
import { Card, Button, ButtonGroup } from 'react-bootstrap'

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
//   - Là một object có 1 trường: count = 0
// ─────────────────────────────────────────────
const initialState = { count: 0 }

// ─────────────────────────────────────────────
// TODO 2: Viết hàm reducer(state, action)
//   - Case 'INCREMENT': trả về state mới với count + 1
//   - Case 'DECREMENT': trả về state mới với count - 1
//   - Case 'RESET':     trả về initialState
//   - Default:          trả về state hiện tại
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 }
    case 'DECREMENT':
      return { ...state, count: state.count - 1 }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export default function Ex01_BasicCounter() {
  // TODO 3: Gọi useReducer với reducer và initialState
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Card className="mx-auto shadow border-0 rounded-4 overflow-hidden" style={{ maxWidth: 400 }}>
      <Card.Header className="bg-dark text-white text-center py-3">
        <strong className="fs-5">Bài 1 – Basic Counter</strong>
      </Card.Header>
      <Card.Body className="text-center py-5 bg-white">

        {/* TODO 4: Hiển thị state.count bên trong thẻ có data-testid="count-display" */}
        <h1 className="display-1 fw-bold text-primary mb-4" data-testid="count-display">{state.count}</h1>

        <ButtonGroup className="mt-2 shadow-sm">
          {/* TODO 5: onClick gọi dispatch({ type: 'DECREMENT' }) */}
          <Button variant="outline-danger" className="px-4 py-2 fw-bold" data-testid="btn-decrement" onClick={() => dispatch({ type: 'DECREMENT' })}>−</Button>

          {/* TODO 6: onClick gọi dispatch({ type: 'RESET' }) */}
          <Button variant="outline-secondary" className="px-4 py-2 fw-semibold" data-testid="btn-reset" onClick={() => dispatch({ type: 'RESET' })}>Reset</Button>

          {/* TODO 7: onClick gọi dispatch({ type: 'INCREMENT' }) */}
          <Button variant="outline-success" className="px-4 py-2 fw-bold" data-testid="btn-increment" onClick={() => dispatch({ type: 'INCREMENT' })}>+</Button>
        </ButtonGroup>

      </Card.Body>
    </Card>
  )
}

