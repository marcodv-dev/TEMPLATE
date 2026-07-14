import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let sql = 'SELECT * FROM corsi_academy WHERE 1=1';
    const params: any[] = [];

    if (req.query.categoria) {
      sql += ' AND Categoria = ?';
      params.push(req.query.categoria);
    }
    if (req.query.attivo !== undefined) {
      sql += ' AND Attivo = ?';
      params.push(req.query.attivo === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY Titolo ASC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute('SELECT * FROM corsi_academy WHERE CorsoID = ?', [req.params.id]);
    const items = rows as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Corso non trovato' }); return; }
    res.json(items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.post('/', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { Titolo, Descrizione, Categoria, DurataOre, Obbligatorio } = req.body;

    if (!Titolo || !Titolo.trim()) { res.status(400).json({ error: 'Il titolo del corso è obbligatorio' }); return; }
    if (!Categoria || !Categoria.trim()) { res.status(400).json({ error: 'La categoria è obbligatoria' }); return; }
    if (!DurataOre || Number(DurataOre) <= 0) { res.status(400).json({ error: 'La durata deve essere maggiore di zero' }); return; }

    const [result] = await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio) VALUES (?, ?, ?, ?, ?)',
      [Titolo.trim(), Descrizione || '', Categoria.trim(), Number(DurataOre), Obbligatorio ? 1 : 0]
    );
    res.status(201).json({ CorsoID: (result as any).insertId, message: 'Corso creato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.put('/:id', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo } = req.body;

    if (Titolo !== undefined && !Titolo.trim()) { res.status(400).json({ error: 'Il titolo non può essere vuoto' }); return; }
    if (Categoria !== undefined && !Categoria.trim()) { res.status(400).json({ error: 'La categoria non può essere vuota' }); return; }
    if (DurataOre !== undefined && Number(DurataOre) <= 0) { res.status(400).json({ error: 'La durata deve essere maggiore di zero' }); return; }

    const [existing] = await pool.execute('SELECT * FROM corsi_academy WHERE CorsoID = ?', [req.params.id]);
    const items = existing as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Corso non trovato' }); return; }

    await pool.execute(
      'UPDATE corsi_academy SET Titolo = ?, Descrizione = ?, Categoria = ?, DurataOre = ?, Obbligatorio = ?, Attivo = ? WHERE CorsoID = ?',
      [
        Titolo !== undefined ? Titolo.trim() : items[0].Titolo,
        Descrizione !== undefined ? Descrizione : items[0].Descrizione,
        Categoria !== undefined ? Categoria.trim() : items[0].Categoria,
        DurataOre !== undefined ? Number(DurataOre) : items[0].DurataOre,
        Obbligatorio !== undefined ? (Obbligatorio ? 1 : 0) : items[0].Obbligatorio,
        Attivo !== undefined ? (Attivo ? 1 : 0) : items[0].Attivo,
        req.params.id
      ]
    );
    res.json({ message: 'Corso aggiornato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.delete('/:id', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [assegnazioni] = await pool.execute('SELECT COUNT(*) AS cnt FROM assegnazioni_corsi WHERE CorsoID = ?', [req.params.id]);
    const cnt = (assegnazioni as any[])[0].cnt;
    if (cnt > 0) {
      res.status(400).json({ error: 'Impossibile eliminare il corso: ha assegnazioni collegate' });
      return;
    }
    await pool.execute('DELETE FROM corsi_academy WHERE CorsoID = ?', [req.params.id]);
    res.json({ message: 'Corso eliminato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

router.put('/:id/disattiva', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [existing] = await pool.execute('SELECT * FROM corsi_academy WHERE CorsoID = ?', [req.params.id]);
    const items = existing as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Corso non trovato' }); return; }

    await pool.execute('UPDATE corsi_academy SET Attivo = 0 WHERE CorsoID = ?', [req.params.id]);
    res.json({ message: 'Corso disattivato con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
