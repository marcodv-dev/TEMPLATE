import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';

const MieAssegnazioni = () => {
  const [assegnazioni, setAssegnazioni] = useState<any[]>([]);
  const [filtroStato, setFiltroStato] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroScadenza, setFiltroScadenza] = useState('');
  const [detail, setDetail] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const carica = async () => {
    try {
      const params: any = {};
      if (filtroStato) params.stato = filtroStato;
      if (filtroCategoria) params.categoria = filtroCategoria;
      const res = await api.get('/assegnazioni-corsi', { params });
      let data = res.data as any[];
      if (filtroScadenza === 'scaduti') {
        data = data.filter(a => a.Stato === 'Scaduto');
      } else if (filtroScadenza === 'in_scadenza') {
        const tra30 = new Date();
        tra30.setDate(tra30.getDate() + 30);
        data = data.filter(a => a.Stato === 'Assegnato' && new Date(a.DataScadenza) <= tra30);
      }
      setAssegnazioni(data);
    } catch { }
  };

  useEffect(() => { carica(); }, [filtroStato, filtroCategoria, filtroScadenza]);

  const completa = async (id: number) => {
    if (!window.confirm('Segnare questo corso come completato?')) return;
    try {
      await api.put(`/assegnazioni-corsi/${id}/completa`);
      setSuccess('Corso completato con successo!');
      setDetail(null);
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

  if (detail) {
    return (
      <div className="dashboard-container">
        <button className="btn btn-sm btn-secondary" onClick={() => setDetail(null)} style={{ marginBottom: '1rem' }}>
          &larr; Indietro
        </button>
        <h1>{detail.CorsoTitolo}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
          <div><strong>Categoria:</strong> {detail.Categoria}</div>
          <div><strong>Durata:</strong> {detail.DurataOre}h</div>
            <div><strong>Assegnato il:</strong> {formatDate(detail.DataAssegnazione)}</div>
            <div><strong>Scadenza:</strong> {formatDate(detail.DataScadenza)}</div>
          <div>
            <strong>Stato:</strong>{' '}
            <span className="badge" style={badgeStato(detail.Stato)}>{detail.Stato}</span>
          </div>
          {detail.DataCompletamento && <div><strong>Completato il:</strong> {formatDate(detail.DataCompletamento)}</div>}
        </div>
        {detail.CorsoDescrizione && (
          <div style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
            <strong>Descrizione:</strong>
            <p style={{ marginTop: '0.5rem' }}>{detail.CorsoDescrizione}</p>
          </div>
        )}
        {detail.Stato === 'Assegnato' && (
          <button className="btn btn-primary" onClick={() => completa(detail.AssegnazioneID)}>Segna come completato</button>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>I Miei Corsi</h1>

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
            <label>Scadenza</label>
            <select value={filtroScadenza} onChange={e => setFiltroScadenza(e.target.value)}>
              <option value="">Tutte</option>
              <option value="in_scadenza">In scadenza (30gg)</option>
              <option value="scaduti">Scaduti</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Corso</th>
              <th>Categoria</th>
              <th>Durata</th>
              <th>Assegnato il</th>
              <th>Scadenza</th>
              <th>Stato</th>
              <th>Completato il</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assegnazioni.length === 0 && (
              <tr><td colSpan={8} className="text-center">Nessun corso assegnato</td></tr>
            )}
            {assegnazioni.map(a => (
              <tr key={a.AssegnazioneID}>
                <td><strong>{a.CorsoTitolo}</strong></td>
                <td><span className="badge" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--purple-light)' }}>{a.Categoria}</span></td>
                <td>{a.DurataOre}h</td>
                <td>{formatDate(a.DataAssegnazione)}</td>
                <td style={{ color: a.Stato === 'Scaduto' ? '#fca5a5' : 'inherit' }}>{formatDate(a.DataScadenza)}</td>
                <td><span className="badge" style={badgeStato(a.Stato)}>{a.Stato}</span></td>
                <td>{formatDate(a.DataCompletamento)}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => setDetail(a)}>Dettaglio</button>
                  {a.Stato === 'Assegnato' && (
                    <button className="btn btn-sm btn-primary" onClick={() => completa(a.AssegnazioneID)} style={{ marginLeft: '0.4rem' }}>Completa</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MieAssegnazioni;
