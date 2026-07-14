import bcrypt from 'bcryptjs';
import pool from './config/database';

const seed = async () => {
  try {
    console.log('Inizializzazione del database...');

    await pool.execute('DROP TABLE IF EXISTS assegnazioni_corsi');
    await pool.execute('DROP TABLE IF EXISTS corsi_academy');
    await pool.execute('DROP TABLE IF EXISTS utenti');

    await pool.execute(`
      CREATE TABLE utenti (
        UtenteID INT AUTO_INCREMENT PRIMARY KEY,
        Nome VARCHAR(100) NOT NULL,
        Cognome VARCHAR(100) NOT NULL,
        Email VARCHAR(255) NOT NULL UNIQUE,
        Password VARCHAR(255) NOT NULL,
        Ruolo VARCHAR(50) NOT NULL DEFAULT 'dipendente',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE corsi_academy (
        CorsoID INT AUTO_INCREMENT PRIMARY KEY,
        Titolo VARCHAR(200) NOT NULL,
        Descrizione TEXT,
        Categoria VARCHAR(100) NOT NULL,
        DurataOre INT NOT NULL,
        Obbligatorio BOOLEAN DEFAULT FALSE,
        Attivo BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE assegnazioni_corsi (
        AssegnazioneID INT AUTO_INCREMENT PRIMARY KEY,
        CorsoID INT NOT NULL,
        DipendenteID INT NOT NULL,
        DataAssegnazione DATE NOT NULL DEFAULT (CURRENT_DATE),
        DataScadenza DATE NOT NULL,
        Stato VARCHAR(20) NOT NULL DEFAULT 'Assegnato',
        DataCompletamento DATE DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (CorsoID) REFERENCES corsi_academy(CorsoID) ON DELETE RESTRICT,
        FOREIGN KEY (DipendenteID) REFERENCES utenti(UtenteID) ON DELETE RESTRICT
      )
    `);

    console.log('Tabelle create con successo');

    const password = await bcrypt.hash('password123', 10);

    await pool.execute(
      'INSERT INTO utenti (Nome, Cognome, Email, Password, Ruolo) VALUES (?, ?, ?, ?, ?)',
      ['Marco', 'Rossi', 'marco.rossi@azienda.com', password, 'referente']
    );
    await pool.execute(
      'INSERT INTO utenti (Nome, Cognome, Email, Password, Ruolo) VALUES (?, ?, ?, ?, ?)',
      ['Laura', 'Bianchi', 'laura.bianchi@azienda.com', password, 'dipendente']
    );
    await pool.execute(
      'INSERT INTO utenti (Nome, Cognome, Email, Password, Ruolo) VALUES (?, ?, ?, ?, ?)',
      ['Andrea', 'Verdi', 'andrea.verdi@azienda.com', password, 'dipendente']
    );
    await pool.execute(
      'INSERT INTO utenti (Nome, Cognome, Email, Password, Ruolo) VALUES (?, ?, ?, ?, ?)',
      ['Sofia', 'Neri', 'sofia.neri@azienda.com', password, 'dipendente']
    );

    console.log('Utenti inseriti con successo');

    await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Sicurezza sul Lavoro - Base', 'Corso obbligatorio sulla sicurezza generale in ambiente lavorativo, conforme al D.Lgs. 81/08.', 'Sicurezza', 8, true, true]
    );
    await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Privacy e GDPR', 'Gestione dei dati personali e conformità al Regolamento Europeo 2016/679.', 'Normativa', 4, true, true]
    );
    await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Excel Avanzato', 'Funzioni avanzate, tabelle pivot, macro e automazione con VBA.', 'Informatica', 16, false, true]
    );
    await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Comunicazione Efficace', 'Tecniche di comunicazione interpersonale e public speaking.', 'Soft Skills', 12, false, true]
    );
    await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Leadership e Team Management', 'Gestione dei team, delega, motivazione e crescita professionale.', 'Management', 20, false, true]
    );
    await pool.execute(
      'INSERT INTO corsi_academy (Titolo, Descrizione, Categoria, DurataOre, Obbligatorio, Attivo) VALUES (?, ?, ?, ?, ?, ?)',
      ['Antincendio - Livello 1', 'Corso base antincendio per rischio basso, aggiornamento obbligatorio.', 'Sicurezza', 4, true, false]
    );

    console.log('Corsi inseriti con successo');

    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    const fmt = (d: Date) => d.toISOString().split('T')[0];

    const subDays = (days: number) => { const d = new Date(); d.setDate(d.getDate() - days); return fmt(d); };
    const addDays = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); return fmt(d); };

    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato, DataCompletamento) VALUES (?, ?, ?, ?, ?, ?)',
      [1, 2, subDays(60), subDays(30), 'Completato', subDays(35)]
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato, DataCompletamento) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 2, subDays(45), subDays(15), 'Completato', subDays(20)]
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [3, 2, subDays(20), addDays(20), 'Assegnato']
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [4, 2, subDays(10), addDays(50), 'Assegnato']
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [1, 3, subDays(30), addDays(10), 'Assegnato']
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato, DataCompletamento) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 3, subDays(60), subDays(30), 'Completato', subDays(32)]
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [5, 3, subDays(5), addDays(55), 'Assegnato']
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [3, 4, subDays(15), addDays(25), 'Assegnato']
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [4, 4, subDays(40), subDays(5), 'Scaduto']
    );
    await pool.execute(
      'INSERT INTO assegnazioni_corsi (CorsoID, DipendenteID, DataAssegnazione, DataScadenza, Stato) VALUES (?, ?, ?, ?, ?)',
      [1, 4, subDays(25), addDays(5), 'Annullato']
    );

    console.log('Assegnazioni inserite con successo');

    console.log('Seed completato!');
    console.log('---');
    console.log('Utenti creati (password: password123):');
    console.log('  - marco.rossi@azienda.com (referente)');
    console.log('  - laura.bianchi@azienda.com (dipendente)');
    console.log('  - andrea.verdi@azienda.com (dipendente)');
    console.log('  - sofia.neri@azienda.com (dipendente)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
