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
    buyer_name:'', buyer_contact:'', mineral:'Cobalt', quantity_kg:'',
    price_per_kg_usd:'', source_mine:'', transport_car_number:'',
    transport_route:'', transaction_date: new Date().toISOString().slice(0,16), notes:''
  });

  useEffect(() => {
    API.get('/rates/latest').then(r => setRate(r.data.usd_to_cdf)).catch(() => {});
  }, []);

  const totalUSD = (parseFloat(form.quantity_kg)||0) * (parseFloat(form.price_per_kg_usd)||0);
  const totalCDF = totalUSD * rate;
  const update = (f, v) => setForm({...form, [f]: v});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/transactions/', {
        ...form,
        quantity_kg: parseFloat(form.quantity_kg),
        price_per_kg_usd: parseFloat(form.price_per_kg_usd),
      });
      setMessage('✅ Transaction saved!');
      setTimeout(() => navigate('/transactions'), 1500);
    } catch (err) {
      setMessage('❌ Failed to save transaction.');
    }
    setLoading(false);
  };

  const card = {background:'#fff', borderRadius:'12px', padding:'20px', marginBottom:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'};
  const input = {padding:'10px 12px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'13px', outline:'none', background:'#fff', width:'100%'};
  const label = {fontSize:'12px', fontWeight:'500', color:'#555', marginBottom:'4px', display:'block'};

  return (
    <div style={{display:'flex'}}>
      <Sidebar />
      <div style={{marginLeft:'240px', padding:'30px', flex:1, background:'#f4f6f9', minHeight:'100vh'}}>
        <h1 style={{fontSize:'24px', fontWeight:'bold', color:'#1a3a5c', marginBottom:'4px'}}>➕ New Transaction</h1>
        <p style={{color:'#888', fontSize:'14px', marginBottom:'24px'}}>Record a mineral purchase</p>

        {message && <div style={{padding:'12px', borderRadius:'8px', marginBottom:'16px', background: message.startsWith('✅') ? '#e6f4ea':'#fce8e6', color: message.startsWith('✅') ? '#2d6a2d':'#c00'}}>{message}</div>}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
          <div style={card}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>👤 Buyer Info</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div><label style={label}>Buyer Name *</label><input style={input} type="text" placeholder="Full name or company" value={form.buyer_name} onChange={e => update('buyer_name', e.target.value)} required /></div>
              <div><label style={label}>Buyer Contact</label><input style={input} type="text" placeholder="Phone or email" value={form.buyer_contact} onChange={e => update('buyer_contact', e.target.value)} /></div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>🪨 Mineral</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div><label style={label}>Mineral Type *</label>
                <select style={input} value={form.mineral} onChange={e => update('mineral', e.target.value)}>
                  {['Cobalt','Copper','Gold','Tin','Coltan','Diamond','Zinc','Other'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div><label style={label}>Source Mine</label><input style={input} type="text" placeholder="Mine location" value={form.source_mine} onChange={e => update('source_mine', e.target.value)} /></div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>💰 Quantity & Price</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div><label style={label}>Quantity (kg) *</label><input style={input} type="number" step="0.01" placeholder="e.g. 500" value={form.quantity_kg} onChange={e => update('quantity_kg', e.target.value)} required /></div>
              <div><label style={label}>Price per kg (USD) *</label><input style={input} type="number" step="0.01" placeholder="e.g. 33.50" value={form.price_per_kg_usd} onChange={e => update('price_per_kg_usd', e.target.value)} required /></div>
              <div style={{background:'#f4f6f9', borderRadius:'8px', padding:'12px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'14px'}}><span>Total USD:</span><strong>${totalUSD.toFixed(2)}</strong></div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px'}}><span>Total CDF:</span><strong>{totalCDF.toLocaleString(undefined,{maximumFractionDigits:0})} CDF</strong></div>
                <div style={{fontSize:'11px', color:'#888', marginTop:'4px'}}>Rate: 1 USD = {rate.toLocaleString()} CDF</div>
              </div>
            </div>
          </div>

          <div style={card}>
            <h3 style={{fontSize:'15px', fontWeight:'600', color:'#1a3a5c', marginBottom:'16px'}}>🚛 Transport</h3>
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              <div><label style={label}>Car Number</label><input style={input} type="text" placeholder="e.g. KIN 1234 A" value={form.transport_car_number} onChange={e => update('transport_car_number', e.target.value)} /></div>
              <div><label style={label}>Route</label><input style={input} type="text" placeholder="e.g. Kolwezi → Lubumbashi" value={form.transport_route} onChange={e => update('transport_route', e.target.value)} /></div>
              <div><label style={label}>Date & Time *</label><input style={input} type="datetime-local" value={form.transaction_date} onChange={e => update('transaction_date', e.target.value)} required /></div>
            </div>
          </div>
        </div>

        <div style={card}>
          <label style={label}>Notes</label>
          <textarea style={{...input, height:'80px', resize:'vertical'}} placeholder="Additional notes..." value={form.notes} onChange={e => update('notes', e.target.value)} />
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{padding:'14px 32px', background:'linear-gradient(135deg,#1a3a5c,#f0a500)', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:'bold', cursor:'pointer'}}>
          {loading ? 'Saving...' : '💾 Save Transaction'}
        </button>
      </div>
    </div>
  );
}
export default NewTransaction;