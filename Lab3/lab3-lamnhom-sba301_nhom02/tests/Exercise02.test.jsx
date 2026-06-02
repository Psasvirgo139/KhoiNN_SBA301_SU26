import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import TodoList from '../src/exercises/Exercise02/TodoList';

describe('Bài 02 — Todo List (8đ)', () => {
  it('[1đ] Hiển thị thông báo rỗng khi chưa có todo', () => {
    render(<TodoList />);
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });

  it('[1đ] Thêm todo mới khi nhấn nút Thêm', async () => {
    render(<TodoList />);
    await userEvent.type(screen.getByTestId('todo-input'), 'Học React');
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
    expect(screen.getByText('Học React')).toBeInTheDocument();
  });

  it('[1đ] Thêm todo khi nhấn Enter', async () => {
    render(<TodoList />);
    await userEvent.type(screen.getByTestId('todo-input'), 'Học Router{Enter}');
    expect(screen.getByText('Học Router')).toBeInTheDocument();
  });

  it('[1đ] Không thêm todo rỗng', async () => {
    render(<TodoList />);
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });

  it('[1đ] Xóa todo', async () => {
    render(<TodoList />);
    await userEvent.type(screen.getByTestId('todo-input'), 'Xóa tôi{Enter}');
    const deleteBtn = screen.getByText('Xóa tôi').closest('[data-testid^="todo-item-"]');
    const id = deleteBtn.getAttribute('data-testid').split('-').pop();
    fireEvent.click(screen.getByTestId(`delete-btn-${id}`));
    expect(screen.queryByText('Xóa tôi')).not.toBeInTheDocument();
  });

  it('[1đ] Toggle trạng thái hoàn thành', async () => {
    render(<TodoList />);
    await userEvent.type(screen.getByTestId('todo-input'), 'Hoàn thành tôi{Enter}');
    const item = screen.getByText('Hoàn thành tôi').closest('[data-testid^="todo-item-"]');
    const id = item.getAttribute('data-testid').split('-').pop();
    fireEvent.click(screen.getByTestId(`toggle-${id}`));
    expect(screen.getByTestId(`toggle-${id}`)).toBeChecked();
  });

  it('[1đ] Cập nhật đúng số đếm: tổng, hoàn thành, chưa xong', async () => {
    render(<TodoList />);
    await userEvent.type(screen.getByTestId('todo-input'), 'Việc 1{Enter}');
    await userEvent.type(screen.getByTestId('todo-input'), 'Việc 2{Enter}');
    expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    expect(screen.getByTestId('completed-count')).toHaveTextContent('0');
    expect(screen.getByTestId('pending-count')).toHaveTextContent('2');
    const firstItem = screen.getAllByRole('listitem')[0];
    const id = firstItem.getAttribute('data-testid').split('-').pop();
    fireEvent.click(screen.getByTestId(`toggle-${id}`));
    expect(screen.getByTestId('completed-count')).toHaveTextContent('1');
    expect(screen.getByTestId('pending-count')).toHaveTextContent('1');
  });

  it('[1đ] Input được xóa sau khi thêm todo', async () => {
    render(<TodoList />);
    await userEvent.type(screen.getByTestId('todo-input'), 'Test{Enter}');
    expect(screen.getByTestId('todo-input')).toHaveValue('');
  });
});
