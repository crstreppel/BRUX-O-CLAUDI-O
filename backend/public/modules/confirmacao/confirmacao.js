const API_BASE = "/api/usuarios";

function setMessageConfirm(msg, type = "info") {
  const el = document.getElementById("msgConfirmacao");
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

function getUsuarioId() {
  return sessionStorage.getItem("usuarioId");
}

async function handleConfirmacao(event) {
  event.preventDefault();

  const usuarioId = getUsuarioId();
  const codigo = document.getElementById("confCodigo")?.value?.trim();

  if (!usuarioId || !codigo) {
    setMessageConfirm("Código inválido ou sessão expirada.", "error");
    return;
  }

  setMessageConfirm("Validando código...", "info");

  try {
    const { ok, data, status } = await postJSON(
      `${API_BASE}/confirmar-codigo`,
      { usuarioId, codigo }
    );

    if (!ok || !data.sucesso) {
      setMessageConfirm(data.erro || `Erro ao confirmar (HTTP ${status}).`, "error");
      return;
    }

    setMessageConfirm("E-mail confirmado com sucesso!", "success");

    setTimeout(() => {
      window.location.href = "/modules/login/login.html";
    }, 1500);

  } catch {
    setMessageConfirm("Erro interno ao confirmar.", "error");
  }
}

async function handleReenviar() {
  const usuarioId = getUsuarioId();

  if (!usuarioId) {
    setMessageConfirm("Sessão expirada. Refaça o cadastro.", "error");
    return;
  }

  setMessageConfirm("Reenviando código...", "info");

  const { ok, data, status } = await postJSON(
    `${API_BASE}/reenviar-confirmacao`,
    { usuarioId }
  );

  if (!ok || !data.sucesso) {
    setMessageConfirm(data.erro || `Falha no reenvio (HTTP ${status}).`, "error");
    return;
  }

  setMessageConfirm("Código reenviado! Verifique seu e-mail.", "success");
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formConfirmar");
  if (form) form.addEventListener("submit", handleConfirmacao);

  const btn = document.getElementById("btnReenviar");
  if (btn) btn.addEventListener("click", handleReenviar);
});
