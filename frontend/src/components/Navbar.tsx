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
        <Link to="/" className="nav-logo">Academy</Link>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          {user?.Ruolo === 'dipendente' && <Link to="/mie-assegnazioni">I Miei Corsi</Link>}
          {user?.Ruolo === 'referente' && (
            <>
              <Link to="/corsi">Catalogo Corsi</Link>
              <Link to="/assegnazioni">Assegnazioni</Link>
              <Link to="/statistiche">Statistiche</Link>
            </>
          )}
          <span className="nav-user">{user?.Nome} {user?.Cognome} ({user?.Ruolo})</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
