// PBQE-C • API Fetch Wrapper (sem throw para erro de negócio)

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    data = {};
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      ...data
    };
  }

  return { ok: true, ...data };
}

window.apiFetch = apiFetch;
