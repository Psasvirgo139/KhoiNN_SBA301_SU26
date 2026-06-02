/**
 * Tests – Bài 2: Counter với Step & History (useReducer)
 * ========================================================
 * Chạy: npm test -- Ex02
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Ex02_CounterWithStep from '../pages/Ex02_CounterWithStep'

describe('Bài 2 – Counter với Step & History', () => {

  describe('✅ Task 1+3 – Render ban đầu', () => {
    it('count = 0 ban đầu', () => {
      render(<Ex02_CounterWithStep />)
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })

    it('history rỗng ban đầu', () => {
      render(<Ex02_CounterWithStep />)
      expect(screen.getByTestId('history-list').textContent).toBe('')
    })
  })

  describe('✅ Task 2+8 – INCREMENT với step mặc định', () => {
    it('tăng 1 khi step = 1', () => {
      render(<Ex02_CounterWithStep />)
      fireEvent.click(screen.getByTestId('btn-increment'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('1')
    })
  })

  describe('✅ Task 2+5 – SET_STEP', () => {
    it('thay đổi step rồi increment nhảy đúng bước', () => {
      render(<Ex02_CounterWithStep />)
      fireEvent.change(screen.getByTestId('step-input'), { target: { value: '5' } })
      fireEvent.click(screen.getByTestId('btn-increment'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('5')
    })

    it('step 3: tăng 2 lần → 6', () => {
      render(<Ex02_CounterWithStep />)
      fireEvent.change(screen.getByTestId('step-input'), { target: { value: '3' } })
      fireEvent.click(screen.getByTestId('btn-increment'))
      fireEvent.click(screen.getByTestId('btn-increment'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('6')
    })
  })

  describe('✅ Task 2+6 – DECREMENT với step', () => {
    it('giảm đúng bước', () => {
      render(<Ex02_CounterWithStep />)
      fireEvent.change(screen.getByTestId('step-input'), { target: { value: '10' } })
      fireEvent.click(screen.getByTestId('btn-decrement'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('-10')
    })
  })

  describe('✅ Task 2+7 – RESET', () => {
    it('reset về 0', () => {
      render(<Ex02_CounterWithStep />)
      fireEvent.change(screen.getByTestId('step-input'), { target: { value: '5' } })
      fireEvent.click(screen.getByTestId('btn-increment'))
      fireEvent.click(screen.getByTestId('btn-reset'))
      expect(screen.getByTestId('count-display')).toHaveTextContent('0')
    })
  })

  describe('✅ Task 9 – History', () => {
    it('lưu giá trị trước khi tăng vào history', () => {
      render(<Ex02_CounterWithStep />)
      // count = 0 → increment → history phải chứa "0"
      fireEvent.click(screen.getByTestId('btn-increment'))
      const items = screen.getAllByTestId('history-item')
      expect(items.length).toBeGreaterThanOrEqual(1)
      expect(items[0]).toHaveTextContent('0')
    })

    it('history không vượt quá 10 phần tử', () => {
      render(<Ex02_CounterWithStep />)
      for (let i = 0; i < 15; i++) fireEvent.click(screen.getByTestId('btn-increment'))
      const items = screen.getAllByTestId('history-item')
      expect(items.length).toBeLessThanOrEqual(10)
    })
  })
})
