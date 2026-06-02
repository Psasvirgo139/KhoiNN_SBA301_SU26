import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProductFilter from '../src/exercises/Exercise03/ProductFilter';
import { products, categories } from '../src/data/products';

describe('Bài 03 — Product Filter (8đ)', () => {
  it('[1đ] Hiển thị toàn bộ sản phẩm ban đầu', () => {
    render(<ProductFilter />);
    products.forEach((p) => {
      expect(screen.getByTestId(`product-card-${p.id}`)).toBeInTheDocument();
    });
  });

  it('[1đ] Hiển thị đúng số lượng sản phẩm ban đầu', () => {
    render(<ProductFilter />);
    expect(screen.getByTestId('product-count')).toHaveTextContent(String(products.length));
  });

  it('[2đ] Lọc sản phẩm theo danh mục', () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByTestId('filter-Áo'));
    const aoProducts = products.filter((p) => p.category === 'Áo');
    expect(screen.getByTestId('product-count')).toHaveTextContent(String(aoProducts.length));
    aoProducts.forEach((p) => {
      expect(screen.getByTestId(`product-card-${p.id}`)).toBeInTheDocument();
    });
  });

  it('[1đ] Nút "Tất cả" hiển thị lại toàn bộ sản phẩm', () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByTestId('filter-Giày'));
    fireEvent.click(screen.getByTestId('filter-Tất cả'));
    expect(screen.getByTestId('product-count')).toHaveTextContent(String(products.length));
  });

  it('[2đ] Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường)', async () => {
    render(<ProductFilter />);
    await userEvent.type(screen.getByTestId('search-input'), 'áo');
    const matched = products.filter((p) => p.name.toLowerCase().includes('áo'));
    expect(screen.getByTestId('product-count')).toHaveTextContent(String(matched.length));
  });

  it('[1đ] Kết hợp tìm kiếm và lọc danh mục', async () => {
    render(<ProductFilter />);
    fireEvent.click(screen.getByTestId('filter-Phụ kiện'));
    await userEvent.type(screen.getByTestId('search-input'), 'mũ');
    const matched = products.filter(
      (p) => p.category === 'Phụ kiện' && p.name.toLowerCase().includes('mũ'),
    );
    expect(screen.getByTestId('product-count')).toHaveTextContent(String(matched.length));
  });
});
