import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BarChart2, MessageSquare, FileText, Bell, ShieldAlert, CheckCircle } from 'lucide-react';
import api from '../api';

export default function Navbar() {
  const [records, setRecords] = useState([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const currentRole = localStorage.getItem('role');

  useEffect(() => {
    // Dynamic analytics check ke liye records length monitor karenge
    api.get('/records/')
      .then((res) => setRecords(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Total records ke basis par alert logs filter karenge
  const disputedRecords = records.filter(r => r.dispute_status === 'Disputed');

  return (
    <nav style={{ backgroundColor: '#1e293b', color: 'white', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'between', height: '64px', position: 'relative', fontFamily: 'sans-serif', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🏛️</span>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px', display: 'block', tracking: 'wide' }}>DoLR PORTAL</span>
          <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginTop: '-2px' }}>Govt of India</span>
        </div>
      </div>

      {/* Navigation Main Links Group */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: '40px' }}>
        <NavLink to="/" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: isActive ? '#3b82f6' : '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' })}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>
        <NavLink to="/map" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: isActive ? '#3b82f6' : '#94a3b8', textDecoration: 'none' })}>
          <Map size={18} /> Land Map
        </NavLink>
        <NavLink to="/analytics" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: isActive ? '#3b82f6' : '#94a3b8', textDecoration: 'none' })}>
          <BarChart2 size={18} /> Analytics
        </NavLink>
        <NavLink to="/assistant" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: isActive ? '#3b82f6' : '#94a3b8', textDecoration: 'none' })}>
          <MessageSquare size={18} /> AI Assistant
        </NavLink>
        <NavLink to="/reports" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', color: isActive ? '#3b82f6' : '#94a3b8', textDecoration: 'none' })}>
          <FileText size={18} /> Reports
        </NavLink>
      </div>

      {/* Right Actions Block (🔔 Notification Panel Layer) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto', marginRight: '140px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowAlerts(!showAlerts)}>
          <Bell size={20} style={{ color: '#cbd5e1' }} />
          {disputedRecords.length > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 'bold', borderRadius: '50%', padding: '2px 5px', minWidth: '10px', textAlign: 'center' }}>
              {disputedRecords.length}
            </span>
          )}
        </div>

        {/* Real-time Floating Dropdown Box */}
        {showAlerts && (
          <div style={{ position: 'absolute', top: '60px', right: '140px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '320px', zIndex: 110, padding: '12px', color: '#1e293b' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>🚨 System Critical Alerts</span>
              <span style={{ fontSize: '10px', backgroundColor: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>LIVE MONITOR</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {disputedRecords.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                  <CheckCircle size={24} style={{ color: '#10b981', margin: '0 auto 6px', display: 'block' }} />
                  All data streams are secure. No critical alerts.
                </div>
              ) : (
                disputedRecords.slice(-3).reverse().map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px', backgroundColor: '#fff5f5', border: '1px solid #fee2e2', borderRadius: '6px', alignItems: 'start' }}>
                    <ShieldAlert size={16} style={{ color: '#ef4444', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', margin: 0 }}>Active Land Dispute Flagged</p>
                      <p style={{ fontSize: '11px', color: '#7f1d1d', margin: '2px 0 0' }}>New governance mismatch detected in <b>{r.district}, {r.state}</b> across {r.area_hectares} hectares.</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}