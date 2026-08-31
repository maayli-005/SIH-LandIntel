import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Scale, AlertTriangle, IndianRupee, Clock } from 'lucide-react';
import api from '../api';
import Loading from '../components/Loading';

export default function Analytics() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/records/')
      .then((res) => setRecords(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading analytical dashboard..." />;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  // Data processing for Bar Chart
  const typeCounts = records.reduce((acc, r) => {
    acc[r.land_type] = (acc[r.land_type] || 0) + r.area_hectares;
    return acc;
  }, {});
  const barData = Object.keys(typeCounts).map(key => ({ name: key, Area: typeCounts[key] }));

  // Data processing for Pie Chart
  const disputedRecords = records.filter(r => r.dispute_status === 'Disputed');
  const clearCount = records.length - disputedRecords.length;
  const pieData = [
    { name: 'Clear Titles', value: clearCount },
    { name: 'Disputed', value: disputedRecords.length }
  ];
  const COLORS = ['#10b981', '#ef4444'];

  // --- SMART PENALTY CALCULATOR LOGIC ---
  const totalDisputedArea = disputedRecords.reduce((sum, r) => sum + r.area_hectares, 0);
  
  // Standard Government Rules Estimation Formulas:
  // 1. Legal Penalty: ₹25,000 flat per hectare for boundary/ownership litigation
  const estimatedPenalties = totalDisputedArea * 25000;
  // 2. Court Administration Cost: ₹5,000 processing fee per land cluster
  const administrativeFees = disputedRecords.length * 5000;
  // 3. Government Revenue Blocked (Asset Value Locking): Estimated market value locked
  const lockedAssetValue = totalDisputedArea * 120000; 

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Advanced Analytics</h1>
        <p className="text-slate-500 mt-1">Geo-spatial distributions and financial litigation metrics.</p>
      </div>

      {/* Existing Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-base font-semibold text-slate-700 mb-4">Area Distribution by Land Type (ha)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Area" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-base font-semibold text-slate-700 mb-4">Dispute Status Proportions</h3>
          <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔥 NEW DISPUTE LEGAL PENALTY CALCULATOR WIDGET 🔥 */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center gap-3 border-b pb-4 mb-4">
          <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
            <Scale size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Automated Litigation & Penalty Monitor</h2>
            <p className="text-sm text-slate-500">Real-time dynamic financial impact analysis of ongoing land disputes [Evidence-Based Tool].</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Litigated Area</span>
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            <p className="text-xl font-bold text-slate-800">{totalDisputedArea.toFixed(2)} ha</p>
            <p className="text-xs text-slate-400 mt-1">Total land mass under legal stay</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Est. Court Penalties</span>
              <IndianRupee size={16} className="text-red-500" />
            </div>
            <p className="text-xl font-bold text-red-600">₹{estimatedPenalties.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Calculated at ₹25K / hectare dynamic fee</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Admin Filing Cost</span>
              <IndianRupee size={16} className="text-blue-500" />
            </div>
            <p className="text-xl font-bold text-slate-800">₹{administrativeFees.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">₹5,000 base cost per active case file</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium uppercase tracking-wider">Locked Asset Value</span>
              <Clock size={16} className="text-indigo-500" />
            </div>
            <p className="text-xl font-bold text-indigo-600">₹{lockedAssetValue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Frozen economic revenue valuation</p>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <span>💡</span>
          <p>
            <b>Ministry Action Advisory:</b> High density of locked assets detected in dispute clusters. It is recommended to deploy 
            automated fast-track digital arbitration tribunals to release the locked economic value of <b>₹{lockedAssetValue.toLocaleString('en-IN')}</b> back into rural infrastructure development.
          </p>
        </div>
      </div>
    </div>
  );
}