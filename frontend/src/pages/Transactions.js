import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/transactions/').then(r => {
      setTransactions(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await API.delete(`/transactions/${id}`);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filtered = transactions.filter(t =>
    t.buyer_name.toLowerCase().includes(filter.toLowerCase()) ||
    t.mineral.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📋 All Transactions</h1>
            <p style={styles.subtitle}>{transactions.length} total records</p>
          </div>
          <a href="/new-transaction" style={styles.addBtn}>➕ New Transaction</a>
        </div>

        <div style={styles.card}>
          <input style={styles.search} type="text"
            placeholder="🔍 Search by buyer or mineral..."
            value={filter} onChange={e => setFilter(e.target.value)} />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#888' }}>
              ⏳ Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#888' }}>
              <div style={{ fontSize: '56px' }}>📋</div>
              <p style={{ fontSize: '18px', marginTop: '12px' }}>No transactions found.</p>
              <a href="/new-transaction" style={{ ...styles.addBtn, display: 'inline-block', marginTop: '16px' }}>➕ Add Transaction</a>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    {['#', 'Buyer', 'Contact', 'Mineral', 'Qty (kg)', 'Price/kg', 'Total USD', 'Total CDF', 'Mine', 'Car', 'Route', 'Date', ''].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={styles.td}>{t.id}</td>
                      <td style={styles.td}><strong>{t.buyer_name}</strong></td>
                      <td style={styles.td}>{t.buyer_contact || '-'}</td>
                      <td style={styles.td}><span style={styles.badge}>{t.mineral}</span></td>
                      <td style={styles.td}>{t.quantity_kg} kg</td>
                      <td style={styles.td}>${t.price_per_kg_usd}</td>
                      <td style={styles.td}><strong>${Number(t.total_usd).toFixed(2)}</strong></td>
                      <td style={styles.td}>{Number(t.total_cdf).toLocaleString()} CDF</td>
                      <td style={styles.td}>{t.source_mine || '-'}</td>
                      <td style={styles.td}>{t.transport_car_number || '-'}</td>
                      <td style={styles.td}>{t.transport_route || '-'}</td>
                      <td style={styles.td}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleDelete(t.id)} style={styles.deleteBtn}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a3a5c' },
  subtitle: { color: '#888', fontSize: '16px', marginTop: '4px' },
  addBtn: { padding: '12px 24px', background: 'linear-gradient(135deg,#1a3a5c,#f0a500)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' },
  card: { background: '#fff', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  search: { width: '100%', padding: '14px 16px', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px', marginBottom: '20px', outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '900px' },
  thead: { background: '#f4f6f9' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#555', borderBottom: '1px solid #eee', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 14px', fontSize: '15px', color: '#333', whiteSpace: 'nowrap' },
  badge: { display: 'inline-block', padding: '4px 10px', borderRadius: '12px', background: '#e8f0fe', color: '#1a3a5c', fontSize: '13px', fontWeight: '500' },
  deleteBtn: { background: '#fee', border: '1px solid #fcc', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '14px', color: '#c00' },
};

export default Transactions;