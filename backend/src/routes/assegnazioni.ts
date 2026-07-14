import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

const STATI_VALIDI = ['Assegnato', 'Completato', 'Scaduto', 'Annullato'];

router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let sql = `
      SELECT a.*, c.Titolo AS CorsoTitolo, c.Categoria, c.DurataOre,
             u.Nome AS DipendenteNome, u.Cognome AS DipendenteCognome, u.Email AS DipendenteEmail
      FROM assegnazioni_corsi a
      JOIN corsi_academy c ON a.CorsoID = c.CorsoID
      JOIN utenti u ON a.DipendenteID = u.UtenteID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (req.user!.Ruolo === 'dipendente') {
      sql += ' AND a.DipendenteID = ?';
      params.push(req.user!.UtenteID);
    }

    if (req.query.stato) {
      sql += ' AND a.Stato = ?';
      params.push(req.query.stato);
    }
    if (req.query.categoria) {
      sql += ' AND c.Categoria = ?';
      params.push(req.query.categoria);
    }
    if (req.query.corso) {
      sql += ' AND a.CorsoID = ?';
      params.push(req.query.corso);
    }
    if (req.query.dipendente && req.user!.Ruolo === 'referente') {
      sql += ' AND a.DipendenteID = ?';
      params.push(req.query.dipendente);
    }

    sql += ' ORDER BY a.DataScadenza ASC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sql = `
      SELECT a.*, c.Titolo AS CorsoTitolo, c.Categoria, c.DurataOre, c.Descrizione AS CorsoDescrizione,
             u.Nome AS DipendenteNome, u.Cognome AS DipendenteCognome, u.Email AS DipendenteEmail
      FROM assegnazioni_corsi a
      JOIN corsi_academy c ON a.CorsoID = c.CorsoID
      JOIN utenti u ON a.DipendenteID = u.UtenteID
      WHERE a.AssegnazioneID = ?
    `;
    const [rows] = await pool.execute(sql, [req.params.id]);
    const items = rows as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Assegnazione non trovata' }); return; }

    if (req.user!.Ruolo === 'dipendente' && items[0].DipendenteID !== req.user!.UtenteID) {
      res.status(403).json({ error: 'Non hai accesso a questa assegnazione' });
      return;
    }

    res.json(items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.post('/', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { CorsoID, DipendenteID, DataScadenza } = req.body;

    if (!CorsoID) { res.status(400).json({ error: 'Il corso è obbligatorio' }); return; }
    if (!DipendenteID) { res.status(400).json({ error: 'Il dipendente è obbligatorio' }); return; }

    const [corsi] = await pool.execute('SELECT * FROM corsi_academy WHERE CorsoID = ?', [CorsoID]);
    const corsoArr = corsi as any[];
    if (corsoArr.length === 0) { res.status(400).json({ error: 'Corso non trovato' }); return; }
    if (!corsoArr[0].Attivo) { res.status(400).json({ error: 'Il corso non è attivo e non può essere assegnato' }); return; }

    const [dip] = await pool.execute('SELECT * FROM utenti WHERE UtenteID = ? AND Ruolo = ?', [DipendenteID, 'dipendente']);
    if ((dip as any[]).length === 0) { res.status(400).json({ error: 'Dipendente non trovato' }); return; }

    const oggi = new Date().toISOString().split('T')[0];
    if (DataScadenza && DataScadenza < oggi) {
      res.status(400).json({ error: 'La data di scadenza non può essere precedente alla data di assegnazione' });
      return;
    }

    const [result] = await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza) VALUES (?, ?, ?, ?)',
      [CorsoID, DipendenteID, oggi, DataScadenza || oggi]
    );
    res.status(201).json({ AssegnazioneID: (result as any).insertId, message: 'Corso assegnato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.put('/:id', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { DataScadenza, Stato } = req.body;

    const [rows] = await pool.execute('SELECT * FROM assegnazioni_corsi WHERE AssegnazioneID = ?', [req.params.id]);
    const items = rows as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Assegnazione non trovata' }); return; }

    if (Stato && !STATI_VALIDI.includes(Stato)) {
      res.status(400).json({ error: `Stato non valido. Valori ammessi: ${STATI_VALIDI.join(', ')}` });
      return;
    }

    if (DataScadenza && DataScadenza < items[0].DataAssegnazione) {
      res.status(400).json({ error: 'La data di scadenza non può essere precedente alla data di assegnazione' });
      return;
    }

    await pool.execute(
      'UPDATE assegnazioni_corsi SET DataScadenza = ?, Stato = ? WHERE AssegnazioneID = ?',
      [
        DataScadenza || items[0].DataScadenza,
        Stato || items[0].Stato,
        req.params.id
      ]
    );
    res.json({ message: 'Assegnazione aggiornata con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.put('/:id/completa', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM assegnazioni_corsi WHERE AssegnazioneID = ?', [req.params.id]);
    const items = rows as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Assegnazione non trovata' }); return; }

    if (req.user!.Ruolo === 'dipendente' && items[0].DipendenteID !== req.user!.UtenteID) {
      res.status(403).json({ error: 'Non puoi completare un corso che non ti è stato assegnato' });
      return;
    }

    if (items[0].Stato === 'Completato') {
      res.status(400).json({ error: 'Il corso è già stato completato' });
      return;
    }

    if (items[0].Stato === 'Annullato') {
      res.status(400).json({ error: 'Non puoi completare un corso annullato' });
      return;
    }

    const oggi = new Date().toISOString().split('T')[0];
    if (oggi < items[0].DataAssegnazione) {
      res.status(400).json({ error: 'La data di completamento non può essere precedente alla data di assegnazione' });
      return;
    }

    await pool.execute(
      'UPDATE assegnazioni_corsi SET Stato = ?, DataCompletamento = ? WHERE AssegnazioneID = ?',
      ['Completato', oggi, req.params.id]
    );
    res.json({ message: 'Corso completato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.put('/:id/annulla', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM assegnazioni_corsi WHERE AssegnazioneID = ?', [req.params.id]);
    const items = rows as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Assegnazione non trovata' }); return; }

    await pool.execute(
      'UPDATE assegnazioni_corsi SET Stato = ? WHERE AssegnazioneID = ?',
      ['Annullato', req.params.id]
    );
    res.json({ message: 'Assegnazione annullata con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
