import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import StudentManagement from '../src/exercises/Exercise06/StudentManagement';
import { initialStudents } from '../src/data/students';

describe('Bài 06 — Student Management (15đ)', () => {
  it('[1đ] Hiển thị danh sách sinh viên ban đầu', () => {
    render(<StudentManagement />);
    initialStudents.forEach((s) => {
      expect(screen.getByTestId(`student-row-${s.id}`)).toBeInTheDocument();
    });
  });

  it('[1đ] Hiển thị đúng số lượng sinh viên', () => {
    render(<StudentManagement />);
    expect(screen.getByTestId('student-count')).toHaveTextContent(String(initialStudents.length));
  });

  it('[2đ] Lọc sinh viên theo lớp', () => {
    render(<StudentManagement />);
    fireEvent.change(screen.getByTestId('filter-class'), { target: { value: 'SE1701' } });
    const se1701 = initialStudents.filter((s) => s.className === 'SE1701');
    expect(screen.getByTestId('student-count')).toHaveTextContent(String(se1701.length));
  });

  it('[1đ] Mở modal khi nhấn nút thêm sinh viên', () => {
    render(<StudentManagement />);
    fireEvent.click(screen.getByTestId('add-student-btn'));
    expect(screen.getByTestId('student-modal')).toBeVisible();
  });

  it('[3đ] Thêm sinh viên mới thành công', async () => {
    render(<StudentManagement />);
    fireEvent.click(screen.getByTestId('add-student-btn'));
    await userEvent.type(screen.getByTestId('modal-name-input'), 'Sinh Viên Mới');
    await userEvent.type(screen.getByTestId('modal-studentid-input'), 'SE999');
    await userEvent.clear(screen.getByTestId('modal-gpa-input'));
    await userEvent.type(screen.getByTestId('modal-gpa-input'), '3.7');
    fireEvent.click(screen.getByTestId('save-student-btn'));
    expect(screen.getByText('Sinh Viên Mới')).toBeInTheDocument();
    expect(screen.getByTestId('student-count')).toHaveTextContent(String(initialStudents.length + 1));
  });

  it('[3đ] Sửa thông tin sinh viên', async () => {
    render(<StudentManagement />);
    const firstId = initialStudents[0].id;
    fireEvent.click(screen.getByTestId(`edit-btn-${firstId}`));
    await userEvent.clear(screen.getByTestId('modal-name-input'));
    await userEvent.type(screen.getByTestId('modal-name-input'), 'Tên Đã Sửa');
    fireEvent.click(screen.getByTestId('save-student-btn'));
    expect(screen.getByText('Tên Đã Sửa')).toBeInTheDocument();
  });

  it('[2đ] Xóa sinh viên', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<StudentManagement />);
    const firstId = initialStudents[0].id;
    const firstRow = screen.getByTestId(`student-row-${firstId}`);
    fireEvent.click(screen.getByTestId(`delete-btn-${firstId}`));
    expect(firstRow).not.toBeInTheDocument();
    expect(screen.getByTestId('student-count')).toHaveTextContent(String(initialStudents.length - 1));
    vi.restoreAllMocks();
  });

  it('[1đ] Validate GPA khi lưu (không lưu khi GPA > 4.0)', async () => {
    render(<StudentManagement />);
    fireEvent.click(screen.getByTestId('add-student-btn'));
    await userEvent.type(screen.getByTestId('modal-name-input'), 'Test');
    await userEvent.type(screen.getByTestId('modal-studentid-input'), 'SE000');
    await userEvent.clear(screen.getByTestId('modal-gpa-input'));
    await userEvent.type(screen.getByTestId('modal-gpa-input'), '5.0');
    fireEvent.click(screen.getByTestId('save-student-btn'));
    expect(screen.getByTestId('student-modal')).toBeVisible();
  });

  it('[1đ] Đóng modal khi nhấn Hủy', () => {
    render(<StudentManagement />);
    fireEvent.click(screen.getByTestId('add-student-btn'));
    fireEvent.click(screen.getByText('Hủy'));
    // Modal unmount hoặc ẩn sau khi đóng
    expect(screen.queryByTestId('student-modal')).not.toBeInTheDocument();
  });
});
