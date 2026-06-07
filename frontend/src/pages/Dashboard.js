import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1a3a5c','#f0a500','#2ecc71','#e74c3c','#9b59b6'];

function Dashboard() {
  const [report, setReport] = useState(null);
  const [rate, setRate] = useState(2800);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    API.get('/transactions/weekly-report').then(r => setReport(r.data)).catch(() => {});
    API.get('/rates/latest').then(r => setRate(r.data.usd_to_cdf)).catch(() => {});
  }, []);

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{marginLeft:'240px', padding:'30px', flex:1, background:'#f4f6f9', minHeight:'100vh'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
          <div>
            <h1 style={{fontSize:'24px', fontWeight:'bold', color:'#1a3a5c'}}>⛏️ Dashboard</h1>
            <p style={{color:'#888', fontSize:'14px'}}>Welcome, {user.full_name}</p>
          </div>
          <div style={{background:'#1a3a5c', color:'#fff', padding:'10px 18px', borderRadius:'20px', fontSize:'14px'}}>
            💱 1 USD = {rate.toLocaleString()} CDF
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'20px'}}>
          {[
            {icon:'📦', value: report?.total_transactions || 0, label:'Total Transactions'},
            {icon:'💵', value: `$${(report?.total_usd || 0).toFixed(2)}`, label:'Total Revenue (USD)'},
            {icon:'💰', value: `${((report?.total_usd || 0) * rate).toLocaleString()} CDF`, label:'Total Revenue (CDF)'},
            {icon:'🪨', value: report?.minerals?.length || 0, label:'Mineral Types'},
          ].map((s, i) => (
            <div key={i} style={{background:'#fff', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:'28px', marginBottom:'8px'}}>{s.icon}</div>
              <div style={{fontSize:'20px', fontWeight:'bold', color:'#1a3a5c'}}>{s.value}</div>
              <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px'}}>
          <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>📊 Minerals by Quantity (kg)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={report?.minerals || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mineral" /><YAxis />
                <Tooltip />
                <Bar dataKey="total_kg" fill="#1a3a5c" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>🥧 Revenue by Mineral</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={report?.minerals || []} dataKey="total_usd" nameKey="mineral" cx="50%" cy="50%" outerRadius={80}
                  label={({mineral, percent}) => `${mineral} ${(percent*100).toFixed(0)}%`}>
                  {(report?.minerals || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => `$${v.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
          <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>🕒 Recent Transactions</h3>
          {report?.transactions?.length > 0 ? (
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f4f6f9'}}>
                  {['Buyer','Mineral','Qty (kg)','Total USD','Total CDF','Date'].map(h => (
                    <th key={h} style={{padding:'10px 12px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.transactions.slice(0,5).map(t => (
                  <tr key={t.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                    <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.buyer_name}</td>
                    <td style={{padding:'10px 12px', fontSize:'13px'}}><span style={{background:'#e8f0fe', color:'#1a3a5c', padding:'3px 8px', borderRadius:'12px', fontSize:'11px'}}>{t.mineral}</span></td>
                    <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.quantity_kg} kg</td>
                    <td style={{padding:'10px 12px', fontSize:'13px'}}>${t.total_usd?.toFixed(2)}</td>
                    <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.total_cdf?.toLocaleString()} CDF</td>
                    <td style={{padding:'10px 12px', fontSize:'13px'}}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{textAlign:'center', padding:'40px', color:'#888'}}>
              <div style={{fontSize:'48px'}}>📋</div>
              <p>No transactions yet. <a href="/new-transaction" style={{color:'#1a3a5c'}}>Add your first transaction</a></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;