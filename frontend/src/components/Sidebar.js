import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/new-transaction', label: 'New Transaction', icon: '➕' },
    { path: '/transactions', label: 'All Transactions', icon: '📋' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={{fontSize:'28px'}}>⛏️</span>
        <div>
          <div style={styles.logoTitle}>MineTrack DRC</div>
          <div style={styles.logoSub}>Mineral Transactions</div>
        </div>
      </div>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>{user.full_name?.charAt(0) || 'O'}</div>
        <div>
          <div style={styles.userName}>{user.full_name}</div>
          <div style={styles.userRole}>{user.is_admin ? '👑 Admin' : 'Operator'}</div>
        </div>
      </div>
      <nav style={{flex:1, padding:'8px 0'}}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path}
            style={{...styles.navItem, ...(location.pathname === item.path ? styles.active : {})}}>
            <span>{item.icon}</span><span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
    </div>
  );
}

const styles = {
  sidebar: { width:'240px', minHeight:'100vh', background:'linear-gradient(180deg,#1a3a5c,#0d2137)', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, bottom:0 },
  logo: { display:'flex', alignItems:'center', gap:'10px', padding:'20px', borderBottom:'1px solid rgba(255,255,255,0.1)' },
  logoTitle: { color:'#fff', fontWeight:'bold', fontSize:'16px' },
  logoSub: { color:'rgba(255,255,255,0.5)', fontSize:'11px' },
  userInfo: { display:'flex', alignItems:'center', gap:'10px', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.1)' },
  avatar: { width:'36px', height:'36px', borderRadius:'50%', background:'#f0a500', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'bold', fontSize:'16px' },
  userName: { color:'#fff', fontSize:'13px', fontWeight:'500' },
  userRole: { color:'rgba(255,255,255,0.5)', fontSize:'11px' },
  navItem: { display:'flex', alignItems:'center', gap:'10px', padding:'12px 20px', color:'rgba(255,255,255,0.7)', textDecoration:'none', fontSize:'14px' },
  active: { background:'rgba(255,255,255,0.15)', color:'#fff', borderLeft:'3px solid #f0a500' },
  logoutBtn: { margin:'20px', padding:'10px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'8px', color:'#fff', cursor:'pointer', fontSize:'14px' },
};
export default Sidebar;