import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CorsiList from './pages/CorsiList';
import MieAssegnazioni from './pages/MieAssegnazioni';
import AssegnazioniList from './pages/AssegnazioniList';
import Statistiche from './pages/Statistiche';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      {user && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/mie-assegnazioni" element={<ProtectedRoute><MieAssegnazioni /></ProtectedRoute>} />
          <Route path="/corsi" element={<ProtectedRoute requiredRole="referente"><CorsiList /></ProtectedRoute>} />
          <Route path="/assegnazioni" element={<ProtectedRoute requiredRole="referente"><AssegnazioniList /></ProtectedRoute>} />
          <Route path="/statistiche" element={<ProtectedRoute requiredRole="referente"><Statistiche /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
