/*
  FILE TEMPLATE per le route CRUD business.
  Copia questo file, rinominalo in base all'entità (es. rimborsi.ts, eventi.ts, etc.)
  e implementa i metodi secondo il documento d'esame.
  
  Pattern tipico:
  1. Import Router, Request, Response da express
  2. Import pool (database) e middleware (authenticate, requireRole)
  3. Import AuthRequest per accedere a req.user
  4. Definire le route
  5. Esportare il router
*/

import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// ============================================================
// TODO: Implementare le route secondo il documento d'esame.
// ============================================================
//
// Esempi:
//
// GET /api/entita - Elenco (con filtri opzionali)
// router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const [rows] = await pool.execute('SELECT * FROM entita');
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Errore interno del server' });
//   }
// });
//
// GET /api/entita/:id - Dettaglio
// router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const [rows] = await pool.execute('SELECT * FROM entita WHERE id = ?', [req.params.id]);
//     const items = rows as any[];
//     if (items.length === 0) { res.status(404).json({ error: 'Non trovato' }); return; }
//     res.json(items[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Errore interno del server' });
//   }
// });
//
// POST /api/entita - Creazione (con validazione)
// router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { campo1, campo2 } = req.body;
//     if (!campo1) { res.status(400).json({ error: 'campo1 obbligatorio' }); return; }
//     const [result] = await pool.execute('INSERT INTO entita (campo1, campo2) VALUES (?, ?)', [campo1, campo2]);
//     res.status(201).json({ id: (result as any).insertId, message: 'Creato con successo' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Errore interno del server' });
//   }
// });
//
// PUT /api/entita/:id - Modifica
// router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { campo1, campo2 } = req.body;
//     await pool.execute('UPDATE entita SET campo1 = ?, campo2 = ? WHERE id = ?', [campo1, campo2, req.params.id]);
//     res.json({ message: 'Aggiornato con successo' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Errore interno del server' });
//   }
// });
//
// DELETE /api/entita/:id - Eliminazione
// router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     await pool.execute('DELETE FROM entita WHERE id = ?', [req.params.id]);
//     res.json({ message: 'Eliminato con successo' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Errore interno del server' });
//   }
// });
//
// Route protetta per soli admin:
// router.put('/:id/approva', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     await pool.execute('UPDATE entita SET stato = ? WHERE id = ?', ['approvato', req.params.id]);
//     res.json({ message: 'Approvato con successo' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Errore interno del server' });
//   }
// });

export default router;
