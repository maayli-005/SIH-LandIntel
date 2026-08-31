import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LandMap from "./pages/LandMap";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";
import Reports from "./pages/Reports";
import Login from "./pages/Login"; // Login screen linked safely

function App() {
  // LocalStorage se role status track karne ke liye system setup
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    localStorage.setItem('role', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('role');
    window.location.reload();
  };

  // --- GATEWAY VALIDATION CHECK ---
  // Agar logged in nahi hai toh baaki routing completely unaccessible rahegi
  if (!userRole) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      {/* Navbar ke paas custom logout control bypass karne ke liye */}
      <div style={{ position: 'relative' }}>
        <Navbar />
        {/* Simple professional logout trigger box for top dashboard display */}
        <button
          onClick={handleLogout}
          style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 100, backgroundColor: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Logout ({userRole === 'officer' ? 'Admin' : 'Researcher'})
        </button>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<LandMap />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;