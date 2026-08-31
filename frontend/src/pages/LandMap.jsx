import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Map } from 'lucide-react';
import api from '../api';
import Loading from '../components/Loading';

// Fix default marker icon issue with Leaflet + Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LandMap() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/records/')
      .then((res) => setRecords(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading map..." />;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  const center = records.length > 0
    ? [records[0].latitude, records[0].longitude]
    : [22.9734, 78.6569];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          <Map size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Land Map</h1>
          <p className="text-slate-500 mt-1">Explore land records geographically.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100" style={{ height: '600px' }}>
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {records.map((r) => (
            <Marker key={r.id} position={[r.latitude, r.longitude]}>
              <Popup>
                <strong>{r.state} - {r.district}</strong><br />
                Type: {r.land_type}<br />
                Area: {r.area_hectares} ha<br />
                Status: {r.dispute_status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default LandMap;