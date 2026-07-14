import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import AssegnazioneForm from './AssegnazioneForm';

const AssegnazioniList = () => {
  const [assegnazioni, setAssegnazioni] = useState<any[]>([]);
  const [filtroStato, setFiltroStato] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDipendente, setFiltroDipendente] = useState('');
  const [dipendenti, setDipendenti] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editAssegnazione, setEditAssegnazione] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const carica = async () => {
    try {
      const params: any = {};
      if (filtroStato) params.stato = filtroStato;
      if (filtroCategoria) params.categoria = filtroCategoria;
      if (filtroDipendente) params.dipendente = filtroDipendente;
      const res = await api.get('/assegnazioni-corsi', { params });
      setAssegnazioni(res.data);
    } catch { }
  };

  useEffect(() => {
    carica();
    api.get('/dipendenti').then(r => setDipendenti(r.data)).catch(() => {});
  }, []);

  useEffect(() => { carica(); }, [filtroStato, filtroCategoria, filtroDipendente]);

  const annulla = async (id: number) => {
    if (!window.confirm('Annullare questa assegnazione?')) return;
    try {
      await api.put(`/assegnazioni-corsi/${id}/annulla`);
      setSuccess('Assegnazione annullata');
      carica();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore');
    }
  };

  const badgeStato = (stato: string) => {
    const colors: Record<string, string> = {
      Assegnato: 'rgba(59,130,246,0.2)',
      Completato: 'rgba(16,185,129,0.2)',
      Scaduto: 'rgba(239,68,68,0.2)',
      Annullato: 'rgba(100,100,100,0.2)',
    };
    const textColors: Record<string, string> = {
      Assegnato: '#93c5fd',
      Completato: '#6ee7b7',
      Scaduto: '#fca5a5',
      Annullato: '#999',
    };
    return { background: colors[stato] || '', color: textColors[stato] || '' };
  };

  return (
    <div className="dashboard-container">
      <h1>Gestione Assegnazioni</h1>

      {(error || success) && (
        <div className="toast-container">
          {error && <div className="toast toast-error">{error}</div>}
          {success && <div className="toast toast-success">{success}</div>}
        </div>
      )}

      <div className="filtri-section">
        <div className="filtri-form">
          <div className="form-group">
            <label>Stato</label>
            <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)}>
              <option value="">Tutti</option>
              <option value="Assegnato">Assegnato</option>
              <option value="Completato">Completato</option>
              <option value="Scaduto">Scaduto</option>
              <option value="Annullato">Annullato</option>
            </select>
          </div>
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
            <label>Dipendente</label>
            <select value={filtroDipendente} onChange={e => setFiltroDipendente(e.target.value)}>
              <option value="">Tutti</option>
              {dipendenti.map((d: any) => (
                <option key={d.UtenteID} value={d.UtenteID}>{d.Nome} {d.Cognome}</option>
              ))}
            </select>
          </div>
          <div className="filtri-actions">
            <button className="btn btn-primary btn-sm" onClick={() => { setEditAssegnazione(null); setShowForm(true); }}>
              + Nuova Assegnazione
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Dipendente</th>
              <th>Corso</th>
              <th>Categoria</th>
              <th>Assegnato il</th>
              <th>Scadenza</th>
              <th>Stato</th>
              <th>Completato il</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {assegnazioni.length === 0 && (
              <tr><td colSpan={8} className="text-center">Nessuna assegnazione trovata</td></tr>
            )}
            {assegnazioni.map(a => (
              <tr key={a.AssegnazioneID}>
                <td>{a.DipendenteNome} {a.DipendenteCognome}</td>
                <td><strong>{a.CorsoTitolo}</strong></td>
                <td><span className="badge" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--purple-light)' }}>{a.Categoria}</span></td>
                <td>{formatDate(a.DataAssegnazione)}</td>
                <td>{formatDate(a.DataScadenza)}</td>
                <td><span className="badge" style={badgeStato(a.Stato)}>{a.Stato}</span></td>
                <td>{formatDate(a.DataCompletamento)}</td>
                <td className="actions-cell">
                  <button className="btn btn-sm btn-primary" onClick={() => { setEditAssegnazione(a); setShowForm(true); }}>Modifica</button>
                  {a.Stato !== 'Annullato' && a.Stato !== 'Completato' && (
                    <button className="btn btn-sm btn-danger" onClick={() => annulla(a.AssegnazioneID)}>Annulla</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AssegnazioneForm
          assegnazione={editAssegnazione}
          dipendenti={dipendenti}
          onClose={() => { setShowForm(false); setEditAssegnazione(null); }}
          onSave={() => { setShowForm(false); setEditAssegnazione(null); carica(); setSuccess(editAssegnazione ? 'Assegnazione aggiornata' : 'Corso assegnato con successo'); }}
          onError={(msg: string) => setError(msg)}
        />
      )}
    </div>
  );
};

export default AssegnazioniList;
