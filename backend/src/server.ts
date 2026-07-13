import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/utenti', authRoutes);

/*
  TODO: Aggiungere le route business in base al documento d'esame.
  Esempio:
  import rimborsiRoutes from './routes/rimborsi';
  app.use('/api/rimborsi', rimborsiRoutes);
*/

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files
const frontendDist = path.join(__dirname, '../../dist');
app.use(express.static(frontendDist, {
  maxAge: '7d',
  etag: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.gif') || filePath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    }
  },
}));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend server in ascolto sulla porta ${PORT}`);
});
