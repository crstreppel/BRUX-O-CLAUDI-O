const API_BASE = "/api/usuarios";

function setMessage(elementId, message, type = "info") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message || "";
  el.className = "auth-message " + (message ? `is-${type}` : "");
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
  const form = event.target;
  const usuario = form.usuario?.value?.trim();
  const email = form.email?.value?.trim();
  const senha = form.senha?.value || "";
  const confirmaSenha = form.confirmaSenha?.value || "";
  if (!usuario || !email || !senha || !confirmaSenha) {
    setMessage("msgCadastro", "Preencha todos os campos.", "error");
    return;
  }
  if (senha !== confirmaSenha) {
    setMessage("msgCadastro", "As senhas não conferem.", "error");
    return;
  }
  setMessage("msgCadastro", "Enviando dados...", "info");
  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/cadastrar`, {
      usuario,
      email,
      senha
    });
    if (!ok) {
      setMessage("msgCadastro", data.erro || `Erro ao cadastrar (HTTP ${status}).`, "error");
      return;
    }
    setMessage("msgCadastro", data.mensagem || "Usuário criado! Verifique o e-mail para confirmar o acesso.", "success");
    if (data.email && data.codigo) {
      try {
        localStorage.setItem("ultimoEmailConfirmacao", data.email);
        localStorage.setItem("ultimoCodigoConfirmacao", data.codigo);
      } catch (e) {}
    }
    form.reset();
  } catch (error) {
    setMessage("msgCadastro", "Erro interno ao cadastrar usuário.", "error");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email?.value?.trim();
  const senha = form.senha?.value || "";
  if (!email || !senha) {
    setMessage("msgLogin", "Informe e-mail e senha.", "error");
    return;
  }
  setMessage("msgLogin", "Autenticando...", "info");
  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/login`, {
      email,
      senha
    });
    if (!ok) {
      setMessage("msgLogin", data.erro || `Falha no login (HTTP ${status}).`, "error");
      return;
    }
    if (!data.sucesso) {
      setMessage("msgLogin", data.erro || "Não foi possível autenticar.", "error");
      return;
    }
    if (!data.emailVerificado) {
      setMessage("msgLogin", "E-mail não confirmado. Verifique sua caixa de entrada.", "warning");
      return;
    }
    try {
      sessionStorage.setItem("usuarioAtual", email.trim().toLowerCase());
    } catch (e) {}
    setMessage("msgLogin", "Login efetuado com sucesso! Redirecionando...", "success");
    window.location.href = "/painel";
  } catch (error) {
    setMessage("msgLogin", "Erro interno ao autenticar.", "error");
  }
}

async function handleConfirmacaoCodigo(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email?.value?.trim();
  const codigo = form.codigo?.value?.trim();
  if (!email || !codigo) {
    setMessage("msgConfirmacao", "Informe e-mail e código.", "error");
    return;
  }
  setMessage("msgConfirmacao", "Validando código...", "info");
  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/confirmar-codigo`, {
      email,
      codigo
    });
    if (!ok || !data.sucesso) {
      setMessage("msgConfirmacao", data.erro || `Erro ao confirmar código (HTTP ${status}).`, "error");
      return;
    }
    setMessage("msgConfirmacao", "E-mail confirmado com sucesso!", "success");
  } catch (error) {
    setMessage("msgConfirmacao", "Erro interno ao confirmar código.", "error");
  }
}

async function handleReenvio() {
  const email = document.getElementById("confEmail")?.value?.trim();
  if (!email) {
    setMessage("msgConfirmacao", "Informe o e-mail para reenviar o código.", "error");
    return;
  }
  setMessage("msgConfirmacao", "Reenviando código...", "info");
  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/reenviar-confirmacao`, { email });
    if (!ok || !data.sucesso) {
      setMessage("msgConfirmacao", data.erro || `Erro ao reenviar código (HTTP ${status}).`, "error");
      return;
    }
    setMessage("msgConfirmacao", "Código reenviado com sucesso! Verifique seu e-mail.", "success");
  } catch (error) {
    setMessage("msgConfirmacao", "Erro interno ao reenviar código.", "error");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const formCadastro = document.getElementById("formCadastro");
  if (formCadastro) formCadastro.addEventListener("submit", handleCadastro);

  const formLogin = document.getElementById("formLogin");
  if (formLogin) formLogin.addEventListener("submit", handleLogin);

  const formConfirmar = document.getElementById("formConfirmarCodigo");
  if (formConfirmar) formConfirmar.addEventListener("submit", handleConfirmacaoCodigo);

  const btnReenviar = document.getElementById("btnReenviar");
  if (btnReenviar) btnReenviar.addEventListener("click", handleReenvio);

  const btnAbrirConfirmacao = document.getElementById("btnAbrirConfirmacao");
  const secConfirmacao = document.getElementById("secConfirmacao");
  if (btnAbrirConfirmacao && secConfirmacao) {
    btnAbrirConfirmacao.addEventListener("click", () => {
      secConfirmacao.hidden = false;
    });
  }
});
