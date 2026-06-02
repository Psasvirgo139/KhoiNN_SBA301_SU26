/**
 * validators.js – Hàm validate cho từng field của form đăng ký (Bài 3)
 *
 * Quy tắc:
 *  - fullName : không trống, ít nhất 3 ký tự
 *  - email    : không trống, đúng định dạng email
 *  - password : không trống, ≥ 6 ký tự, có ít nhất 1 chữ hoa, 1 chữ số
 *  - confirmPassword : không trống, phải khớp với password
 *
 * @param {string} name       - tên field
 * @param {string} value      - giá trị hiện tại của field
 * @param {object} allValues  - toàn bộ values của form (dùng cho confirmPassword)
 * @returns {string}          - thông báo lỗi, hoặc '' nếu hợp lệ
 */
export function validateField(name, value, allValues = {}) {
  const val = value !== undefined && value !== null ? String(value) : '';

  switch (name) {
    case 'fullName':
      if (!val.trim()) {
        return 'Họ và tên không được để trống';
      }
      if (val.trim().length < 3) {
        return 'Họ và tên phải có ít nhất 3 ký tự';
      }
      return '';

    case 'email':
      if (!val.trim()) {
        return 'Email không được để trống';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) {
        return 'Email không hợp lệ';
      }
      return '';

    case 'password':
      if (!val) {
        return 'Mật khẩu không được để trống';
      }
      if (val.length < 6) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      if (!/[A-Z]/.test(val)) {
        return 'Mật khẩu phải có ít nhất 1 chữ hoa';
      }
      if (!/[0-9]/.test(val)) {
        return 'Mật khẩu phải có ít nhất 1 chữ số';
      }
      return '';

    case 'confirmPassword':
      if (!val) {
        return 'Xác nhận mật khẩu không được để trống';
      }
      if (val !== allValues.password) {
        return 'Xác nhận mật khẩu không khớp';
      }
      return '';

    default:
      return '';
  }
}
