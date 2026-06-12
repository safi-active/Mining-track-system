import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1a3a5c', '#f0a500', '#2ecc71', '#e74c3c', '#9b59b6'];

function Dashboard() {
  const [report, setReport] = useState(null);
  const [rate, setRate] = useState(2800);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get('/transactions/weekly-report').then(r => setReport(r.data)).catch(() => {});
    API.get('/rates/latest').then(r => setRate(r.data.usd_to_cdf)).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>⛏️ Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, {user.full_name || 'Operator'}</p>
          </div>
          <div style={styles.rateBadge}>💱 1 USD = {Number(rate).toLocaleString()} CDF</div>
        </div>

        <div style={styles.statsGrid} className="grid-4">
          {[
            { icon: '📦', value: report?.total_transactions || 0, label: 'Total Transactions' },
            { icon: '💵', value: `$${(report?.total_usd || 0).toFixed(2)}`, label: 'Total Revenue (USD)' },
            { icon: '💰', value: `${((report?.total_usd || 0) * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })} CDF`, label: 'Total Revenue (CDF)' },
            { icon: '🪨', value: report?.minerals?.length || 0, label: 'Mineral Types' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.grid2} className="grid-2">
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📊 Minerals by Quantity (kg)</h3>
            {report?.minerals?.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={report.minerals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mineral" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip />
                  <Bar dataKey="total_kg" fill="#1a3a5c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p style={styles.empty}>No data yet — add your first transaction!</p>}
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🥧 Revenue by Mineral (USD)</h3>
            {report?.minerals?.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={report.minerals} dataKey="total_usd" nameKey="mineral"
                    cx="50%" cy="50%" outerRadius={90}
                    label={({ mineral, percent }) => `${mineral} ${(percent * 100).toFixed(0)}%`}>
                    {report.minerals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p style={styles.empty}>No data yet</p>}
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={styles.cardTitle}>🕒 Recent Transactions</h3>
            <a href="/new-transaction" style={styles.addBtn}>➕ New Transaction</a>
          </div>
          {report?.transactions?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    {['Buyer', 'Mineral', 'Qty (kg)', 'Total USD', 'Total CDF', 'Date'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.transactions.slice(0, 5).map(t => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={styles.td}><strong>{t.buyer_name}</strong></td>
                      <td style={styles.td}><span style={styles.badge}>{t.mineral}</span></td>
                      <td style={styles.td}>{t.quantity_kg} kg</td>
                      <td style={styles.td}>${Number(t.total_usd).toFixed(2)}</td>
                      <td style={styles.td}>{Number(t.total_cdf).toLocaleString()} CDF</td>
                      <td style={styles.td}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '56px' }}>📋</div>
              <p style={{ fontSize: '18px', marginTop: '12px' }}>No transactions yet.</p>
              <a href="/new-transaction" style={{ ...styles.addBtn, display: 'inline-block', marginTop: '16px' }}>➕ Add your first transaction</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a3a5c' },
  subtitle: { color: '#888', fontSize: '16px', marginTop: '4px' },
  rateBadge: { background: '#1a3a5c', color: '#fff', padding: '12px 20px', borderRadius: '20px', fontSize: '15px', fontWeight: '500' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', borderRadius: '14px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: '32px', marginBottom: '10px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#1a3a5c' },
  statLabel: { fontSize: '14px', color: '#888', marginTop: '6px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' },
  card: { background: '#fff', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '18px', fontWeight: '600', color: '#1a3a5c', marginBottom: '16px' },
  addBtn: { padding: '10px 20px', background: 'linear-gradient(135deg,#1a3a5c,#f0a500)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '600px' },
  thead: { background: '#f4f6f9' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#555', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 14px', fontSize: '15px', color: '#333' },
  badge: { display: 'inline-block', padding: '4px 10px', borderRadius: '12px', background: '#e8f0fe', color: '#1a3a5c', fontSize: '13px', fontWeight: '500' },
  empty: { color: '#888', textAlign: 'center', padding: '20px', fontSize: '16px' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#888' },
};

export default Dashboard;