// PBQE-C • API Fetch Centralizado
async function apiFetch(url, options = {}) {
  const token = Session.getToken();

  const headers = Object.assign({}, options.headers || {}, {
    'Content-Type': 'application/json'
  });

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    Session.logout();
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

window.apiFetch = apiFetch;
