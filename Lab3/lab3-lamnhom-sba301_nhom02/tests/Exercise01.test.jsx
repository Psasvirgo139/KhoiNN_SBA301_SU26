import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Counter from '../src/exercises/Exercise01/Counter';

describe('Bài 01 — Counter (5đ)', () => {
  it('[1đ] Hiển thị giá trị khởi tạo là 0', () => {
    render(<Counter />);
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
  });

  it('[1đ] Tăng counter khi nhấn nút +', () => {
    render(<Counter />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('1');
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('2');
  });

  it('[1đ] Giảm counter khi nhấn nút −', () => {
    render(<Counter />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('decrement-btn'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('1');
  });

  it('[1đ] Không cho counter xuống dưới 0', () => {
    render(<Counter />);
    fireEvent.click(screen.getByTestId('decrement-btn'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
    fireEvent.click(screen.getByTestId('decrement-btn'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
  });

  it('[0.5đ] Reset counter về 0', () => {
    render(<Counter />);
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('increment-btn'));
    fireEvent.click(screen.getByTestId('reset-btn'));
    expect(screen.getByTestId('counter-value')).toHaveTextContent('0');
  });

  it('[0.5đ] Badge trạng thái đúng: "Bắt đầu" khi = 0, "Đang chạy" khi > 0, "Cao" khi >= 10', () => {
    render(<Counter />);
    expect(screen.getByTestId('counter-status')).toHaveTextContent('Bắt đầu');
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('counter-status')).toHaveTextContent('Đang chạy');
    for (let i = 0; i < 9; i++) fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('counter-status')).toHaveTextContent('Cao');
  });
});
