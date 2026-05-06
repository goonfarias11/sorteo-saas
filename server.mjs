import express from 'express';
import cors from 'cors';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(process.cwd()));

app.post('/api/import-instagram', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL requerida' });
  }

  if (!process.env.IG_USERNAME || !process.env.IG_PASSWORD) {
    return res.status(500).json({ error: 'Faltan credenciales IG_USERNAME e IG_PASSWORD' });
  }

  const py = spawn('python3', [
    join(process.cwd(), 'instagram_fetcher.py'),
    url,
    process.env.IG_USERNAME,
    process.env.IG_PASSWORD,
  ]);

  let data = '';
  let err = '';

  py.stdout.on('data', chunk => data += chunk.toString());
  py.stderr.on('data', chunk => err += chunk.toString());

  py.on('close', code => {
    if (code !== 0) {
      return res.status(500).json({ error: err || 'Error importando comentarios' });
    }

    try {
      const participants = JSON.parse(data);
      res.json({ participants, count: participants.length });
    } catch {
      res.status(500).json({ error: 'Respuesta inválida de Instagram' });
    }
  });
});

app.get('*', (_, res) => {
  res.send(readFileSync(join(process.cwd(), 'index.html'), 'utf8'));
});

app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
