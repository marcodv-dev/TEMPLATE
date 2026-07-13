import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ruolo, setRuolo] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(nome, cognome, email, password, ruolo);
      setSuccess('Registrazione completata! Reindirizzamento al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la registrazione');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Registrati</h1>
        {(error || success) && (
          <div className="toast-container">
            {error && <div className="toast toast-error">{error}</div>}
            {success && <div className="toast toast-success">{success}</div>}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Cognome</label>
            <input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {/*
            TODO: Modificare le opzioni del ruolo in base al documento d'esame.
            Esempio:
          */}
          <div className="form-group">
            <label>Ruolo</label>
            <select value={ruolo} onChange={(e) => setRuolo(e.target.value)}>
              <option value="user">Utente</option>
              <option value="admin">Amministratore</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Registrati</button>
        </form>
        <p className="auth-link">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
