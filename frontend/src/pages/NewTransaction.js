import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function NewTransaction() {
  const navigate = useNavigate();
  const [rate, setRate] = useState(2800);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    buyer_name: '', buyer_contact: '', mineral: 'Cobalt',
    quantity_kg: '', price_per_kg_usd: '', source_mine: '',
    transport_car_number: '', transport_route: '',
    transaction_date: new Date().toISOString().slice(0, 16), notes: ''
  });

  useEffect(() => {
    API.get('/rates/latest').then(r => setRate(r.data.usd_to_cdf)).catch(() => {});
  }, []);

  const totalUSD = (parseFloat(form.quantity_kg) || 0) * (parseFloat(form.price_per_kg_usd) || 0);
  const totalCDF = totalUSD * rate;
  const update = (f, v) => setForm({ ...form, [f]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/transactions/', {
        ...form,
        quantity_kg: parseFloat(form.quantity_kg),
        price_per_kg_usd: parseFloat(form.price_per_kg_usd),
      });
      setMessage('✅ Transaction saved successfully!');
      setTimeout(() => navigate('/transactions'), 1500);
    } catch (err) {
      setMessage('❌ Failed to save transaction. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <h1 style={styles.title}>➕ New Transaction</h1>
        <p style={styles.subtitle}>Record a new mineral purchase</p>

        {message && (
          <div style={{ ...styles.message, background: message.startsWith('✅') ? '#e6f4ea' : '#fce8e6', color: message.startsWith('✅') ? '#2d6a2d' : '#c00' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.grid2} className="grid-2">
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>👤 Buyer Information</h3>
              <div style={styles.formGroup}>
                <div style={styles.field}>
                  <label style={styles.label}>Buyer Name *</label>
                  <input style={styles.input} type="text" placeholder="Full name or company"
                    value={form.buyer_name} onChange={e => update('buyer_name', e.target.value)} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Buyer Contact</label>
                  <input style={styles.input} type="text" placeholder="Phone or email"
                    value={form.buyer_contact} onChange={e => update('buyer_contact', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🪨 Mineral Details</h3>
              <div style={styles.formGroup}>
                <div style={styles.field}>
                  <label style={styles.label}>Mineral Type *</label>
                  <select style={styles.input} value={form.mineral} onChange={e => update('mineral', e.target.value)}>
                    {['Cobalt', 'Copper', 'Gold', 'Tin', 'Coltan', 'Diamond', 'Zinc', 'Other'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Source Mine</label>
                  <input style={styles.input} type="text" placeholder="Mine name or location"
                    value={form.source_mine} onChange={e => update('source_mine', e.target.value)} />
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💰 Quantity & Price</h3>
              <div style={styles.formGroup}>
                <div style={styles.field}>
                  <label style={styles.label}>Quantity (kg) *</label>
                  <input style={styles.input} type="number" step="0.01" placeholder="e.g. 500"
                    value={form.quantity_kg} onChange={e => update('quantity_kg', e.target.value)} required />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Price per kg (USD) *</label>
                  <input style={styles.input} type="number" step="0.01" placeholder="e.g. 33.50"
                    value={form.price_per_kg_usd} onChange={e => update('price_per_kg_usd', e.target.value)} required />
                </div>
                <div style={styles.calcBox}>
                  <div style={styles.calcRow}>
                    <span>Total (USD):</span>
                    <strong style={{ color: '#1a3a5c', fontSize: '18px' }}>${totalUSD.toFixed(2)}</strong>
                  </div>
                  <div style={styles.calcRow}>
                    <span>Total (CDF):</span>
                    <strong style={{ color: '#f0a500', fontSize: '18px' }}>{totalCDF.toLocaleString(undefined, { maximumFractionDigits: 0 })} CDF</strong>
                  </div>
                  <div style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
                    Rate: 1 USD = {Number(rate).toLocaleString()} CDF
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>🚛 Transport Details</h3>
              <div style={styles.formGroup}>
                <div style={styles.field}>
                  <label style={styles.label}>Car/Vehicle Number</label>
                  <input style={styles.input} type="text" placeholder="e.g. KIN 1234 A"
                    value={form.transport_car_number} onChange={e => update('transport_car_number', e.target.value)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Route</label>
                  <input style={styles.input} type="text" placeholder="e.g. Kolwezi → Lubumbashi"
                    value={form.transport_route} onChange={e => update('transport_route', e.target.value)} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Date & Time *</label>
                  <input style={styles.input} type="datetime-local"
                    value={form.transaction_date} onChange={e => update('transaction_date', e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.field}>
              <label style={styles.label}>Notes</label>
              <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                placeholder="Any additional notes..."
                value={form.notes} onChange={e => update('notes', e.target.value)} />
            </div>
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? '⏳ Saving...' : '💾 Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a3a5c' },
  subtitle: { color: '#888', fontSize: '16px', marginTop: '4px', marginBottom: '24px' },
  message: { padding: '14px 18px', borderRadius: '10px', marginBottom: '20px', fontSize: '16px', fontWeight: '500' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  card: { background: '#fff', borderRadius: '14px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '18px', fontWeight: '600', color: '#1a3a5c', marginBottom: '18px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '15px', fontWeight: '500', color: '#444' },
  input: { padding: '12px 14px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '15px', outline: 'none', background: '#fff', width: '100%' },
  calcBox: { background: '#f4f6f9', borderRadius: '10px', padding: '16px' },
  calcRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '16px' },
  btn: { padding: '16px 40px', background: 'linear-gradient(135deg,#1a3a5c,#f0a500)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' },
};

export default NewTransaction;