import { useEffect, useState } from 'react';
import api from '../services/api';
import CorsoForm from './CorsoForm';

const CorsiList = () => {
  const [corsi, setCorsi] = useState<any[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAttivo, setFiltroAttivo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCorso, setEditCorso] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carica = async () => {
    try {
      const params: any = {};
      if (filtroCategoria) params.categoria = filtroCategoria;
      if (filtroAttivo !== '') params.attivo = filtroAttivo;
      const res = await api.get('/corsi', { params });
      setCorsi(res.data);
    } catch { }
  };

  useEffect(() => { carica(); }, [filtroCategoria, filtroAttivo]);

  const elimina = async (id: number, titolo: string) => {
    if (!window.confirm(`Eliminare il corso "${titolo}"?`)) return;
    try {
      await api.delete(`/corsi/${id}`);
      setSuccess('Corso eliminato con successo');
      carica();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante l\'eliminazione');
    }
  };

  const disattiva = async (id: number) => {
    try {
      await api.put(`/corsi/${id}/disattiva`);
      setSuccess('Corso disattivato con successo');
      carica();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore durante la disattivazione');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Catalogo Corsi</h1>

      {(error || success) && (
        <div className="toast-container">
          {error && <div className="toast toast-error">{error}</div>}
          {success && <div className="toast toast-success">{success}</div>}
        </div>
      )}

      <div className="filtri-section">
        <div className="filtri-form">
          <div className="form-group">
            <label>Categoria</label>
            <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
              <option value="">Tutte</option>
              <option value="Sicurezza">Sicurezza</option>
              <option value="Normativa">Normativa</option>
              <option value="Informatica">Informatica</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div className="form-group">
            <label>Stato</label>
            <select value={filtroAttivo} onChange={e => setFiltroAttivo(e.target.value)}>
              <option value="">Tutti</option>
              <option value="true">Attivi</option>
              <option value="false">Non attivi</option>
            </select>
          </div>
          <div className="filtri-actions">
            <button className="btn btn-primary btn-sm" onClick={() => { setEditCorso(null); setShowForm(true); }}>
              + Nuovo Corso
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Titolo</th>
              <th>Categoria</th>
              <th>Durata (h)</th>
              <th>Obbligatorio</th>
              <th>Attivo</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {corsi.length === 0 && (
              <tr><td colSpan={6} className="text-center">Nessun corso trovato</td></tr>
            )}
            {corsi.map(c => (
              <tr key={c.CorsoID}>
                <td><strong>{c.Titolo}</strong></td>
                <td><span className="badge" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--purple-light)' }}>{c.Categoria}</span></td>
                <td>{c.DurataOre}h</td>
                <td>{c.Obbligatorio ? <span className="badge" style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>Sì</span> : 'No'}</td>
                <td>{c.Attivo ? <span className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#6ee7b7' }}>Attivo</span> : <span className="badge" style={{ background: 'rgba(100,100,100,0.2)', color: '#999' }}>Non attivo</span>}</td>
                <td className="actions-cell">
                  <button className="btn btn-sm btn-primary" onClick={() => { setEditCorso(c); setShowForm(true); }}>Modifica</button>
                  {c.Attivo && <label htmlFor="">a</label>}
                  {c.Attivo && <button className="btn btn-sm btn-secondary" onClick={() => disattiva(c.CorsoID)}>Disattiva</button>}
                  <button className="btn btn-sm btn-danger" onClick={() => elimina(c.CorsoID, c.Titolo)}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <CorsoForm
          corso={editCorso}
          onClose={() => { setShowForm(false); setEditCorso(null); }}
          onSave={() => { setShowForm(false); setEditCorso(null); carica(); setSuccess(editCorso ? 'Corso aggiornato' : 'Corso creato'); }}
          onError={(msg: string) => setError(msg)}
        />
      )}
    </div>
  );
};

export default CorsiList;
