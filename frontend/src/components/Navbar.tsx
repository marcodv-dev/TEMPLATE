import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-logo">App Template</Link>
        <div className="nav-links">
          {/*
            TODO: Aggiungere link in base al ruolo e al documento d'esame.
            Esempio per ruolo 'user':
            {user?.Ruolo === 'user' && <Link to="/dashboard">Dashboard</Link>}

            Esempio per ruolo 'admin':
            {user?.Ruolo === 'admin' && <>
              <Link to="/admin/gestione">Gestione</Link>
              <Link to="/admin/statistiche">Statistiche</Link>
            </>}
          */}
          <span className="nav-user">{user?.Nome} {user?.Cognome} ({user?.Ruolo})</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
