import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.get('/academy', authenticate, requireRole('referente'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let sql = `
      SELECT
        DATE_FORMAT(a.DataAssegnazione, '%Y-%m') AS mese,
        c.Categoria,
        COUNT(*) AS numeroAssegnazioni,
        SUM(CASE WHEN a.Stato = 'Completato' THEN 1 ELSE 0 END) AS numeroCompletamenti
      FROM assegnazioni_corsi a
      JOIN corsi_academy c ON a.CorsoID = c.CorsoID
      WHERE 1=1
    `;
    const params: any[] = [];

    if (req.query.mese) {
      sql += ' AND DATE_FORMAT(a.DataAssegnazione, ?) = ?';
      const meseStr = String(req.query.mese);
      if (meseStr.length === 7) {
        params.push('%Y-%m', meseStr);
      } else {
        res.status(400).json({ error: 'Formato mese non valido. Usare YYYY-MM' });
        return;
      }
    }
    if (req.query.categoria) {
      sql += ' AND c.Categoria = ?';
      params.push(req.query.categoria);
    }
    if (req.query.dipendente) {
      sql += ' AND a.DipendenteID = ?';
      params.push(req.query.dipendente);
    }
    if (req.query.data_da) {
      sql += ' AND a.DataAssegnazione >= ?';
      params.push(req.query.data_da);
    }
    if (req.query.data_a) {
      sql += ' AND a.DataAssegnazione <= ?';
      params.push(req.query.data_a);
    }

    sql += ' GROUP BY mese, c.Categoria ORDER BY mese DESC, c.Categoria ASC';

    const [rows] = await pool.execute(sql, params);
    const result = (rows as any[]).map(r => ({
      mese: r.mese,
      categoria: r.Categoria,
      numeroAssegnazioni: r.numeroAssegnazioni,
      numeroCompletamenti: r.numeroCompletamenti,
      percentualeCompletamento: r.numeroAssegnazioni > 0
        ? Math.round((r.numeroCompletamenti / r.numeroAssegnazioni) * 10000) / 100
        : 0
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default router;
