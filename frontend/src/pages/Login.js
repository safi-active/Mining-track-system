import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      const userRes = await API.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(userRes.data));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>⛏️</div>
          <h1 style={styles.title}>MineTrack DRC</h1>
          <p style={styles.subtitle}>Mineral Transaction System</p>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#1a3a5c,#0d2137)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  icon: { fontSize: '56px', marginBottom: '12px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a3a5c' },
  subtitle: { color: '#888', fontSize: '16px', marginTop: '6px' },
  error: {
    background: '#fee', border: '1px solid #fcc', color: '#c00',
    padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '15px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '15px', fontWeight: '600', color: '#444' },
  input: {
    padding: '14px 16px', border: '2px solid #ddd',
    borderRadius: '10px', fontSize: '16px', outline: 'none',
    transition: 'border 0.2s',
  },
  btn: {
    padding: '16px', background: 'linear-gradient(135deg,#1a3a5c,#f0a500)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px',
  },
};

export default Login;