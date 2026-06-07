import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    API.get('/transactions/weekly-report').then(r => setReport(r.data)).catch(() => {});
  }, []);

  const card = {background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'};

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{marginLeft:'240px', padding:'30px', flex:1, background:'#f4f6f9', minHeight:'100vh'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
          <div>
            <h1 style={{fontSize:'24px', fontWeight:'bold', color:'#1a3a5c'}}>📈 Reports</h1>
            <p style={{color:'#888', fontSize:'14px'}}>Transaction analytics</p>
          </div>
          <button onClick={() => window.print()} style={{padding:'10px 20px', background:'#1a3a5c', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'14px'}}>🖨️ Print</button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'20px'}}>
          {[
            {icon:'📦', value: report?.total_transactions||0, label:'Total Transactions'},
            {icon:'💵', value: `$${(report?.total_usd||0).toFixed(2)}`, label:'Total Revenue (USD)'},
            {icon:'🪨', value: `${(report?.minerals||[]).reduce((a,b)=>a+b.total_kg,0).toFixed(0)} kg`, label:'Total Minerals'},
          ].map((s,i) => (
            <div key={i} style={{background:'#fff', borderRadius:'12px', padding:'20px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:'28px', marginBottom:'8px'}}>{s.icon}</div>
              <div style={{fontSize:'22px', fontWeight:'bold', color:'#1a3a5c'}}>{s.value}</div>
              <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={card}>
          <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>📊 Minerals by Quantity (kg)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report?.minerals||[]}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mineral" /><YAxis />
              <Tooltip /><Bar dataKey="total_kg" fill="#1a3a5c" radius={[4,4,0,0]} name="Quantity (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>💰 Revenue by Mineral (USD)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={report?.minerals||[]}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mineral" /><YAxis />
              <Tooltip formatter={v=>`$${v.toFixed(2)}`} /><Bar dataKey="total_usd" fill="#f0a500" radius={[4,4,0,0]} name="Revenue (USD)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>📋 Summary Table</h3>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f4f6f9'}}>
                {['Mineral','Transactions','Total Qty (kg)','Total USD','Avg Price/kg'].map(h => (
                  <th key={h} style={{padding:'10px 12px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(report?.minerals||[]).map(m => (
                <tr key={m.mineral} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}><span style={{background:'#e8f0fe', color:'#1a3a5c', padding:'3px 8px', borderRadius:'12px', fontSize:'11px'}}>{m.mineral}</span></td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{m.count}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{m.total_kg.toFixed(2)} kg</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>${m.total_usd.toFixed(2)}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>${(m.total_usd/m.total_kg).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Reports;