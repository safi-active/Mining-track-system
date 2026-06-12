import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/transactions/weekly-report').then(r => {
      setReport(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const exportToExcel = () => {
    if (!report?.transactions?.length) {
      alert('No transactions to export!');
      return;
    }
    const data = report.transactions.map(t => ({
      'ID': t.id,
      'Buyer Name': t.buyer_name,
      'Mineral': t.mineral,
      'Quantity (kg)': t.quantity_kg,
      'Total USD': t.total_usd,
      'Total CDF': t.total_cdf,
      'Date': new Date(t.transaction_date).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    const summaryData = (report.minerals || []).map(m => ({
      'Mineral': m.mineral,
      'Transactions': m.count,
      'Total Qty (kg)': m.total_kg,
      'Total USD': m.total_usd,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryData), 'Summary');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `MineTrack_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📈 Reports</h1>
            <p style={styles.subtitle}>Transaction analytics & summaries</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} style={styles.printBtn}>🖨️ Print</button>
            <button onClick={exportToExcel} style={styles.excelBtn}>📊 Export Excel</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#888' }}>⏳ Loading...</div>
        ) : (
          <>
            <div style={styles.statsGrid} className="grid-3">
              {[
                { icon: '📦', value: report?.total_transactions || 0, label: 'Total Transactions' },
                { icon: '💵', value: `$${(report?.total_usd || 0).toFixed(2)}`, label: 'Total Revenue (USD)' },
                { icon: '🪨', value: `${(report?.minerals || []).reduce((a, b) => a + b.total_kg, 0).toFixed(0)} kg`, label: 'Total Minerals' },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📊 Minerals by Quantity (kg)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report?.minerals || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mineral" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip />
                  <Bar dataKey="total_kg" fill="#1a3a5c" radius={[4, 4, 0, 0]} name="Quantity (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💰 Revenue by Mineral (USD)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report?.minerals || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mineral" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip formatter={v => `$${Number(v).toFixed(2)}`} />
                  <Bar dataKey="total_usd" fill="#f0a500" radius={[4, 4, 0, 0]} name="Revenue (USD)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 Mineral Summary Table</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thead}>
                      {['Mineral', 'Transactions', 'Total Qty (kg)', 'Total Revenue (USD)', 'Avg Price/kg'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(report?.minerals || []).map(m => (
                      <tr key={m.mineral} style={styles.tr}>
                        <td style={styles.td}><span style={styles.badge}>{m.mineral}</span></td>
                        <td style={styles.td}>{m.count}</td>
                        <td style={styles.td}>{Number(m.total_kg).toFixed(2)} kg</td>
                        <td style={styles.td}>${Number(m.total_usd).toFixed(2)}</td>
                        <td style={styles.td}>${(m.total_usd / m.total_kg).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a3a5c' },
  subtitle: { color: '#888', fontSize: '16px', marginTop: '4px' },
  printBtn: { padding: '12px 20px', background: '#1a3a5c', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px' },
  excelBtn: { padding: '12px 20px', background: '#217346', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: '#fff', borderRadius: '14px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: '32px', marginBottom: '10px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#1a3a5c' },
  statLabel: { fontSize: '14px', color: '#888', marginTop: '6px' },
  card: { background: '#fff', borderRadius: '14px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTitle: { fontSize: '18px', fontWeight: '600', color: '#1a3a5c', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
  thead: { background: '#f4f6f9' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#555', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 14px', fontSize: '15px', color: '#333' },
  badge: { display: 'inline-block', padding: '4px 10px', borderRadius: '12px', background: '#e8f0fe', color: '#1a3a5c', fontSize: '13px', fontWeight: '500' },
};

export default Reports;