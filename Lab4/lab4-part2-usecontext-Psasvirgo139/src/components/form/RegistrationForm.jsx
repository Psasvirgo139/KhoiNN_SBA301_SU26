import FormField from './FormField';
import { useFormContext } from '../../context/FormContext';
import { validateField } from '../../utils/validators';

export default function RegistrationForm() {
  const { state, dispatch } = useFormContext();
  const { status, values } = state;

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Dispatch VALIDATE_ALL to show all errors
    dispatch({ type: 'VALIDATE_ALL' });

    // 2. Since state updates are async, we manually validate current values to check for errors
    const errors = {
      fullName: validateField('fullName', values.fullName, values),
      email: validateField('email', values.email, values),
      password: validateField('password', values.password, values),
      confirmPassword: validateField('confirmPassword', values.confirmPassword, values),
    };

    const hasErrors = Object.values(errors).some((err) => err !== '');
    if (hasErrors) {
      return;
    }

    // 3. Dispatch SET_STATUS 'submitting'
    dispatch({ type: 'SET_STATUS', payload: { status: 'submitting' } });

    // 4. Simulate API call
    setTimeout(() => {
      dispatch({ type: 'SET_STATUS', payload: { status: 'success' } });
    }, 1000);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  if (status === 'success') {
    return (
      <div className="card shadow-sm border-0 p-4 rounded-3 bg-white text-center" style={{ maxWidth: '450px', margin: '0 auto' }}>
        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
          <span className="fs-3 fw-bold">✓</span>
        </div>
        <h3 className="card-title fw-bold text-success mb-2 fs-4">Đăng ký thành công!</h3>
        <p className="text-muted small mb-4">Tài khoản của bạn đã được khởi tạo.</p>
        <button
          onClick={handleReset}
          className="btn btn-primary px-4 py-2 rounded-3 fw-semibold shadow-sm transition"
        >
          Đăng ký lại
        </button>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0 p-4 rounded-3 bg-white" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <h3 className="card-title text-center mb-4 fw-bold text-dark fs-4">Tạo Tài Khoản</h3>
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          name="fullName"
          label="Họ và tên"
          placeholder="Nhập họ và tên của bạn"
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="Nhập địa chỉ email"
        />
        <FormField
          name="password"
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự, 1 hoa, 1 số)"
        />
        <FormField
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu"
        />

        {status === 'error' && (
          <div className="alert alert-danger p-2 rounded-3 small mb-3 text-center" role="alert">
            ⚠️ Vui lòng sửa các lỗi trong form trước khi đăng ký.
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold shadow-sm transition d-flex align-items-center justify-content-center gap-2 mt-4"
        >
          {status === 'submitting' ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Đang gửi đăng ký...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>
    </div>
  );
}
