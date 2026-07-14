import { useEffect, useState } from 'react';
import api from '../services/api';

const Statistiche = () => {
  const [dati, setDati] = useState<any[]>([]);
  const [dipendenti, setDipendenti] = useState<any[]>([]);
  const [filtroMese, setFiltroMese] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroDipendente, setFiltroDipendente] = useState('');
  const [filtroDataDa, setFiltroDataDa] = useState('');
  const [filtroDataA, setFiltroDataA] = useState('');

  const carica = async () => {
    try {
      const params: any = {};
      if (filtroMese) params.mese = filtroMese;
      if (filtroCategoria) params.categoria = filtroCategoria;
      if (filtroDipendente) params.dipendente = filtroDipendente;
      if (filtroDataDa) params.data_da = filtroDataDa;
      if (filtroDataA) params.data_a = filtroDataA;

      const res = await api.get('/statistiche/academy', { params });
      setDati(res.data);
    } catch { }
  };

  useEffect(() => {
    api.get('/dipendenti').then(r => setDipendenti(r.data)).catch(() => {});
    carica();
  }, []);

  useEffect(() => { carica(); }, [filtroMese, filtroCategoria, filtroDipendente, filtroDataDa, filtroDataA]);

  return (
    <div className="dashboard-container">
      <h1>Statistiche Academy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Riepilogo corsi assegnati e completati per mese e categoria
      </p>

      <div className="filtri-section">
        <div className="filtri-form">
          <div className="form-group">
            <label>Mese (YYYY-MM)</label>
            <input type="month" value={filtroMese} onChange={e => setFiltroMese(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Da data</label>
            <input type="date" value={filtroDataDa} onChange={e => setFiltroDataDa(e.target.value)} />
          </div>
          <div className="form-group">
            <label>A data</label>
            <input type="date" value={filtroDataA} onChange={e => setFiltroDataA(e.target.value)} />
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
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Mese</th>
              <th>Categoria</th>
              <th>Assegnati</th>
              <th>Completati</th>
              <th>% Completamento</th>
              <th>Barra</th>
            </tr>
          </thead>
          <tbody>
            {dati.length === 0 && (
              <tr><td colSpan={6} className="text-center">Nessun dato disponibile</td></tr>
            )}
            {dati.map((d, i) => (
              <tr key={i}>
                <td>{d.mese}</td>
                <td><span className="badge" style={{ background: 'rgba(139,92,246,0.2)', color: 'var(--purple-light)' }}>{d.categoria}</span></td>
                <td>{d.numeroAssegnazioni}</td>
                <td>{d.numeroCompletamenti}</td>
                <td><strong>{d.percentualeCompletamento}%</strong></td>
                <td>
                  <div className="bar-chart">
                    <div className="bar-fill" style={{ width: `${d.percentualeCompletamento}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistiche;
