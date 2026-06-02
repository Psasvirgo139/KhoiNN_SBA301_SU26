import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import RegistrationForm from '../src/exercises/Exercise04/RegistrationForm';

async function fillForm({ name = '', email = '', phone = '', age = '' } = {}) {
  if (name) await userEvent.type(screen.getByTestId('name-input'), name);
  if (email) await userEvent.type(screen.getByTestId('email-input'), email);
  if (phone) await userEvent.type(screen.getByTestId('phone-input'), phone);
  if (age) await userEvent.type(screen.getByTestId('age-input'), age);
}

describe('Bài 04 — Registration Form (10đ)', () => {
  it('[1đ] Render form ban đầu: nút submit hiển thị, chưa có success message', () => {
    render(<RegistrationForm />);
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    // Error feedback nên ẩn hoặc chưa hiện (visible chỉ khi isInvalid=true)
    const nameError = screen.queryByTestId('name-error');
    if (nameError) expect(nameError).not.toBeVisible();
  });

  it('[1.5đ] Hiện lỗi khi submit form rỗng', () => {
    render(<RegistrationForm />);
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('name-error')).toBeVisible();
    expect(screen.getByTestId('email-error')).toBeVisible();
    expect(screen.getByTestId('phone-error')).toBeVisible();
    expect(screen.getByTestId('age-error')).toBeVisible();
  });

  it('[1.5đ] Lỗi khi tên < 2 ký tự', async () => {
    render(<RegistrationForm />);
    await fillForm({ name: 'A', email: 'a@b.com', phone: '0123456789', age: '20' });
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('name-error')).toBeVisible();
    expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
  });

  it('[1.5đ] Lỗi khi email không hợp lệ', async () => {
    render(<RegistrationForm />);
    await fillForm({ name: 'Nguyen Van A', email: 'invalid-email', phone: '0123456789', age: '20' });
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('email-error')).toBeVisible();
  });

  it('[1.5đ] Lỗi khi số điện thoại không phải 10 chữ số', async () => {
    render(<RegistrationForm />);
    await fillForm({ name: 'Nguyen Van A', email: 'a@b.com', phone: '012345', age: '20' });
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('phone-error')).toBeVisible();
  });

  it('[1.5đ] Lỗi khi tuổi ngoài khoảng 16–60', async () => {
    render(<RegistrationForm />);
    await fillForm({ name: 'Nguyen Van A', email: 'a@b.com', phone: '0123456789', age: '15' });
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('age-error')).toBeVisible();
  });

  it('[2đ] Hiển thị thành công khi dữ liệu hợp lệ', async () => {
    render(<RegistrationForm />);
    await fillForm({ name: 'Nguyen Van A', email: 'a@b.com', phone: '0123456789', age: '22' });
    fireEvent.click(screen.getByTestId('submit-btn'));
    expect(screen.getByTestId('success-message')).toBeInTheDocument();
    expect(screen.getByTestId('success-message')).toHaveTextContent('Nguyen Van A');
  });

  it('[0.5đ] Nút làm lại reset form về trạng thái ban đầu', async () => {
    render(<RegistrationForm />);
    await fillForm({ name: 'Nguyen Van A', email: 'a@b.com', phone: '0123456789', age: '22' });
    fireEvent.click(screen.getByTestId('submit-btn'));
    fireEvent.click(screen.getByText(/Đăng ký tài khoản khác/i));
    expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
  });
});
