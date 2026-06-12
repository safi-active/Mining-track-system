import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: '#1a3a5c',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '20px',
          cursor: 'pointer',
        }}
        className="hamburger"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            display: 'none',
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998,
          }}
          className="overlay"
        />
      )}

      <div style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : undefined,
      }} className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={styles.logo}>
          <span style={{ fontSize: '32px' }}>⛏️</span>
          <div>
            <div style={styles.logoTitle}>MineTrack DRC</div>
            <div style={styles.logoSub}>Mineral Transactions</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path ? styles.active : {})
              }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: block !important; }
          .overlay { display: block !important; }
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 999;
          }
          .sidebar.open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    minHeight: '100vh',
    background: 'linear-gradient(180deg,#1a3a5c,#0d2137)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0, top: 0, bottom: 0,
    overflowY: 'auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoTitle: { color: '#fff', fontWeight: 'bold', fontSize: '18px' },
  logoSub: { color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '16px',
    transition: 'all 0.2s',
  },
  active: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    borderLeft: '4px solid #f0a500',
  },
  logoutBtn: {
    margin: '20px',
    padding: '12px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Sidebar;