import { useState, useEffect, type FormEvent } from 'react';
import api from '../services/api';

interface Props {
  assegnazione: any;
  dipendenti: any[];
  onClose: () => void;
  onSave: () => void;
  onError: (msg: string) => void;
}

const AssegnazioneForm = ({ assegnazione, dipendenti, onClose, onSave, onError }: Props) => {
  const [CorsoID, setCorsoID] = useState(assegnazione?.CorsoID?.toString() || '');
  const [DipendenteID, setDipendenteID] = useState(assegnazione?.DipendenteID?.toString() || '');
  const [DataScadenza, setDataScadenza] = useState(assegnazione?.DataScadenza || '');
  const [corsi, setCorsi] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/corsi', { params: { attivo: 'true' } })
      .then(r => setCorsi(r.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!CorsoID) { onError('Seleziona un corso'); return; }
    if (!DipendenteID) { onError('Seleziona un dipendente'); return; }

    setLoading(true);
    try {
      if (assegnazione) {
        await api.put(`/assegnazioni-corsi/${assegnazione.AssegnazioneID}`, { DataScadenza });
      } else {
        await api.post('/assegnazioni-corsi', {
          CorsoID: Number(CorsoID),
          DipendenteID: Number(DipendenteID),
          DataScadenza
        });
      }
      onSave();
    } catch (err: any) {
      onError(err.response?.data?.error || 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{assegnazione ? 'Modifica Assegnazione' : 'Nuova Assegnazione'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Corso</label>
            <select value={CorsoID} onChange={e => setCorsoID(e.target.value)} required /* disabled={!!assegnazione} */>
              <option value="">Seleziona corso</option>
              {corsi.map((c: any) => (
                <option key={c.CorsoID} value={c.CorsoID}>{c.Titolo} ({c.Categoria})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Dipendente</label>
            <select value={DipendenteID} onChange={e => setDipendenteID(e.target.value)} required /* disabled={!!assegnazione} */>
              <option value="">Seleziona dipendente</option>
              {dipendenti.map((d: any) => (
                <option key={d.UtenteID} value={d.UtenteID}>{d.Nome} {d.Cognome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Data Scadenza</label>
            <input type="date" value={DataScadenza} onChange={e => setDataScadenza(e.target.value)} required />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvataggio...' : (assegnazione ? 'Aggiorna' : 'Assegna')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssegnazioneForm;
