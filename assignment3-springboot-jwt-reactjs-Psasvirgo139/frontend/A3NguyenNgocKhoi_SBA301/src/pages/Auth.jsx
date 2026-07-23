import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, role, fullName: userFullName, email: userEmail } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email: userEmail, role, fullName: userFullName }));
      
      setSuccess('Logged in successfully!');
      setTimeout(() => {
        if (role === 'STAFF' || role === 'ROLE_STAFF') {
          navigate('/staff');
        } else {
          navigate('/customer');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await API.post('/auth/register', {
        emailAddress: email,
        password,
        customerFullName: fullName,
        telephone,
        customerBirthday: birthday
      });

      setSuccess('Registration successful! You can now log in.');
      setIsLogin(true);
      // Clear registration fields
      setPassword('');
      setFullName('');
      setTelephone('');
      setBirthday('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '40px', textAlign: 'center' }}>
        
        <h2 className="title-display text-gradient-primary" style={{ fontSize: '32px', marginBottom: '24px' }}>
          FUMiniHotelSystem
        </h2>

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '4px', marginBottom: '30px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            style={{ 
              flex: 1, 
              border: 'none', 
              background: isLogin ? 'var(--primary)' : 'transparent',
              color: isLogin ? '#fff' : 'var(--text-secondary)',
              padding: '10px 0',
              borderRadius: '8px',
              fontSize: '15px'
            }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            style={{ 
              flex: 1, 
              border: 'none', 
              background: !isLogin ? 'var(--primary)' : 'transparent',
              color: !isLogin ? '#fff' : 'var(--text-secondary)',
              padding: '10px 0',
              borderRadius: '8px',
              fontSize: '15px'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'left' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'left' }}>
            ✅ {success}
          </div>
        )}

        {isLogin ? (
          // Sign In Form
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nguyen Ngoc Khoi" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Telephone</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="0901234567" 
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="khoi@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Birthday</label>
              <input 
                type="date" 
                className="form-input" 
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '10px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
