import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.get('/', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      'SELECT UtenteID, Nome, Cognome, Email FROM utenti WHERE Ruolo = ? ORDER BY Cognome ASC, Nome ASC',
      ['dipendente']
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
