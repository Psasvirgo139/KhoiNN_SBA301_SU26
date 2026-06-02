/**
 * Bài 4 – Shopping Cart (useReducer)
 * =====================================
 * Mục tiêu: Giỏ hàng với thêm / xóa / thay đổi số lượng / xóa toàn bộ.
 *
 * Chạy test: npm test -- Ex04
 */
import { useReducer } from 'react'
import { Card, Button, Table, Badge, Row, Col, Form } from 'react-bootstrap'

// Danh sách sản phẩm mẫu (không cần sửa)
const PRODUCTS = [
  { id: 1, name: 'Áo thun',   price: 150_000 },
  { id: 2, name: 'Quần jean', price: 350_000 },
  { id: 3, name: 'Giày vải',  price: 280_000 },
]

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
//   { items: [] }
//   (mỗi item: { id, name, price, qty })
// ─────────────────────────────────────────────
const initialState = { items: [] }

// ─────────────────────────────────────────────
// TODO 2: Viết reducer(state, action)
//
//   Case 'ADD_ITEM':
//     - action.payload = product { id, name, price }
//     - Nếu sản phẩm đã có trong items → tăng qty lên 1
//       (dùng .map() để cập nhật phần tử khớp id)
//     - Nếu chưa có → thêm { ...product, qty: 1 } vào items
//
//   Case 'REMOVE_ITEM':
//     - action.payload = id sản phẩm
//     - Lọc bỏ item có id khớp
//
//   Case 'UPDATE_QTY':
//     - action.payload = { id, qty } (qty là số mới)
//     - Nếu qty <= 0 thì xóa item đó (tương tự REMOVE_ITEM)
//     - Nếu qty > 0  thì cập nhật qty
//
//   Case 'CLEAR_CART':
//     - Trả về initialState
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload
      const exist = state.items.find(item => item.id === product.id)
      if (exist) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        }
      }
      return {
        ...state,
        items: [...state.items, { ...product, qty: 1 }]
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
    case 'UPDATE_QTY': {
      const { id, qty } = action.payload
      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        }
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, qty } : item
        )
      }
    }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

export default function Ex04_ShoppingCart() {
  // TODO 3: Gọi useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, initialState)

  // ─────────────────────────────────────────────
  // TODO 4: Tính derived state
  //   total     = tổng (item.price * item.qty) của tất cả items
  //   itemCount = tổng qty của tất cả items
  // ─────────────────────────────────────────────
  const total     = state.items.reduce((acc, item) => acc + item.price * item.qty, 0)
  const itemCount = state.items.reduce((acc, item) => acc + item.qty, 0)

  return (
    <Card className="mx-auto shadow border-0 rounded-4 overflow-hidden" style={{ maxWidth: 650 }}>
      <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <strong className="fs-5">Bài 4 – Shopping Cart</strong>
        {/* TODO 5: Hiển thị itemCount */}
        <Badge bg="danger" className="px-3 py-2 fs-6 rounded-pill" data-testid="item-count">
          {itemCount}
        </Badge>
      </Card.Header>
      <Card.Body className="p-4 bg-white">

        {/* Danh sách sản phẩm */}
        <h6 className="fw-bold text-muted mb-3">Sản phẩm</h6>
        <Row className="mb-4">
          {PRODUCTS.map(p => (
            <Col key={p.id} xs={4}>
              <Card className="border border-light shadow-sm h-100 rounded-3">
                <Card.Body className="p-3 text-center d-flex flex-column justify-content-between">
                  <div>
                    <div className="fw-bold text-dark fs-6">{p.name}</div>
                    <div className="text-primary small fw-semibold mt-1">{p.price.toLocaleString()}đ</div>
                  </div>
                  {/* TODO 6: onClick dispatch ADD_ITEM với payload = p */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2 w-100 fw-semibold"
                    data-testid={`btn-add-${p.id}`}
                    onClick={() => dispatch({ type: 'ADD_ITEM', payload: p })}
                  >
                    + Thêm
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Bảng giỏ hàng */}
        <h6 className="fw-bold text-muted mb-3">Giỏ hàng</h6>
        <div className="table-responsive rounded-3 border mb-4">
          <Table size="sm" hover className="align-middle mb-0" data-testid="cart-table">
            <thead className="table-light text-secondary">
              <tr>
                <th className="py-2 px-3">Sản phẩm</th>
                <th className="py-2 text-end">Đơn giá</th>
                <th className="py-2 text-center" style={{ width: 100 }}>Số lượng</th>
                <th className="py-2 text-end">Thành tiền</th>
                <th className="py-2 text-center" style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {/* TODO 7: Render state.items.map(item => ...) */}
              {state.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    Giỏ hàng chưa có sản phẩm nào
                  </td>
                </tr>
              ) : (
                state.items.map(item => (
                  <tr key={item.id} data-testid={`cart-row-${item.id}`}>
                    <td className="py-3 px-3 fw-semibold text-dark">{item.name}</td>
                    <td className="py-3 text-end">{item.price.toLocaleString()}đ</td>
                    <td className="py-3 text-center">
                      <Form.Control
                        type="number"
                        min={0}
                        value={item.qty}
                        data-testid={`qty-input-${item.id}`}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_QTY',
                          payload: { id: item.id, qty: Number(e.target.value) }
                        })}
                        className="text-center shadow-sm py-1 mx-auto"
                        style={{ width: 70 }}
                      />
                    </td>
                    <td className="py-3 text-end fw-bold text-primary">
                      {(item.price * item.qty).toLocaleString()}đ
                    </td>
                    <td className="py-3 text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="border-0 text-danger fw-semibold"
                        data-testid={`btn-remove-${item.id}`}
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Tổng tiền + Clear */}
        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 border">
          {/* TODO 8: Hiển thị total.toLocaleString() */}
          <span className="fs-5 text-dark">
            Tổng cộng: <strong className="text-primary fs-4" data-testid="cart-total">{total.toLocaleString()}đ</strong>
          </span>
          {/* TODO 9: onClick dispatch CLEAR_CART */}
          <Button
            variant="outline-danger"
            size="sm"
            className="fw-semibold px-3 shadow-sm"
            data-testid="btn-clear-cart"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
          >
            Xóa giỏ hàng
          </Button>
        </div>

      </Card.Body>
    </Card>
  )
}
