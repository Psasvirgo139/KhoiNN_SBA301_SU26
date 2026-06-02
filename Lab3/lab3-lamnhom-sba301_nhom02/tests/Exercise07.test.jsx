import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import AppRouter from '../src/exercises/Exercise07/AppRouter';

describe('Bài 07 — Basic Routing (12đ)', () => {
  it('[2đ] Hiển thị trang Home mặc định', () => {
    render(<AppRouter />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('[2đ] NavBar có đủ 3 liên kết điều hướng', () => {
    render(<AppRouter />);
    expect(screen.getByTestId('nav-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-about')).toBeInTheDocument();
    expect(screen.getByTestId('nav-contact')).toBeInTheDocument();
  });

  it('[2đ] Điều hướng đến trang About', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-about'));
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });

  it('[2đ] Điều hướng đến trang Contact', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-contact'));
    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
  });

  it('[2đ] Quay về trang Home từ About', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('nav-about'));
    await userEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('[1đ] Nút "Tìm hiểu thêm" trên Home điều hướng đến About', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('go-to-about-btn'));
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });

  it('[1đ] Nút "Liên hệ" trên Home điều hướng đến Contact', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('go-to-contact-btn'));
    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
  });
});
