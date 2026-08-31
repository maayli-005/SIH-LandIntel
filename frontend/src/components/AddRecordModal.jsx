import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cloudflare.com',
  iconUrl: 'https://cloudflare.com',
  shadowUrl: 'https://cloudflare.com',
});

export default function AddRecordModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [formData, setFormData] = useState({
    state: '', district: '', land_type: 'Urban',
    area_hectares: '', dispute_status: 'Clear',
    latitude: '', longitude: ''
  });

  // Map Click events handle karne ke liye inner component
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(e.latlng.lat.toFixed(6)),
          longitude: parseFloat(e.latlng.lng.toFixed(6))
        }));
        setShowMiniMap(false); // Pin select hote hi map band ho jaye
        alert(`Location Locked! Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`);
      },
    });
    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const data = new FormData();
    data.append('file', file);

    fetch('http://127.0.0', {
      method: 'POST',
      body: data
    })
    .then(res => res.json())
    .then(resData => {
      if (resData.status === 'success') {
        setFormData({
          state: resData.extracted_data.state || '',
          district: resData.extracted_data.district || '',
          land_type: resData.extracted_data.land_type || 'Urban',
          area_hectares: resData.extracted_data.area_hectares || '',
          dispute_status: resData.extracted_data.dispute_status || 'Clear',
          latitude: resData.extracted_data.latitude || '',
          longitude: resData.extracted_data.longitude || ''
        });
        alert("AI ne document scan karke data fill kar diya hai! Ek baar verify kar lein.");
      } else {
        alert("AI scanning mein dikkat aayi. Kripya manually fill karein.");
      }
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleDirectSubmit = () => {
    if (!formData.state || !formData.district || !formData.area_hectares || !formData.latitude || !formData.longitude) {
      alert("Kripya State, District, Area aur Coordinates zaroor set karein!");
      return;
    }

    fetch('http://127.0.0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error("Server Error");
      return res.json();
    })
    .then(() => {
      alert("Land record database mein successfully save ho gaya! 🎉");
      onClose();
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("Data save karne mein dikkat aayi. Kripya check karein.");
    });
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', position: 'relative', maxWidth: '450px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af' }}>✕</button>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#1e293b' }}>➕ Add New Land Record</h3>
        
        {/* AI Smart Scanner */}
        <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <p style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: '12px', marginBottom: '8px' }}>⚡ AI Smart Auto-Fill (Registry PDF/Image)</p>
          <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} style={{ fontSize: '12px', margin: '0 auto', display: 'block' }} />
          {loading && <p style={{ color: '#f97316', marginTop: '8px', fontSize: '12px' }}>Gemini AI document padh raha hai...</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="State" value={formData.state} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({...formData, state: e.target.value})} />
          <input type="text" placeholder="District" value={formData.district} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({...formData, district: e.target.value})} />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={formData.land_type} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} onChange={e => setFormData({...formData, land_type: e.target.value})}>
              <option value="Urban">Urban</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Rural">Rural</option>
              <option value="Forest">Forest</option>
            </select>
            <select value={formData.dispute_status} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} onChange={e => setFormData({...formData, dispute_status: e.target.value})}>
              <option value="Clear">Clear</option>
              <option value="Disputed">Disputed</option>
            </select>
          </div>

          <input type="number" step="any" placeholder="Area (Hectares)" value={formData.area_hectares} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} onChange={e => setFormData({...formData, area_hectares: parseFloat(e.target.value) || ''})} />
          
          {/* Dynamic Pin-Drop Validator Tool */}
          <div style={{ border: '1px solid #cbd5e1', padding: '10px', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>📍 Map Coordinates Validator</span>
              <button 
                type="button" 
                onClick={() => setShowMiniMap(!showMiniMap)}
                style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
              >
                {showMiniMap ? "Close Selector" : "🗺️ Pick from Map"}
              </button>
            </div>

            {showMiniMap && (
              <div style={{ height: '180px', width: '100%', marginBottom: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" step="any" placeholder="Latitude" value={formData.latitude} readOnly style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '13px' }} />
              <input type="number" step="any" placeholder="Longitude" value={formData.longitude} readOnly style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '13px' }} />
            </div>
            <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>*Click 'Pick from Map' and drop a pin anywhere inside India to auto-lock coordinates.</p>
          </div>

          <button type="button" onClick={handleDirectSubmit} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
            Verify & Save Record
          </button>
        </div>
      </div>
    </div>
  );
}