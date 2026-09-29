const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function headersAutenticados(extras = {}) {
  const token = localStorage.getItem('token');
  return token ? { ...extras, Authorization: `Bearer ${token}` } : extras;
}

async function handleResponse(response) {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    if (window.location.pathname !== '/login') window.location.href = '/login';
  }
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
    fetch(`${API_BASE}${path}`, { headers: headersAutenticados() }).then(handleResponse),

  post: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: headersAutenticados({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      headers: headersAutenticados({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: headersAutenticados() }).then(handleResponse),
};

export default api;
