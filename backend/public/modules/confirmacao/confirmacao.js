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

async function handleConfirmacao(event) {
  event.preventDefault();
  const f = event.target;

  const email = f.email?.value?.trim();
  const codigo = f.codigo?.value?.trim();

  if (!email || !codigo) {
    setMessageConfirm("Informe e-mail e código.", "error");
    return;
  }

  setMessageConfirm("Validando código...", "info");

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/confirmar-codigo`, { email, codigo });

    if (!ok || !data.sucesso) {
      setMessageConfirm(data.erro || `Erro ao confirmar (HTTP ${status}).`, "error");
      return;
    }

    setMessageConfirm("E-mail confirmado com sucesso!", "success");
  } catch {
    setMessageConfirm("Erro interno ao confirmar.", "error");
  }
}

async function handleReenviar() {
  const email = document.getElementById("confEmail")?.value?.trim();
  if (!email) {
    setMessageConfirm("Digite o e-mail primeiro.", "error");
    return;
  }

  setMessageConfirm("Reenviando...", "info");

  const { ok, data, status } = await postJSON(`${API_BASE}/reenviar-confirmacao`, { email });

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
