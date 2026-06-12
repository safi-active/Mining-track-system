import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function Settings() {
  const [rate, setRate] = useState('');
  const [currentRate, setCurrentRate] = useState(2800);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    API.get('/rates/latest').then(r => setCurrentRate(r.data.usd_to_cdf)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/rates/', { usd_to_cdf: parseFloat(rate), date });
      setCurrentRate(parseFloat(rate));
      setMessage('✅ Exchange rate updated successfully!');
      setRate('');
    } catch {
      setMessage('❌ Failed to update rate.');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const totalUSD = (parseFloat(qty) || 0) * (parseFloat(price) || 0);
  const totalCDF = totalUSD * currentRate;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <h1 style={styles.title}>⚙️ Settings</h1>
        <p style={styles.subtitle}>Configure system settings</p>

        {message && (
          <div style={{ ...styles.message, background: message.startsWith('✅') ? '#e6f4ea' : '#fce8e6', color: message.startsWith('✅') ? '#2d6a2d' : '#c00' }}>
            {message}
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>💱 Exchange Rate (USD → CDF)</h3>
          <div style={styles.currentRate}>
            Current Rate: <strong>1 USD = {Number(currentRate).toLocaleString()} CDF</strong>
          </div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.grid2} className="grid-2">
              <div style={styles.field}>
                <label style={styles.label}>New Rate (1 USD = ? CDF)</label>
                <input style={styles.input} type="number" step="0.01"
                  placeholder={`Current: ${currentRate}`}
                  value={rate} onChange={e => setRate(e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Effective Date</label>
                <input style={styles.input} type="date"
                  value={date} onChange={e => setDate(e.target.value)} required />
              </div>
            </div>
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? '⏳ Updating...' : '💱 Update Rate'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🧮 Price Calculator</h3>
          <div style={styles.grid2} className="grid-2">
            <div style={styles.field}>
              <label style={styles.label}>Quantity (kg)</label>
              <input style={styles.input} type="number" step="0.01"
                placeholder="e.g. 500" value={qty} onChange={e => setQty(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Price per kg (USD)</label>
              <input style={styles.input} type="number" step="0.01"
                placeholder="e.g. 33.50" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>
          <div style={styles.calcBox}>
            <div style={styles.calcRow}>
              <span style={{ fontSize: '16px' }}>Total (USD):</span>
              <strong style={{ color: '#1a3a5c', fontSize: '20px' }}>${totalUSD.toFixed(2)}</strong>
            </div>
            <div style={styles.calcRow}>
              <span style={{ fontSize: '16px' }}>Total (CDF):</span>
              <strong style={{ color: '#f0a500', fontSize: '20px' }}>{totalCDF.toLocaleString(undefined, { maximumFractionDigits: 0 })} CDF</strong>
            </div>
            <div style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
              Rate: 1 USD = {Number(currentRate).toLocaleString()} CDF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a3a5c' },
  subtitle: { color: '#888', fontSize: '16px', marginTop: '4px', marginBottom: '24px' },
  message: { padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontSize: '16px', fontWeight: '500' },
  card: { background: '#fff', borderRadius: '14px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '20px', fontWeight: '600', color: '#1a3a5c', marginBottom: '16px' },
  currentRate: { background: '#e8f0fe', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontSize: '16px', color: '#1a3a5c' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '15px', fontWeight: '500', color: '#444' },
  input: { padding: '12px 14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '15px', outline: 'none', width: '100%' },
  btn: { padding: '14px 28px', background: 'linear-gradient(135deg,#1a3a5c,#f0a500)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' },
  calcBox: { background: '#f4f6f9', borderRadius: '10px', padding: '20px', marginTop: '16px' },
  calcRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
};

export default Settings;