import bcrypt from 'bcryptjs';
import pool from './config/database';

const seed = async () => {
  try {
    console.log('Inizializzazione del database...');

    // ============================================================
    // TODO: Drop delle tabelle esistenti (ordine inverso per FK)
    // ============================================================
    // await pool.execute('DROP TABLE IF EXISTS ...');
    // await pool.execute('DROP TABLE IF EXISTS utenti');

    // ============================================================
    // TODO: Creazione delle tabelle in base al modello dati
    // ============================================================
    // await pool.execute(`CREATE TABLE utenti ( ... )`);
    // await pool.execute(`CREATE TABLE entita ( ... )`);

    console.log('Tabelle create con successo');

    const password = await bcrypt.hash('password123', 10);

    // ============================================================
    // TODO: Inserimento utenti di test
    // ============================================================
    // await pool.execute(
    //   'INSERT INTO utenti (Nome, Cognome, Email, Password, Ruolo) VALUES (?, ?, ?, ?, ?)',
    //   ['Mario', 'Rossi', 'mario.rossi@azienda.com', password, 'user']
    // );

    console.log('Utenti inseriti con successo');

    // ============================================================
    // TODO: Inserimento dati di test per le entità business
    // ============================================================

    console.log('Seed completato!');
    console.log('---');
    console.log('Utenti creati (password: password123):');
    // console.log('  - utente@demo.com (user)');
    // console.log('  - admin@demo.com (admin)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
