const API_BASE = "/api/usuarios";

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

    if (!data.sucesso) {
      setMessageLogin(data.erro || "Não foi possível autenticar.", "error");
      return;
    }

    if (!data.emailVerificado) {
      setMessageLogin("E-mail não confirmado. Verifique seu e-mail.", "warn");
      return;
    }

    sessionStorage.setItem("usuarioAtual", email.toLowerCase());
    setMessageLogin("Login efetuado! Redirecionando...", "success");
    window.location.href = "/painel";
  } catch {
    setMessageLogin("Erro interno ao autenticar.", "error");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  if (form) form.addEventListener("submit", handleLogin);
});
