import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import AppRouter from '../src/exercises/Exercise08/AppRouter';
import { products } from '../src/data/products';

describe('Bài 08 — Dynamic Routes (10đ)', () => {
  it('[2đ] Hiển thị danh sách sản phẩm mặc định', () => {
    render(<AppRouter />);
    expect(screen.getByTestId('product-list-page')).toBeInTheDocument();
    products.forEach((p) => {
      expect(screen.getByTestId(`product-link-${p.id}`)).toBeInTheDocument();
    });
  });

  it('[2đ] Điều hướng đến trang chi tiết sản phẩm', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('product-link-1'));
    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
  });

  it('[2đ] Hiển thị đúng thông tin sản phẩm trong trang chi tiết', async () => {
    render(<AppRouter />);
    const product = products[0];
    await userEvent.click(screen.getByTestId(`product-link-${product.id}`));
    expect(screen.getByTestId('product-detail')).toHaveTextContent(product.name);
  });

  it('[2đ] Nút quay lại từ trang chi tiết', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('product-link-2'));
    expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('back-btn'));
    expect(screen.getByTestId('product-list-page')).toBeInTheDocument();
  });

  it('[2đ] Hiển thị trang 404 khi truy cập route không tồn tại', async () => {
    const { MemoryRouter, Routes, Route } = await import('react-router-dom');
    const NotFound = (await import('../src/exercises/Exercise08/pages/NotFound')).default;
    render(
      <MemoryRouter initialEntries={['/khong-ton-tai']}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
