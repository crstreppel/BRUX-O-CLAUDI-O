const API_BASE = "/api/usuarios";

// ==============================
// PBQE-C • Sessão JWT (Hulk Mode)
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

function setSession({ token, usuario }) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("usuario", JSON.stringify(usuario || null));

  // mata o "logado fantasma" antigo
  sessionStorage.removeItem("usuarioAtual");
  localStorage.removeItem("usuarioAtual");
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

function redirectToPainel() {
  window.location.href = "/painel";
}

function setMessageLogin(msg, type = "info") {
  const el = document.getElementById("msgLogin");
  if (!el) return;
  el.textContent = msg || "";
  el.className = "auth-message " + (msg ? `is-${type}` : "");
}

async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {})
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email?.value?.trim();
  const senha = form.senha?.value || "";

  if (!email || !senha) {
    setMessageLogin("Informe e-mail e senha.", "error");
    return;
  }

  setMessageLogin("Autenticando...", "info");

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/login`, { email, senha });

    if (!ok) {
      setMessageLogin(data.erro || `Falha no login (HTTP ${status}).`, "error");
      return;
    }

    // Backend real: { mensagem, usuario: payload, token }  (sem 'sucesso' e sem 'emailVerificado')
    if (!data || !data.token) {
      setMessageLogin("Resposta inválida do servidor (token ausente).", "error");
      return;
    }

    setSession({ token: data.token, usuario: data.usuario || null });

    setMessageLogin("Login efetuado! Redirecionando...", "success");
    redirectToPainel();
  } catch {
    setMessageLogin("Erro interno ao autenticar.", "error");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Se já tem token válido, nem perde tempo no login
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    redirectToPainel();
    return;
  }

  // Se tá expirado, limpa tudo e segue
  if (token && isTokenExpired(token)) {
    clearSession();
  }

  const form = document.getElementById("formLogin");
  if (form) form.addEventListener("submit", handleLogin);
});
