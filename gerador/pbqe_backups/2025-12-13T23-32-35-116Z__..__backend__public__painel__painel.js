// ==============================
// PBQE-C • Guard de Sessão (Hulk)
// ==============================
function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("usuarioAtual");

  // limpa legado/qualquer resíduo
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  localStorage.removeItem("usuarioAtual");
}

function redirectToLogin() {
  window.location.href = "/modules/login/login.html";
}

function getToken() {
  return sessionStorage.getItem("token");
}

function base64UrlToBase64(str) {
  return (str || "").replace(/-/g, "+").replace(/_/g, "/");
}

function decodeJwtPayload(token) {
  try {
    const parts = (token || "").split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const json = atob(base64UrlToBase64(payload));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return false; // se não tem exp, não dá pra afirmar que expirou
  return Date.now() >= payload.exp * 1000;
}

// Helper padrão PBQE-C: injeta Bearer + trata 401 global
async function apiFetch(url, options = {}) {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearSession();
    redirectToLogin();
    throw new Error("Sessão inválida (token ausente/expirado).");
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    clearSession();
    redirectToLogin();
  }

  return response;
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    clearSession();
    redirectToLogin();
    return;
  }

  // Carrega usuário salvo (ou tenta extrair do JWT)
  let usuario = null;
  try {
    usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");
  } catch {
    usuario = null;
  }

  if (!usuario) {
    usuario = decodeJwtPayload(token);
    if (usuario) {
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    }
  }

  const dashboardUser = document.getElementById("dashboardUser");
  if (dashboardUser) {
    dashboardUser.textContent = usuario?.email || usuario?.usuario || "Usuário";
  }

  // NÃO é o foco desse chat, mas não vamos deixar o botão piorar o caos.
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      redirectToLogin();
    });
  }

  // Teste Hulk: tenta bater em rota protegida (se existir).
  // 401 -> cai pro login. 404 -> ignora (rota pode não existir ainda).
  try {
    const resp = await apiFetch("/api/usuarios", { method: "GET" });
    if (resp.status === 404) return;
  } catch {
    // silencioso de propósito
  }
});

// expõe helper pra outros scripts do painel se quiserem usar
window.pbqeApiFetch = apiFetch;
