// ======================================================================
// 🧙‍♂️ usuarios.js • PBQE-C V2 Clean Light – Fluxo de Autenticação
// ----------------------------------------------------------------------
const API_BASE = '/api/usuarios';

function setMessage(elementId, message, type = 'info') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message || '';
  el.className = 'auth-message ' + (message ? `is-${type}` : '');
}

async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

// ------------------------- Cadastro -----------------------------------
async function handleCadastro(event) {
  event.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const senha2 = document.getElementById('senha2').value;

  if (!usuario || !email || !senha || !senha2) {
    setMessage('msgCadastro', 'Preencha todos os campos.', 'error');
    return;
  }
  if (senha !== senha2) {
    setMessage('msgCadastro', 'As senhas não conferem.', 'error');
    return;
  }

  setMessage('msgCadastro', 'Cadastrando usuário...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/cadastrar`, {
      usuario,
      email,
      senha
    });

    if (!ok) {
      setMessage('msgCadastro', data.erro || `Erro no cadastro (HTTP ${status}).`, 'error');
      return;
    }

    setMessage('msgCadastro', 'Usuário criado! Verifique o e-mail para confirmar o acesso.', 'success');
  } catch (error) {
    console.error('Erro no cadastro:', error);
    setMessage('msgCadastro', 'Erro interno ao cadastrar usuário.', 'error');
  }
}

// ------------------------- Login --------------------------------------
async function handleLogin(event) {
  event.preventDefault();
  const usuario = document.getElementById('loginUsuario').value.trim();
  const senha = document.getElementById('loginSenha').value;

  if (!usuario || !senha) {
    setMessage('msgLogin', 'Informe usuário e senha.', 'error');
    return;
  }

  setMessage('msgLogin', 'Validando credenciais...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/login`, {
      usuario,
      senha
    });

    if (!ok) {
      if (status === 401 && data.motivo === 'EMAIL_NAO_VERIFICADO') {
        setMessage('msgLogin', 'E-mail ainda não confirmado. Use a opção de confirmação.', 'warn');
        return;
      }
      setMessage('msgLogin', data.erro || `Falha no login (HTTP ${status}).`, 'error');
      return;
    }

    window.location.href = 'fogo.html';
  } catch (error) {
    console.error('Erro no login:', error);
    setMessage('msgLogin', 'Erro interno ao fazer login.', 'error');
  }
}

// ------------------------- Confirmação por código ---------------------
async function handleConfirmacaoCodigo(event) {
  event.preventDefault();
  const email = document.getElementById('confEmail').value.trim();
  const codigo = document.getElementById('confCodigo').value.trim();

  if (!email || !codigo) {
    setMessage('msgConfirmacao', 'Informe e-mail e código.', 'error');
    return;
  }

  setMessage('msgConfirmacao', 'Validando código...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/confirmar-codigo`, {
      email,
      codigo
    });

    if (!ok) {
      setMessage('msgConfirmacao', data.erro || `Erro ao confirmar (HTTP ${status}).`, 'error');
      return;
    }

    setMessage('msgConfirmacao', 'E-mail confirmado com sucesso! Agora você pode fazer login.', 'success');
  } catch (error) {
    console.error('Erro na confirmação:', error);
    setMessage('msgConfirmacao', 'Erro interno ao confirmar e-mail.', 'error');
  }
}

// ------------------------- Reenvio de confirmação ---------------------
async function handleReenvio() {
  const emailInput = document.getElementById('confEmail');
  if (!emailInput) return;
  const email = emailInput.value.trim();

  if (!email) {
    setMessage('msgConfirmacao', 'Informe o e-mail para reenviar o código.', 'error');
    return;
  }

  setMessage('msgConfirmacao', 'Reenviando código...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/reenviar-confirmacao`, { email });

    if (!ok) {
      setMessage('msgConfirmacao', data.erro || `Erro ao reenviar (HTTP ${status}).`, 'error');
      return;
    }

    setMessage('msgConfirmacao', 'Código reenviado para o e-mail informado.', 'success');
  } catch (error) {
    console.error('Erro no reenvio:', error);
    setMessage('msgConfirmacao', 'Erro interno ao reenviar código.', 'error');
  }
}

// ------------------------- Navegação / UI ------------------------------
function setupNavigation() {
  const btnIrConfirmar = document.getElementById('btnIrConfirmar');
  const btnIrCadastro = document.getElementById('btnIrCadastro');
  const btnAbrirConfirmacao = document.getElementById('btnAbrirConfirmacao');
  const secConfirmacao = document.getElementById('secConfirmacao');

  if (btnIrConfirmar) {
    btnIrConfirmar.addEventListener('click', () => {
      window.location.href = 'usuarios.html';
    });
  }

  if (btnIrCadastro) {
    btnIrCadastro.addEventListener('click', () => {
      window.location.href = 'cadastro.html';
    });
  }

  if (btnAbrirConfirmacao && secConfirmacao) {
    btnAbrirConfirmacao.addEventListener('click', () => {
      secConfirmacao.hidden = !secConfirmacao.hidden;
    });
  }
}

// ------------------------- Inicialização -------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('formCadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', handleCadastro);
  }

  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', handleLogin);
  }

  const formConfirmarCodigo = document.getElementById('formConfirmarCodigo');
  if (formConfirmarCodigo) {
    formConfirmarCodigo.addEventListener('submit', handleConfirmacaoCodigo);
  }

  const btnReenviar = document.getElementById('btnReenviar');
  if (btnReenviar) {
    btnReenviar.addEventListener('click', handleReenvio);
  }

  setupNavigation();
});
