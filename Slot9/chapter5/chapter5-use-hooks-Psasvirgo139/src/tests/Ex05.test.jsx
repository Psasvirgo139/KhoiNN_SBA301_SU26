/**
 * Tests – Bài 5: Form Validation (useReducer)
 * =============================================
 * Chạy: npm test -- Ex05
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Ex05_FormValidation from '../pages/Ex05_FormValidation'

describe('Bài 5 – Form Validation', () => {

  describe('✅ Task 1 – Render ban đầu', () => {
    it('hiển thị đủ 4 trường input', () => {
      render(<Ex05_FormValidation />)
      expect(screen.getByTestId('input-name')).toBeInTheDocument()
      expect(screen.getByTestId('input-email')).toBeInTheDocument()
      expect(screen.getByTestId('input-password')).toBeInTheDocument()
      expect(screen.getByTestId('input-confirm')).toBeInTheDocument()
    })

    it('không hiển thị form-success lúc đầu', () => {
      render(<Ex05_FormValidation />)
      expect(screen.queryByTestId('form-success')).not.toBeInTheDocument()
    })
  })

  describe('✅ Task 2+6 – SET_FIELD (onChange)', () => {
    it('giá trị input cập nhật khi gõ', () => {
      render(<Ex05_FormValidation />)
      fireEvent.change(screen.getByTestId('input-name'), { target: { name: 'name', value: 'BichTra' } })
      expect(screen.getByTestId('input-name')).toHaveValue('BichTra')
    })
  })

  describe('✅ Task 2 – Validate (errors hiển thị sau khi touch)', () => {
    it('lỗi name khi để trống rồi blur', () => {
      render(<Ex05_FormValidation />)
      fireEvent.change(screen.getByTestId('input-name'), { target: { name: 'name', value: 'x' } })
      fireEvent.change(screen.getByTestId('input-name'), { target: { name: 'name', value: '' } })
      expect(screen.getByTestId('error-name').textContent.length).toBeGreaterThan(0)
    })

    it('lỗi email khi không có @', () => {
      render(<Ex05_FormValidation />)
      fireEvent.change(screen.getByTestId('input-email'), { target: { name: 'email', value: 'notanemail' } })
      expect(screen.getByTestId('error-email').textContent.length).toBeGreaterThan(0)
    })

    it('lỗi password khi < 6 ký tự', () => {
      render(<Ex05_FormValidation />)
      fireEvent.change(screen.getByTestId('input-password'), { target: { name: 'password', value: '123' } })
      expect(screen.getByTestId('error-password').textContent.length).toBeGreaterThan(0)
    })

    it('lỗi confirm khi không khớp password', () => {
      render(<Ex05_FormValidation />)
      fireEvent.change(screen.getByTestId('input-password'), { target: { name: 'password', value: 'abcdef' } })
      fireEvent.change(screen.getByTestId('input-confirm'), { target: { name: 'confirm', value: 'xyz' } })
      expect(screen.getByTestId('error-confirm').textContent.length).toBeGreaterThan(0)
    })
  })

  describe('✅ Task 3 – SUBMIT thất bại', () => {
    it('không hiển thị form-success khi form trống', () => {
      render(<Ex05_FormValidation />)
      fireEvent.click(screen.getByTestId('btn-submit'))
      expect(screen.queryByTestId('form-success')).not.toBeInTheDocument()
    })

    it('hiển thị lỗi các trường sau khi submit trống', () => {
      render(<Ex05_FormValidation />)
      fireEvent.click(screen.getByTestId('btn-submit'))
      expect(screen.getByTestId('error-name').textContent.length).toBeGreaterThan(0)
      expect(screen.getByTestId('error-email').textContent.length).toBeGreaterThan(0)
      expect(screen.getByTestId('error-password').textContent.length).toBeGreaterThan(0)
    })
  })

  describe('✅ Task 3 – SUBMIT thành công', () => {
    const fillValid = () => {
      fireEvent.change(screen.getByTestId('input-name'),     { target: { name: 'name',     value: 'BichTra' } })
      fireEvent.change(screen.getByTestId('input-email'),    { target: { name: 'email',    value: 'bich@example.com' } })
      fireEvent.change(screen.getByTestId('input-password'), { target: { name: 'password', value: 'secret123' } })
      fireEvent.change(screen.getByTestId('input-confirm'),  { target: { name: 'confirm',  value: 'secret123' } })
    }

    it('hiển thị form-success sau khi điền đúng', () => {
      render(<Ex05_FormValidation />)
      fillValid()
      fireEvent.click(screen.getByTestId('btn-submit'))
      expect(screen.getByTestId('form-success')).toBeInTheDocument()
    })

    it('không còn lỗi khi form hợp lệ', () => {
      render(<Ex05_FormValidation />)
      fillValid()
      fireEvent.click(screen.getByTestId('btn-submit'))
      expect(screen.getByTestId('error-name').textContent).toBe('')
      expect(screen.getByTestId('error-email').textContent).toBe('')
    })
  })

  describe('✅ Task 3 – RESET', () => {
    it('xóa trắng form khi nhấn Reset', () => {
      render(<Ex05_FormValidation />)
      fireEvent.change(screen.getByTestId('input-name'), { target: { name: 'name', value: 'BichTra' } })
      fireEvent.click(screen.getByTestId('btn-reset'))
      expect(screen.getByTestId('input-name')).toHaveValue('')
    })

    it('ẩn form-success sau reset', () => {
      render(<Ex05_FormValidation />)
      // Submit thành công trước
      fireEvent.change(screen.getByTestId('input-name'),     { target: { name: 'name',     value: 'BichTra' } })
      fireEvent.change(screen.getByTestId('input-email'),    { target: { name: 'email',    value: 'b@b.com' } })
      fireEvent.change(screen.getByTestId('input-password'), { target: { name: 'password', value: 'abcdef' } })
      fireEvent.change(screen.getByTestId('input-confirm'),  { target: { name: 'confirm',  value: 'abcdef' } })
      fireEvent.click(screen.getByTestId('btn-submit'))
      expect(screen.getByTestId('form-success')).toBeInTheDocument()
      // Reset
      fireEvent.click(screen.getByTestId('btn-reset'))
      expect(screen.queryByTestId('form-success')).not.toBeInTheDocument()
    })
  })
})
