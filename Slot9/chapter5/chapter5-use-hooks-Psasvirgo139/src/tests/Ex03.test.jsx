/**
 * Tests – Bài 3: Todo List (useReducer)
 * =======================================
 * Chạy: npm test -- Ex03
 */
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Ex03_TodoList from '../pages/Ex03_TodoList'

describe('Bài 3 – Todo List', () => {

  describe('✅ Task 1+3 – Render ban đầu', () => {
    it('danh sách rỗng ban đầu', () => {
      render(<Ex03_TodoList />)
      expect(screen.getByTestId('todo-list').children.length).toBe(0)
    })

    it('pending-count = 0 ban đầu', () => {
      render(<Ex03_TodoList />)
      expect(screen.getByTestId('pending-count')).toHaveTextContent('0')
    })
  })

  describe('✅ Task 2+4 – ADD_TODO', () => {
    it('thêm một todo', () => {
      render(<Ex03_TodoList />)
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Học React' } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))
      expect(screen.getByText('Học React')).toBeInTheDocument()
    })

    it('pending-count tăng lên 1 sau khi thêm', () => {
      render(<Ex03_TodoList />)
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Task A' } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))
      expect(screen.getByTestId('pending-count')).toHaveTextContent('1')
    })

    it('không thêm todo khi input rỗng', () => {
      render(<Ex03_TodoList />)
      fireEvent.click(screen.getByTestId('btn-add-todo'))
      expect(screen.getByTestId('todo-list').children.length).toBe(0)
    })

    it('input được xóa sau khi thêm', () => {
      render(<Ex03_TodoList />)
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Xóa sau khi thêm' } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))
      expect(screen.getByTestId('todo-input')).toHaveValue('')
    })
  })

  describe('✅ Task 2 – TOGGLE_TODO', () => {
    const addTodo = (text = 'Test') => {
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: text } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))
    }

    it('toggle làm giảm pending-count', () => {
      render(<Ex03_TodoList />)
      addTodo('Todo 1')
      const id = screen.getByText('Todo 1').closest('[data-testid^="todo-item-"]')
        .getAttribute('data-testid').replace('todo-item-', '')
      fireEvent.click(screen.getByTestId(`btn-toggle-${id}`))
      expect(screen.getByTestId('pending-count')).toHaveTextContent('0')
    })

    it('toggle lại trả về pending-count = 1', () => {
      render(<Ex03_TodoList />)
      addTodo('Reversible')
      const id = screen.getByText('Reversible').closest('[data-testid^="todo-item-"]')
        .getAttribute('data-testid').replace('todo-item-', '')
      fireEvent.click(screen.getByTestId(`btn-toggle-${id}`))
      fireEvent.click(screen.getByTestId(`btn-toggle-${id}`))
      expect(screen.getByTestId('pending-count')).toHaveTextContent('1')
    })
  })

  describe('✅ Task 2 – DELETE_TODO', () => {
    it('xóa todo khỏi danh sách', () => {
      render(<Ex03_TodoList />)
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Xóa tôi' } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))
      const id = screen.getByText('Xóa tôi').closest('[data-testid^="todo-item-"]')
        .getAttribute('data-testid').replace('todo-item-', '')
      fireEvent.click(screen.getByTestId(`btn-delete-${id}`))
      expect(screen.queryByText('Xóa tôi')).not.toBeInTheDocument()
    })
  })

  describe('✅ Task 9 – CLEAR_DONE', () => {
    it('xóa tất cả todo đã done', () => {
      render(<Ex03_TodoList />)

      // Thêm 2 todo
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Keep' } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))
      fireEvent.change(screen.getByTestId('todo-input'), { target: { value: 'Remove' } })
      fireEvent.click(screen.getByTestId('btn-add-todo'))

      // Toggle "Remove"
      const id = screen.getByText('Remove').closest('[data-testid^="todo-item-"]')
        .getAttribute('data-testid').replace('todo-item-', '')
      fireEvent.click(screen.getByTestId(`btn-toggle-${id}`))

      fireEvent.click(screen.getByTestId('btn-clear-done'))

      expect(screen.queryByText('Remove')).not.toBeInTheDocument()
      expect(screen.getByText('Keep')).toBeInTheDocument()
    })
  })
})
