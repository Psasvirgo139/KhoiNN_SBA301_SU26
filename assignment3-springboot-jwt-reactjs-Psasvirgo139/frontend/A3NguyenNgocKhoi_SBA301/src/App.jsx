import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Rooms from './pages/Rooms';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import StaffDashboard from './pages/StaffDashboard';

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Sync user state on route change
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 40px', 
      margin: '20px auto', 
      width: '95%', 
      maxWidth: '1200px',
      borderRadius: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px', marginRight: '6px' }}>🏨</span>
        <Link to="/" className="title-display text-gradient-primary" style={{ fontSize: '22px', fontWeight: '800' }}>
          FUMiniHotel
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link to="/" style={{ 
          color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-secondary)',
          fontWeight: location.pathname === '/' ? '600' : '400',
          fontSize: '15px'
        }}>
          Rooms
        </Link>

        {user ? (
          <>
            {user.role === 'STAFF' || user.role === 'ROLE_STAFF' ? (
              <Link to="/staff" style={{ 
                color: location.pathname === '/staff' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/staff' ? '600' : '400',
                fontSize: '15px'
              }}>
                Staff Dashboard
              </Link>
            ) : (
              <Link to="/customer" style={{ 
                color: location.pathname === '/customer' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: location.pathname === '/customer' ? '600' : '400',
                fontSize: '15px'
              }}>
                My Portal
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{user.fullName}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {user.role === 'STAFF' || user.role === 'ROLE_STAFF' ? 'Staff' : 'Customer'}
                </div>
              </div>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleLogout}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <Link to="/login">
            <button type="button" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <main style={{ flex: '1', width: '100%' }}>
        <Routes>
          <Route path="/" element={<Rooms />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </main>
      <footer style={{ 
        textAlign: 'center', 
        padding: '30px 20px', 
        color: 'var(--text-muted)', 
        fontSize: '14px', 
        borderTop: '1px solid var(--border-color)',
        marginTop: '60px'
      }}>
        © 2026 FUMiniHotelSystem. Developed for Assignment 03.
      </footer>
    </Router>
  );
}

export default App;
