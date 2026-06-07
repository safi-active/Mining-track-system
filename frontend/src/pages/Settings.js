import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

function Settings() {
  const [rate, setRate] = useState('');
  const [currentRate, setCurrentRate] = useState(2800);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [message, setMessage] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    API.get('/rates/latest').then(r => setCurrentRate(r.data.usd_to_cdf)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/rates/', { usd_to_cdf: parseFloat(rate), date });
      setCurrentRate(parseFloat(rate));
      setMessage('✅ Rate updated!');
      setRate('');
    } catch { setMessage('❌ Failed.'); }
    setTimeout(() => setMessage(''), 3000);
  };

  const totalUSD = (parseFloat(qty)||0) * (parseFloat(price)||0);
  const totalCDF = totalUSD * currentRate;
  const input = {padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'13px', outline:'none', width:'100%'};
  const card = {background:'#fff', borderRadius:'12px', padding:'24px', marginBottom:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'};

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{marginLeft:'240px', padding:'30px', flex:1, background:'#f4f6f9', minHeight:'100vh'}}>
        <h1 style={{fontSize:'24px', fontWeight:'bold', color:'#1a3a5c', marginBottom:'4px'}}>⚙️ Settings</h1>
        <p style={{color:'#888', fontSize:'14px', marginBottom:'24px'}}>Configure system settings</p>

        {message && <div style={{padding:'12px', borderRadius:'8px', marginBottom:'16px', background: message.startsWith('✅')?'#e6f4ea':'#fce8e6', color: message.startsWith('✅')?'#2d6a2d':'#c00'}}>{message}</div>}

        <div style={card}>
          <h3 style={{fontSize:'16px', fontWeight:'600', color:'#1a3a5c', marginBottom:'12px'}}>💱 Exchange Rate</h3>
          <div style={{background:'#e8f0fe', padding:'12px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px', color:'#1a3a5c'}}>
            Current: <strong>1 USD = {currentRate.toLocaleString()} CDF</strong>
          </div>
          <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              <div>
                <label style={{fontSize:'12px', fontWeight:'500', color:'#555', display:'block', marginBottom:'4px'}}>New Rate (CDF)</label>
                <input style={input} type="number" step="0.01" placeholder={`Current: ${currentRate}`} value={rate} onChange={e => setRate(e.target.value)} required />
              </div>
              <div>
                <label style={{fontSize:'12px', fontWeight:'500', color:'#555', display:'block', marginBottom:'4px'}}>Date</label>
                <input style={input} type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
            </div>
            <button style={{padding:'12px 24px', background:'linear-gradient(135deg,#1a3a5c,#f0a500)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'bold', cursor:'pointer', alignSelf:'flex-start'}} type="submit">
              💱 Update Rate
            </button>
          </form>
        </div>

        <div style={card}>
          <h3 style={{fontSize:'16px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>🧮 Price Calculator</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px'}}>
            <div>
              <label style={{fontSize:'12px', fontWeight:'500', color:'#555', display:'block', marginBottom:'4px'}}>Quantity (kg)</label>
              <input style={input} type="number" placeholder="e.g. 500" value={qty} onChange={e => setQty(e.target.value)} />
            </div>
            <div>
              <label style={{fontSize:'12px', fontWeight:'500', color:'#555', display:'block', marginBottom:'4px'}}>Price per kg (USD)</label>
              <input style={input} type="number" placeholder="e.g. 33.50" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
          </div>
          <div style={{background:'#f4f6f9', borderRadius:'8px', padding:'16px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'15px'}}>
              <span>Total (USD):</span><strong style={{color:'#1a3a5c'}}>${totalUSD.toFixed(2)}</strong>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'15px'}}>
              <span>Total (CDF):</span><strong style={{color:'#f0a500'}}>{totalCDF.toLocaleString(undefined,{maximumFractionDigits:0})} CDF</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Settings;