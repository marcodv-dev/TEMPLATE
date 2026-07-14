import { useState, type FormEvent } from 'react';
import api from '../services/api';

interface Props {
  corso: any;
  onClose: () => void;
  onSave: () => void;
  onError: (msg: string) => void;
}

const CorsoForm = ({ corso, onClose, onSave, onError }: Props) => {
  const [Titolo, setTitolo] = useState(corso?.Titolo || '');
  const [Descrizione, setDescrizione] = useState(corso?.Descrizione || '');
  const [Categoria, setCategoria] = useState(corso?.Categoria || 'Sicurezza');
  const [DurataOre, setDurataOre] = useState(corso?.DurataOre?.toString() || '');
  const [Obbligatorio, setObbligatorio] = useState(corso?.Obbligatorio ? true : false);
  const [Attivo, setAttivo] = useState(corso?.Attivo !== undefined ? corso.Attivo : true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!Titolo.trim()) { onError('Il titolo è obbligatorio'); return; }
    if (!DurataOre || Number(DurataOre) <= 0) { onError('La durata deve essere maggiore di zero'); return; }

    setLoading(true);
    try {
      if (corso) {
        await api.put(`/corsi/${corso.CorsoID}`, { Titolo, Descrizione, Categoria, DurataOre: Number(DurataOre), Obbligatorio, Attivo });
      } else {
        await api.post('/corsi', { Titolo, Descrizione, Categoria, DurataOre: Number(DurataOre), Obbligatorio });
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
        <h2>{corso ? 'Modifica Corso' : 'Nuovo Corso'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titolo</label>
            <input type="text" value={Titolo} onChange={e => setTitolo(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Descrizione</label>
            <textarea rows={3} value={Descrizione} onChange={e => setDescrizione(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select value={Categoria} onChange={e => setCategoria(e.target.value)} required>
              <option value="Sicurezza">Sicurezza</option>
              <option value="Normativa">Normativa</option>
              <option value="Informatica">Informatica</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Management">Management</option>
            </select>
          </div>
          <div className="form-group">
            <label>Durata (ore)</label>
            <input type="number" min="1" value={DurataOre} onChange={e => setDurataOre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" checked={Obbligatorio} onChange={e => setObbligatorio(e.target.checked)} style={{ width: 'auto', marginRight: '0.5rem' }} />
              Obbligatorio
            </label>
          </div>
          {corso && (
            <div className="form-group">
              <label>
                <input type="checkbox" checked={Attivo} onChange={e => setAttivo(e.target.checked)} style={{ width: 'auto', marginRight: '0.5rem' }} />
                Attivo
              </label>
            </div>
          )}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvataggio...' : (corso ? 'Aggiorna' : 'Crea')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annulla</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CorsoForm;
