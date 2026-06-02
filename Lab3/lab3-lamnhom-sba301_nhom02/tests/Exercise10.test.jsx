import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppRouter from '../src/exercises/Exercise10/AppRouter';
import { resetBooksStorage } from '../src/exercises/Exercise10/utils/storage';
import { initialBooks } from '../src/data/books';

beforeEach(() => {
  resetBooksStorage();
});

describe('Bài 10 — Book Management Full App (10đ)', () => {
  it('[1đ] Hiển thị Dashboard mặc định với các thống kê', () => {
    render(<AppRouter />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total')).toHaveTextContent(String(initialBooks.length));
  });

  it('[1đ] NavBar có đủ 3 liên kết điều hướng', () => {
    render(<AppRouter />);
    expect(screen.getByTestId('nav-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nav-books')).toBeInTheDocument();
    expect(screen.getByTestId('nav-add-book')).toBeInTheDocument();
  });

  it('[1đ] Điều hướng đến trang danh sách sách', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-books'));
    expect(screen.getByTestId('book-table')).toBeInTheDocument();
    initialBooks.forEach((b) => {
      expect(screen.getByTestId(`book-row-${b.id}`)).toBeInTheDocument();
    });
  });

  it('[1đ] Tìm kiếm sách theo tên', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-books'));
    await userEvent.type(screen.getByTestId('search-books'), 'React');
    const reactBooks = initialBooks.filter((b) => b.title.toLowerCase().includes('react'));
    reactBooks.forEach((b) => {
      expect(screen.getByTestId(`book-row-${b.id}`)).toBeInTheDocument();
    });
  });

  it('[1đ] Lọc sách theo thể loại', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-books'));
    fireEvent.change(screen.getByTestId('genre-filter'), { target: { value: 'Lập trình' } });
    const ltBooks = initialBooks.filter((b) => b.genre === 'Lập trình');
    expect(screen.getAllByTestId(/^book-row-/).length).toBe(ltBooks.length);
  });

  it('[2đ] Thêm sách mới và hiện trong danh sách', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-add-book'));
    expect(screen.getByTestId('book-form')).toBeInTheDocument();
    await userEvent.type(screen.getByTestId('book-title-input'), 'Sách Mới Test');
    await userEvent.type(screen.getByTestId('book-author-input'), 'Tác Giả Test');
    await userEvent.type(screen.getByTestId('book-year-input'), '2024');
    await userEvent.type(screen.getByTestId('book-price-input'), '200000');
    fireEvent.click(screen.getByTestId('save-book-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('book-table')).toBeInTheDocument();
    });
    expect(screen.getByText('Sách Mới Test')).toBeInTheDocument();
  });

  it('[1đ] Xem chi tiết sách', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-books'));
    await userEvent.click(screen.getByTestId(`view-book-${initialBooks[0].id}`));
    expect(screen.getByTestId('book-detail-page')).toBeInTheDocument();
    expect(screen.getByTestId('book-detail-title')).toHaveTextContent(initialBooks[0].title);
  });

  it('[1đ] Xóa sách khỏi danh sách', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-books'));
    const firstId = initialBooks[0].id;
    fireEvent.click(screen.getByTestId(`delete-book-${firstId}`));
    await waitFor(() => {
      expect(screen.queryByTestId(`book-row-${firstId}`)).not.toBeInTheDocument();
    });
    vi.restoreAllMocks();
  });

  it('[1đ] Dashboard thống kê cập nhật đúng số sách available/unavailable', () => {
    render(<AppRouter />);
    const available = initialBooks.filter((b) => b.available).length;
    const unavailable = initialBooks.filter((b) => !b.available).length;
    expect(screen.getByTestId('stat-available')).toHaveTextContent(String(available));
    expect(screen.getByTestId('stat-unavailable')).toHaveTextContent(String(unavailable));
  });
});
