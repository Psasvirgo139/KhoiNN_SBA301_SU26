import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import AppRouter from '../src/exercises/Exercise09/AppRouter';
import { blogPosts, blogCategories } from '../src/data/blogPosts';

describe('Bài 09 — Blog & Search Params (10đ)', () => {
  it('[1đ] Hiển thị toàn bộ bài viết mặc định', () => {
    render(<AppRouter />);
    blogPosts.forEach((p) => {
      expect(screen.getByTestId(`blog-post-${p.id}`)).toBeInTheDocument();
    });
  });

  it('[1đ] Hiển thị đủ các nút danh mục', () => {
    render(<AppRouter />);
    blogCategories.forEach((cat) => {
      expect(screen.getByTestId(`blog-category-${cat}`)).toBeInTheDocument();
    });
  });

  it('[2đ] Lọc bài viết theo danh mục React', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('blog-category-React'));
    const reactPosts = blogPosts.filter((p) => p.category === 'React');
    reactPosts.forEach((p) => {
      expect(screen.getByTestId(`blog-post-${p.id}`)).toBeInTheDocument();
    });
    const nonReact = blogPosts.filter((p) => p.category !== 'React');
    nonReact.forEach((p) => {
      expect(screen.queryByTestId(`blog-post-${p.id}`)).not.toBeInTheDocument();
    });
  });

  it('[2đ] Cập nhật URL search params khi lọc danh mục', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('blog-category-CSS'));
    expect(screen.getByTestId('active-category')).toHaveTextContent('CSS');
  });

  it('[1đ] Nút "Tất cả" xóa filter và hiển thị lại toàn bộ', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId('blog-category-API'));
    await userEvent.click(screen.getByTestId('blog-category-Tất cả'));
    expect(screen.getByTestId('active-category')).toHaveTextContent('Tất cả');
    expect(screen.getAllByTestId(/^blog-post-/).length).toBe(blogPosts.length);
  });

  it('[2đ] Điều hướng đến trang chi tiết bài viết', async () => {
    render(<AppRouter />);
    const firstPost = blogPosts[0];
    await userEvent.click(screen.getByTestId(`blog-link-${firstPost.id}`));
    expect(screen.getByTestId('blog-detail')).toBeInTheDocument();
    expect(screen.getByTestId('post-title')).toHaveTextContent(firstPost.title);
  });

  it('[1đ] Nút quay lại từ trang chi tiết', async () => {
    render(<AppRouter />);
    await userEvent.click(screen.getByTestId(`blog-link-${blogPosts[0].id}`));
    fireEvent.click(screen.getByTestId('back-to-blog-btn'));
    expect(screen.queryByTestId('blog-detail')).not.toBeInTheDocument();
  });
});
