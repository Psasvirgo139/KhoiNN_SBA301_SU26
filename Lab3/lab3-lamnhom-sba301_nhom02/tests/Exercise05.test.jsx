import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ShoppingCart from '../src/exercises/Exercise05/ShoppingCart';

describe('Bài 05 — Shopping Cart (12đ)', () => {
  it('[1đ] Hiển thị giỏ hàng trống ban đầu', () => {
    render(<ShoppingCart />);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
  });

  it('[2đ] Thêm sản phẩm vào giỏ hàng', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
  });

  it('[1đ] Thêm cùng sản phẩm 2 lần tăng số lượng', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    expect(screen.getByTestId('quantity-1')).toHaveTextContent('2');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
  });

  it('[2đ] Tăng và giảm số lượng sản phẩm', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-2'));
    fireEvent.click(screen.getByTestId('increase-qty-2'));
    expect(screen.getByTestId('quantity-2')).toHaveTextContent('2');
    fireEvent.click(screen.getByTestId('decrease-qty-2'));
    expect(screen.getByTestId('quantity-2')).toHaveTextContent('1');
  });

  it('[1đ] Xóa sản phẩm khi giảm số lượng về 0', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-3'));
    fireEvent.click(screen.getByTestId('decrease-qty-3'));
    expect(screen.queryByTestId('cart-item-3')).not.toBeInTheDocument();
  });

  it('[2đ] Xóa sản phẩm khỏi giỏ hàng', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    fireEvent.click(screen.getByTestId('add-to-cart-2'));
    fireEvent.click(screen.getByTestId('remove-from-cart-1'));
    expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
  });

  it('[2đ] Tính tổng tiền đúng', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    const expected = (150000 * 2).toLocaleString('vi-VN');
    expect(screen.getByTestId('cart-total')).toHaveTextContent(expected);
  });

  it('[1đ] Số lượng item trong giỏ cập nhật đúng', () => {
    render(<ShoppingCart />);
    fireEvent.click(screen.getByTestId('add-to-cart-1'));
    fireEvent.click(screen.getByTestId('add-to-cart-2'));
    fireEvent.click(screen.getByTestId('increase-qty-1'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('3');
  });
});
