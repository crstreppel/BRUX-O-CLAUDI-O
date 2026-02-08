/*
  api.js
  Wrapper HTTP padrão do frontend
  Correção PBQE-C: retorno do JSON cru (sem envelope)
*/

async function apiFetch(url, options = {}) {
  const token = sessionStorage.getItem('tokenPetropolitan');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error('API_ERROR');
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

window.apiFetch = apiFetch;
