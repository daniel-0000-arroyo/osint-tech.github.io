const form = document.getElementById('osint-form');
const resultsEl = document.getElementById('results');
const downloadBtn = document.getElementById('download-json');

// Cambia esta URL por la de tu backend en Render
const API_BASE = 'https://tu-backend.onrender.com';

let lastResult = null;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const payload = {
    type: formData.get('type'),
    value: formData.get('value')
  };

  resultsEl.textContent = 'Buscando...';
  downloadBtn.style.display = 'none';

  try {
    const res = await fetch(`${API_BASE}/api/osint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    lastResult = data;

    resultsEl.textContent = JSON.stringify(data, null, 2);
    downloadBtn.style.display = 'block';

  } catch (err) {
    resultsEl.textContent = 'Error al consultar la API.';
  }
});

// Descargar JSON
downloadBtn.addEventListener('click', () => {
  if (!lastResult) return;

  const blob = new Blob([JSON.stringify(lastResult, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `osint_result_${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
});
