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
      const message = err?.response?.data?.detail || err?.response?.data?.message || err?.response?.statusText || err?.message || 'Invalid credentials. Please try again.';
      setError(message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{textAlign:'center', marginBottom:'30px'}}>
          <div style={{fontSize:'48px'}}>⛏️</div>
          <h1 style={{fontSize:'24px', fontWeight:'bold', color:'#1a3a5c'}}>MineTrack DRC</h1>
          <p style={{color:'#888', fontSize:'14px'}}>Mineral Transaction System v2</p>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="operator@mining.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:'6px'}}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'linear-gradient(135deg,#1a3a5c,#0d2137)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  card: { background:'#fff', borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'400px', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' },
  error: { background:'#fee', border:'1px solid #fcc', color:'#c00', padding:'10px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px' },
  label: { fontSize:'13px', fontWeight:'500', color:'#555' },
  input: { padding:'12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none' },
  btn: { padding:'14px', background:'linear-gradient(135deg,#1a3a5c,#f0a500)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer' },
};
export default Login;