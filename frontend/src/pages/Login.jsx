import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('officer'); // officer ya researcher
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Hackathon demo ke liye simple credentials check
    if (role === 'officer' && username === 'admin' && password === 'admin123') {
      onLoginSuccess('officer');
      alert("Sarkari Adhikari Login Safal! 🏛️");
    } else if (role === 'researcher' && username === 'user' && password === 'user123') {
      onLoginSuccess('researcher');
      alert("Researcher/Citizen Login Safal! 🔬");
    } else {
      alert("❌ Galat Username ya Password! Demo credentials use karein.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '40px' }}>🏛️</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginTop: '8px' }}>National Land Governance</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Ministry of Rural Development (DoLR)</p>
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Select Governance Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc' }}>
              <option value="officer">Sarkari Officer / Tehsildar (Admin)</option>
              <option value="researcher">Policy Researcher / Citizen</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Username</label>
            <input type="text" placeholder={role === 'officer' ? "admin" : "user"} value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <div>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Password</label>
            <input type="password" placeholder={role === 'officer' ? "admin123" : "user123"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' }}>
            Secure Portal Login
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '12px', color: '#166534', textAlign: 'center' }}>
          💡 <b>Demo Credentials:</b><br />
          Officer: <code>admin</code> / <code>admin123</code><br />
          Researcher: <code>user</code> / <code>user123</code>
        </div>
      </div>
    </div>
  );
}