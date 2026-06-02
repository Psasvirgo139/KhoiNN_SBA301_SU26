/**
 * Tests – Bài 4: Shopping Cart (useReducer)
 * ===========================================
 * Chạy: npm test -- Ex04
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Ex04_ShoppingCart from '../pages/Ex04_ShoppingCart'

describe('Bài 4 – Shopping Cart', () => {

  describe('✅ Task 1+3 – Render ban đầu', () => {
    it('item-count = 0 ban đầu', () => {
      render(<Ex04_ShoppingCart />)
      expect(screen.getByTestId('item-count')).toHaveTextContent('0')
    })

    it('cart-total hiển thị 0', () => {
      render(<Ex04_ShoppingCart />)
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
    })
  })

  describe('✅ Task 2+6 – ADD_ITEM', () => {
    it('thêm sản phẩm 1 vào giỏ', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-1'))
      expect(screen.getByTestId('cart-row-1')).toBeInTheDocument()
    })

    it('item-count tăng lên 1 sau khi thêm', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-1'))
      expect(screen.getByTestId('item-count')).toHaveTextContent('1')
    })

    it('thêm cùng sản phẩm 2 lần → qty = 2, item-count = 2', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-1'))
      fireEvent.click(screen.getByTestId('btn-add-1'))
      expect(screen.getByTestId('item-count')).toHaveTextContent('2')
      // vẫn chỉ 1 hàng trong bảng
      expect(screen.getAllByTestId(/^cart-row-/).length).toBe(1)
    })

    it('total cập nhật đúng (150000 * 1)', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-1'))
      expect(screen.getByTestId('cart-total').textContent).toMatch(/150/)
    })
  })

  describe('✅ Task 2 – REMOVE_ITEM', () => {
    it('xóa sản phẩm khỏi giỏ', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-2'))
      fireEvent.click(screen.getByTestId('btn-remove-2'))
      expect(screen.queryByTestId('cart-row-2')).not.toBeInTheDocument()
    })

    it('item-count về 0 sau khi xóa', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-2'))
      fireEvent.click(screen.getByTestId('btn-remove-2'))
      expect(screen.getByTestId('item-count')).toHaveTextContent('0')
    })
  })

  describe('✅ Task 2 – UPDATE_QTY', () => {
    it('thay đổi qty cập nhật item-count', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-3'))
      fireEvent.change(screen.getByTestId('qty-input-3'), { target: { value: '4' } })
      expect(screen.getByTestId('item-count')).toHaveTextContent('4')
    })

    it('qty = 0 thì xóa item', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-1'))
      fireEvent.change(screen.getByTestId('qty-input-1'), { target: { value: '0' } })
      expect(screen.queryByTestId('cart-row-1')).not.toBeInTheDocument()
    })
  })

  describe('✅ Task 9 – CLEAR_CART', () => {
    it('xóa toàn bộ giỏ hàng', () => {
      render(<Ex04_ShoppingCart />)
      fireEvent.click(screen.getByTestId('btn-add-1'))
      fireEvent.click(screen.getByTestId('btn-add-2'))
      fireEvent.click(screen.getByTestId('btn-clear-cart'))
      expect(screen.getByTestId('item-count')).toHaveTextContent('0')
      expect(screen.queryAllByTestId(/^cart-row-/).length).toBe(0)
    })
  })
})
