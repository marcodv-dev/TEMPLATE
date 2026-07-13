-- ============================================================
-- TODO: Sostituire 'nome_database' con il nome del database
--       richiesto dal documento d'esame.
-- ============================================================
CREATE DATABASE IF NOT EXISTS nome_database;
USE nome_database;

-- ============================================================
-- TODO: Creare le tabelle secondo il modello dati del documento.
-- ============================================================
--
-- Esempio tabella utenti (sempre necessaria per l'auth):
-- CREATE TABLE IF NOT EXISTS utenti (
--   UtenteID INT AUTO_INCREMENT PRIMARY KEY,
--   Nome VARCHAR(100) NOT NULL,
--   Cognome VARCHAR(100) NOT NULL,
--   Email VARCHAR(255) NOT NULL UNIQUE,
--   Password VARCHAR(255) NOT NULL,
--   Ruolo VARCHAR(50) NOT NULL DEFAULT 'user',
--   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );
