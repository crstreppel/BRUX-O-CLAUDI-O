/*
  api.js
  Wrapper HTTP padrão do frontend
  Correção PBQE-C: injeção de token tokenPetropolitan no header Authorization
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
    // resposta sem JSON
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      ...data
    };
  }

  return {
    ok: true,
    ...data
  };
}

window.apiFetch = apiFetch;