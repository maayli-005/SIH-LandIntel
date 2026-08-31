import { useState, useEffect } from 'react';
import { FileText, Download, Plus } from 'lucide-react';
import api from '../api';
import Loading from '../components/Loading';
import AddRecordModal from '../components/AddRecordModal';

function Reports() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/records/')
      .then((res) => setRecords(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading reports..." />;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  const filteredRecords = filterStatus === 'All'
    ? records
    : records.filter((r) => r.dispute_status === filterStatus);

  const totalArea = filteredRecords.reduce((sum, r) => sum + r.area_hectares, 0);
  const disputedCount = records.filter((r) => r.dispute_status === 'Disputed').length;

  const downloadCSV = () => {
    const headers = ['ID', 'State', 'District', 'Land Type', 'Area (ha)', 'Status', 'Latitude', 'Longitude'];
    const rows = filteredRecords.map((r) => [
      r.id, r.state, r.district, r.land_type, r.area_hectares, r.dispute_status, r.latitude, r.longitude
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'land_records_report.csv';
    a.click();
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
          <FileText size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500 mt-1">Summary and detailed records export.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Records</p>
          <p className="text-2xl font-bold text-slate-800">{records.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Area (ha)</p>
          <p className="text-2xl font-bold text-slate-800">{totalArea.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Disputed Records</p>
          <p className="text-2xl font-bold text-red-500">{disputedCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="Clear">Clear</option>
          <option value="Disputed">Disputed</option>
        </select>

        {/* Buttons Action Group Wrap with Secure Role */}
        <div className="flex items-center gap-2">
          {localStorage.getItem('role') === 'officer' && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
            >
              <Plus size={16} />
              Add New Record
            </button>
          )}

          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-sm">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">State</th>
              <th className="p-3">District</th>
              <th className="p-3">Land Type</th>
              <th className="p-3">Area (ha)</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-3 text-slate-700">{r.id}</td>
                <td className="p-3 text-slate-700">{r.state}</td>
                <td className="p-3 text-slate-700">{r.district}</td>
                <td className="p-3 text-slate-700">{r.land_type}</td>
                <td className="p-3 text-slate-700">{r.area_hectares}</td>
                <td className={`p-3 font-medium ${r.dispute_status === 'Disputed' ? 'text-red-500' : 'text-green-600'}`}>
                  {r.dispute_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddRecordModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default Reports;