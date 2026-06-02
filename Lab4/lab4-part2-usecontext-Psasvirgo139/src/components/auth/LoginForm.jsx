import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    login(email, password);
  };

  return (
    <div className="card shadow-sm border-0 p-4 rounded-3 bg-white" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h3 className="card-title text-center mb-4 fw-bold text-dark fs-4">Đăng Nhập Hệ Thống</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold text-secondary small">Email</label>
          <input
            type="email"
            id="email"
            className="form-control rounded-3 py-2 px-3 transition"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label fw-semibold text-secondary small">Mật khẩu</label>
          <input
            type="password"
            id="password"
            className="form-control rounded-3 py-2 px-3 transition"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger p-2 rounded-3 small mb-3 text-center" role="alert">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold shadow-sm transition d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>
    </div>
  );
}
