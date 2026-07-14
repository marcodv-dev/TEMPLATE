import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ inCorso: 0, completati: 0, scaduti: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user?.Ruolo === 'dipendente') {
          const res = await api.get('/assegnazioni-corsi');
          const data = res.data as any[];
          setStats({
            inCorso: data.filter((a: any) => a.Stato === 'Assegnato').length,
            completati: data.filter((a: any) => a.Stato === 'Completato').length,
            scaduti: data.filter((a: any) => a.Stato === 'Scaduto').length,
          });
        }
      } catch { }
    };
    loadStats();
  }, [user]);

  if (user?.Ruolo === 'referente') {
    return (
      <div className="dashboard-container">
        <h1>Benvenuto, {user.Nome}!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Pannello di gestione Academy
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/corsi" className="btn btn-primary" style={{ padding: '2rem', textAlign: 'center', flexDirection: 'column', fontSize: '1rem' }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#128218;</span>
            Gestione Corsi
          </Link>
          <Link to="/assegnazioni" className="btn btn-primary" style={{ padding: '2rem', textAlign: 'center', flexDirection: 'column', fontSize: '1rem' }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#128203;</span>
            Assegnazioni
          </Link>
          <Link to="/statistiche" className="btn btn-primary" style={{ padding: '2rem', textAlign: 'center', flexDirection: 'column', fontSize: '1rem' }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>&#128200;</span>
            Statistiche
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Benvenuto, {user?.Nome}!</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        La tua area formativa
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--purple-light)' }}>{stats.inCorso}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In corso</div>
        </div>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6ee7b7' }}>{stats.completati}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completati</div>
        </div>
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fca5a5' }}>{stats.scaduti}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scaduti</div>
        </div>
      </div>

      <Link to="/mie-assegnazioni" className="btn btn-primary">
        Vedi i miei corsi
      </Link>
    </div>
  );
};

export default Dashboard;
