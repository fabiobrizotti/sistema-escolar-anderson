const API_BASE = '/api';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  let data;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const mensagem = (data && data.erro) || 'Erro na requisicao.';
    throw new Error(mensagem);
  }

  return data;
}

const api = {
  get: (path) =>
    fetch(`${API_BASE}${path}`).then(handleResponse),

  post: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${API_BASE}${path}`, { method: 'DELETE' }).then(handleResponse),
};

export default api;
