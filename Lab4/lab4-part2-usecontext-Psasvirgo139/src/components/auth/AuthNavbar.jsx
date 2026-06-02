import { useAuth } from '../../context/AuthContext';

export default function AuthNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-3 rounded shadow-sm mb-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <span className="navbar-brand mb-0 h1 fw-bold tracking-tight">
          🔐 Security Portal
        </span>
        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="text-light fw-medium">
                Xin chào, {user.name}
              </span>
              <button 
                onClick={logout} 
                className="btn btn-outline-danger btn-sm px-3 py-1.5 rounded-pill shadow-sm transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <span className="text-muted fw-light">Chưa đăng nhập</span>
          )}
        </div>
      </div>
    </nav>
  );
}
