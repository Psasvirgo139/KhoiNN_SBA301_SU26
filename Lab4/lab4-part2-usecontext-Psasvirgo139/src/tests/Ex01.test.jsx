import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Ex01CounterPage from '../pages/Ex01CounterPage'

describe('Ex01 – Counter Context', () => {

  it('hiển thị giá trị ban đầu là 0', () => {
    render(<Ex01CounterPage />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('tăng count khi nhấn nút tăng', () => {
    render(<Ex01CounterPage />)
    fireEvent.click(screen.getByRole('button', { name: /\+/i }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('giảm count khi nhấn nút giảm', () => {
    render(<Ex01CounterPage />)
    fireEvent.click(screen.getByRole('button', { name: /−|--|^-$/i }))
    expect(screen.getByText('-1')).toBeInTheDocument()
  })

  it('reset về 0 sau khi tăng', () => {
    render(<Ex01CounterPage />)
    fireEvent.click(screen.getByRole('button', { name: /\+/i }))
    fireEvent.click(screen.getByRole('button', { name: /\+/i }))
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('hiển thị "dương" khi count > 0', () => {
    render(<Ex01CounterPage />)
    fireEvent.click(screen.getByRole('button', { name: /\+/i }))
    expect(screen.getByText(/dương/i)).toBeInTheDocument()
  })

  it('hiển thị "âm" khi count < 0', () => {
    render(<Ex01CounterPage />)
    fireEvent.click(screen.getByRole('button', { name: /−|--|^-$/i }))
    expect(screen.getByText(/âm/i)).toBeInTheDocument()
  })

  it('hiển thị "bằng 0" khi count = 0', () => {
    render(<Ex01CounterPage />)
    expect(screen.getByText(/bằng 0/i)).toBeInTheDocument()
  })
})
