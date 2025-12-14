const API_BASE = "/api/usuarios";

function setMessageCadastro(msg, type = "info") {
  const el = document.getElementById("msgCadastro");
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

async function handleCadastro(event) {
  event.preventDefault();
  const f = event.target;

  const usuario = f.usuario?.value?.trim();
  const email = f.email?.value?.trim();
  const senha = f.senha?.value || "";
  const confirma = f.confirmaSenha?.value || "";

  if (!usuario || !email || !senha || !confirma) {
    setMessageCadastro("Preencha todos os campos.", "error");
    return;
  }

  if (senha !== confirma) {
    setMessageCadastro("As senhas não conferem.", "error");
    return;
  }

  setMessageCadastro("Enviando dados...", "info");

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/cadastrar`, {
      usuario, email, senha
    });

    if (!ok) {
      setMessageCadastro(data.erro || `Erro ao cadastrar (HTTP ${status}).`, "error");
      return;
    }

    setMessageCadastro("Conta criada! Verifique seu e-mail.", "success");
    f.reset();
  } catch {
    setMessageCadastro("Erro interno ao cadastrar.", "error");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  if (form) form.addEventListener("submit", handleCadastro);
});
