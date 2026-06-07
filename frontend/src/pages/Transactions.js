import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    API.get('/transactions/').then(r => setTransactions(r.data)).catch(() => {});
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
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{marginLeft:'240px', padding:'30px', flex:1, background:'#f4f6f9', minHeight:'100vh'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
          <div>
            <h1 style={{fontSize:'24px', fontWeight:'bold', color:'#1a3a5c'}}>📋 Transactions</h1>
            <p style={{color:'#888', fontSize:'14px'}}>{transactions.length} records</p>
          </div>
          <a href="/new-transaction" style={{padding:'10px 20px', background:'linear-gradient(135deg,#1a3a5c,#f0a500)', color:'#fff', borderRadius:'8px', textDecoration:'none', fontSize:'14px', fontWeight:'bold'}}>➕ New</a>
        </div>
        <div style={{background:'#fff', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflowX:'auto'}}>
          <input style={{width:'100%', padding:'10px 14px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', marginBottom:'16px', outline:'none'}}
            type="text" placeholder="🔍 Search by buyer or mineral..." value={filter} onChange={e => setFilter(e.target.value)} />
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:'900px'}}>
            <thead>
              <tr style={{background:'#f4f6f9'}}>
                {['#','Buyer','Contact','Mineral','Qty (kg)','Price/kg','Total USD','Total CDF','Mine','Car','Route','Date',''].map(h => (
                  <th key={h} style={{padding:'10px 12px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#555', borderBottom:'1px solid #eee', whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.id}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}><strong>{t.buyer_name}</strong></td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.buyer_contact||'-'}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}><span style={{background:'#e8f0fe', color:'#1a3a5c', padding:'3px 8px', borderRadius:'12px', fontSize:'11px'}}>{t.mineral}</span></td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.quantity_kg} kg</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>${t.price_per_kg_usd}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>${t.total_usd?.toFixed(2)}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.total_cdf?.toLocaleString()} CDF</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.source_mine||'-'}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.transport_car_number||'-'}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{t.transport_route||'-'}</td>
                  <td style={{padding:'10px 12px', fontSize:'13px'}}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                  <td style={{padding:'10px 12px'}}><button onClick={() => handleDelete(t.id)} style={{background:'#fee', border:'1px solid #fcc', borderRadius:'6px', padding:'4px 8px', cursor:'pointer'}}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Transactions;