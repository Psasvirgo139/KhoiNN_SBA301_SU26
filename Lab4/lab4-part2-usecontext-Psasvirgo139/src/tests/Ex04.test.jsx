import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Ex04ThemePage from '../pages/Ex04ThemePage'

describe('Ex04 – Theme Switcher Context', () => {

  it('render trang không bị lỗi', () => {
    render(<Ex04ThemePage />)
    expect(document.body).toBeInTheDocument()
  })

  it('có nút chọn Light theme', () => {
    render(<Ex04ThemePage />)
    expect(screen.getByRole('button', { name: /light|sáng/i })).toBeInTheDocument()
  })

  it('có nút chọn Dark theme', () => {
    render(<Ex04ThemePage />)
    expect(screen.getByRole('button', { name: /dark|tối/i })).toBeInTheDocument()
  })

  it('có nút chọn System theme', () => {
    render(<Ex04ThemePage />)
    expect(screen.getByRole('button', { name: /system|hệ thống/i })).toBeInTheDocument()
  })

  it('lưu "dark" vào localStorage khi chọn Dark', () => {
    render(<Ex04ThemePage />)
    fireEvent.click(screen.getByRole('button', { name: /dark|tối/i }))
    expect(localStorage.getItem('theme-mode')).toBe('dark')
  })

  it('lưu "light" vào localStorage khi chọn Light', () => {
    render(<Ex04ThemePage />)
    fireEvent.click(screen.getByRole('button', { name: /light|sáng/i }))
    expect(localStorage.getItem('theme-mode')).toBe('light')
  })

  it('hiển thị tên theme đang active', () => {
    render(<Ex04ThemePage />)
    fireEvent.click(screen.getByRole('button', { name: /dark|tối/i }))
    expect(screen.getByText(/dark/i)).toBeInTheDocument()
  })
})
