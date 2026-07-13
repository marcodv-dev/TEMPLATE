import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
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
          {/*
            TODO: Aggiungere le rotte business qui, in base al documento d'esame.
            Esempio:
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          */}
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
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
