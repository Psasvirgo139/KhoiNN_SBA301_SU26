/**
 * Tests – Bài 1: Basic Counter (useReducer)
 * ==========================================
 * Chạy: npm test -- Ex01
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Ex01_BasicCounter from '../pages/Ex01_BasicCounter'

describe('Bài 1 – Basic Counter', () => {

  describe('✅ Task 1+3 – Render ban đầu', () => {
    it('hiển thị count = 0 khi mới khởi tạo', () => {
      render(<Ex01_BasicCounter />)
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })

    it('có đủ 3 nút: decrement, reset, increment', () => {
      render(<Ex01_BasicCounter />)
      expect(screen.getByTestId('btn-decrement')).toBeInTheDocument()
      expect(screen.getByTestId('btn-reset')).toBeInTheDocument()
      expect(screen.getByTestId('btn-increment')).toBeInTheDocument()
    })
  })

  describe('✅ Task 2+7 – INCREMENT', () => {
    it('tăng count lên 1 khi nhấn +', () => {
      render(<Ex01_BasicCounter />)
      fireEvent.click(screen.getByTestId('btn-increment'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('1')
    })

    it('tăng nhiều lần', () => {
      render(<Ex01_BasicCounter />)
      fireEvent.click(screen.getByTestId('btn-increment'))
      fireEvent.click(screen.getByTestId('btn-increment'))
      fireEvent.click(screen.getByTestId('btn-increment'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('3')
    })
  })

  describe('✅ Task 2+5 – DECREMENT', () => {
    it('giảm count xuống 1 khi nhấn −', () => {
      render(<Ex01_BasicCounter />)
      fireEvent.click(screen.getByTestId('btn-decrement'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('-1')
    })

    it('count có thể âm', () => {
      render(<Ex01_BasicCounter />)
      fireEvent.click(screen.getByTestId('btn-decrement'))
      fireEvent.click(screen.getByTestId('btn-decrement'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('-2')
    })
  })

  describe('✅ Task 2+6 – RESET', () => {
    it('reset về 0 sau khi tăng', () => {
      render(<Ex01_BasicCounter />)
      fireEvent.click(screen.getByTestId('btn-increment'))
      fireEvent.click(screen.getByTestId('btn-increment'))
      fireEvent.click(screen.getByTestId('btn-reset'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })

    it('reset về 0 sau khi giảm', () => {
      render(<Ex01_BasicCounter />)
      fireEvent.click(screen.getByTestId('btn-decrement'))
      fireEvent.click(screen.getByTestId('btn-reset'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })
  })

  describe('✅ Task 4 – Hiển thị đúng giá trị', () => {
    it('tăng 5 lần rồi giảm 2 lần → kết quả 3', () => {
      render(<Ex01_BasicCounter />)
      for (let i = 0; i < 5; i++) fireEvent.click(screen.getByTestId('btn-increment'))
      for (let i = 0; i < 2; i++) fireEvent.click(screen.getByTestId('btn-decrement'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('3')
    })
  })
})
