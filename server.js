const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'results.json');

function loadResults() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveResults(results) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
}

async function runOsintQuery({ type, value }) {
  const googleQuery = encodeURIComponent(`${type}:${value}`);

  return {
    target: { type, value },
    timestamp: new Date().toISOString(),
    sources: [
      {
        name: 'Google',
        url: `https://www.google.com/search?q=${googleQuery}`,
        note: 'Consulta pública (respeta TOS).'
      }
    ],
    legal_notice: 'Solo información pública. Respeta leyes y privacidad.'
  };
}

app.post('/api/osint', async (req, res) => {
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ error: 'type y value son obligatorios.' });
  }

  const result = await runOsintQuery({ type, value });

  const results = loadResults();
  results.push(result);
  saveResults(results);

  res.json(result);
});

app.get('/api/results', (req, res) => {
  res.json(loadResults());
});

app.listen(3000, () => console.log('Backend OSINT activo'));
