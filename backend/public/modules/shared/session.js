// PBQE-C • Gerenciador de Sessão Frontend
const Session = (() => {
  const TOKEN_KEY = 'tokenPetropolitan';
  const USER_KEY = 'usuarioPetropolitan';

  function sanitizeLegacyStorage() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
  }

  function setSession({ token, usuario }) {
    sanitizeLegacyStorage();
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
  }

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  function getUsuario() {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function isLogado() {
    return !!getToken();
  }

  function requireAuth({ redirectTo = '/modules/login/login.html' } = {}) {
    if (!isLogado()) {
      window.location.href = redirectTo;
    }
  }

  function logout({ redirectTo = '/modules/login/login.html' } = {}) {
    sessionStorage.clear();
    sanitizeLegacyStorage();
    window.location.href = redirectTo;
  }

  return {
    setSession,
    getToken,
    getUsuario,
    isLogado,
    requireAuth,
    logout
  };
})();

window.Session = Session;
