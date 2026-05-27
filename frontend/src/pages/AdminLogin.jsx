import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [mode, setMode] = useState('login'); // login or reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [q1Email, setQ1Email] = useState('');
  const [q2Roll, setQ2Roll] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await loginAdmin(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Access Denied: Invalid Administrative credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication error.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (q1Email !== 'dondakeshkumarparasa@gmail.com' || q2Roll !== '198w1a03d6') {
      setError('Security Verification Failed: Incorrect answers.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const res = await axios.post('/api/auth/admin/reset-password', { email: q1Email, rollNumber: q2Roll, password: newPassword });
      if (res.data.success) {
        setSuccess('Master password updated successfully! Please sign in.');
        setMode('login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <div className="admin-auth-overlay">
      <div className="admin-auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}><Shield size={40} color="#10b981" /></div>
        <h2 className="admin-auth-title">Admin Gateway</h2>
        <p className="admin-auth-subtitle" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Verify credentials to access administrative dashboard.
        </p>
        
        {error && <div className="error-alert" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
        {success && <div className="success-alert" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid rgba(16,185,129,0.2)' }}>{success}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="admin-auth-form active" autoComplete="off">
            <div className="admin-auth-group">
              <label>Admin Email</label>
              <input type="email" placeholder="Enter admin email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" required />
            </div>
            <div className="admin-auth-group">
              <label>Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem',
                    zIndex: 10
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Verify & Enter</button>
            <div className="admin-auth-footer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '1rem' }}>
              <span className="admin-auth-link" style={{ color: 'var(--brand-primary)', cursor: 'pointer' }} onClick={() => setMode('reset')}>Forgot Password?</span>
              <a href="/" className="admin-auth-link" style={{ color: 'var(--text-muted)' }}>← Student Portal</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="admin-auth-form active" autoComplete="off">
            <p className="security-notice" style={{ fontSize: '0.72rem', color: 'var(--brand-warning)', display: 'flex', gap: '0.25rem', alignItems: 'center', marginBottom: '1rem' }}><AlertTriangle size={14} /> Answer security questions to reset master password.</p>
            <div className="admin-auth-group">
              <label>Q1: Admin Email Address</label>
              <input type="email" placeholder="Enter admin email address" value={q1Email} onChange={e => setQ1Email(e.target.value)} autoComplete="off" required />
            </div>
            <div className="admin-auth-group">
              <label>Q2: Admin Roll Number</label>
              <input type="text" placeholder="Enter admin roll number" value={q2Roll} onChange={e => setQ2Roll(e.target.value)} autoComplete="off" required />
            </div>
            <div className="admin-auth-group">
              <label>New Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new master password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem',
                    zIndex: 10
                  }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="admin-auth-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new master password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem',
                    zIndex: 10
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Update Master Password</button>
            <div className="admin-auth-footer" style={{ display: 'flex', justifyContent: 'center', fontSize: '0.75rem', marginTop: '1rem' }}>
              <span className="admin-auth-link" style={{ color: 'var(--brand-primary)', cursor: 'pointer' }} onClick={() => setMode('login')}>Back to Sign In</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
