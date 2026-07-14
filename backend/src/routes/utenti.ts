import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      'SELECT UtenteID, Nome, Cognome, Email, Ruolo FROM utenti WHERE UtenteID = ?',
      [req.user!.UtenteID]
    );
    const items = rows as any[];
    if (items.length === 0) { res.status(404).json({ error: 'Utente non trovato' }); return; }
    res.json(items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
