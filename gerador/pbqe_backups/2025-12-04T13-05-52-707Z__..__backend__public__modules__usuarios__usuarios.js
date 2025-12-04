// ======================================================================
// 🧙‍♂️ usuarios.js • PBQE-C V2 Clean Light – Fluxo de Autenticação
// ----------------------------------------------------------------------
// Responsável por:
// - Cadastro de usuário
// - Login
// - Confirmação de e-mail por token e por código
// - Reenvio de e-mail de confirmação
// - Navegação entre telas de autenticação
// ======================================================================

const API_BASE = '/api/usuarios';

// Utilitário de mensagens
function setMessage(elementId, message, type = 'info') {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message || '';
  el.className = 'auth-message ' + (message ? `is-${type}` : '');
}

// Utilitário de POST JSON
async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

// ----------------------------------------------------------------------
// Cadastro
// ----------------------------------------------------------------------
async function handleCadastro(event) {
  event.preventDefault();

  const form = event.target;
  const usuario = form.usuario?.value?.trim();
  const email = form.email?.value?.trim();
  const senha = form.senha?.value || '';
  const confirmaSenha = form.confirmaSenha?.value || '';

  if (!usuario || !email || !senha || !confirmaSenha) {
    setMessage('msgCadastro', 'Preencha todos os campos.', 'error');
    return;
  }

  if (senha !== confirmaSenha) {
    setMessage('msgCadastro', 'As senhas não conferem.', 'error');
    return;
  }

  setMessage('msgCadastro', 'Enviando dados...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/cadastrar`, {
      usuario,
      email,
      senha
    });

    if (!ok) {
      setMessage('msgCadastro', data.erro || `Erro ao cadastrar (HTTP ${status}).`, 'error');
      return;
    }

    setMessage(
      'msgCadastro',
      data.mensagem || 'Usuário criado! Verifique o e-mail para confirmar o acesso.',
      'success'
    );

    // Guarda algumas infos para debug/uso futuro
    if (data.email && data.codigo) {
      try {
        localStorage.setItem('ultimoEmailConfirmacao', data.email);
        localStorage.setItem('ultimoCodigoConfirmacao', data.codigo);
      } catch (e) {
        console.warn('Não foi possível salvar dados de confirmação no storage:', e);
      }
    }

    form.reset();
  } catch (error) {
    console.error('Erro no cadastro:', error);
    setMessage('msgCadastro', 'Erro interno ao cadastrar usuário.', 'error');
  }
}

// ----------------------------------------------------------------------
// Login
// ----------------------------------------------------------------------
async function handleLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email?.value?.trim();
  const senha = form.senha?.value || '';

  if (!email || !senha) {
    setMessage('msgLogin', 'Informe e-mail e senha.', 'error');
    return;
  }

  setMessage('msgLogin', 'Autenticando...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/login`, {
      email,
      senha
    });

    if (!ok) {
      setMessage('msgLogin', data.erro || `Falha no login (HTTP ${status}).`, 'error');
      return;
    }

    if (!data.sucesso) {
      setMessage('msgLogin', data.erro || 'Não foi possível autenticar.', 'error');
      return;
    }

    if (!data.emailVerificado) {
      setMessage(
        'msgLogin',
        'E-mail ainda não confirmado. Verifique sua caixa de entrada.',
        'warning'
      );
      return;
    }

    // Login OK → salvar usuário atual e redirecionar para o painel
    try {
      const emailNorm = email.trim().toLowerCase();
      sessionStorage.setItem('usuarioAtual', emailNorm);
    } catch (e) {
      console.warn('Não foi possível salvar usuarioAtual no sessionStorage:', e);
    }

    setMessage('msgLogin', 'Login efetuado com sucesso! Redirecionando...', 'success');
    window.location.href = '/painel';
  } catch (error) {
    console.error('Erro no login:', error);
    setMessage('msgLogin', 'Erro interno ao autenticar.', 'error');
  }
}

// ----------------------------------------------------------------------
// Confirmação de e-mail por token (link da simulação)
// ----------------------------------------------------------------------
async function confirmarEmailPorToken(token) {
  if (!token) {
    setMessage('msgConfirmacao', 'Token inválido.', 'error');
    return;
  }

  setMessage('msgConfirmacao', 'Confirmando e-mail...', 'info');

  try {
    const response = await fetch(
      `${API_BASE}/confirmar-email?token=${encodeURIComponent(token)}`
    );
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.sucesso) {
      setMessage(
        'msgConfirmacao',
        data.erro || `Erro ao confirmar e-mail (HTTP ${response.status}).`,
        'error'
      );
      return;
    }

    setMessage(
      'msgConfirmacao',
      'E-mail confirmado com sucesso! Agora você já pode fazer login.',
      'success'
    );
  } catch (error) {
    console.error('Erro ao confirmar e-mail:', error);
    setMessage('msgConfirmacao', 'Erro interno ao confirmar e-mail.', 'error');
  }
}

// ----------------------------------------------------------------------
// Confirmação por código + reenvio
// ----------------------------------------------------------------------
async function handleConfirmacaoCodigo(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email?.value?.trim();
  const codigo = form.codigo?.value?.trim();

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

    if (!ok || !data.sucesso) {
      setMessage(
        'msgConfirmacao',
        data.erro || `Erro ao confirmar (HTTP ${status}).`,
        'error'
      );
      return;
    }

    setMessage(
      'msgConfirmacao',
      'E-mail confirmado com sucesso! Agora você pode fazer login.',
      'success'
    );
  } catch (error) {
    console.error('Erro na confirmação por código:', error);
    setMessage('msgConfirmacao', 'Erro interno ao confirmar código.', 'error');
  }
}

async function handleReenvio(event) {
  event.preventDefault?.();

  const emailInput = document.getElementById('emailConfirmacao');
  const email = emailInput?.value?.trim();

  if (!email) {
    setMessage('msgConfirmacao', 'Informe o e-mail para reenviar o código.', 'error');
    return;
  }

  setMessage('msgConfirmacao', 'Reenviando e-mail de confirmação...', 'info');

  try {
    const { ok, data, status } = await postJSON(`${API_BASE}/reenviar-confirmacao`, {
      email
    });

    if (!ok || !data.sucesso) {
      setMessage(
        'msgConfirmacao',
        data.erro || `Erro ao reenviar (HTTP ${status}).`,
        'error'
      );
      return;
    }

    setMessage(
      'msgConfirmacao',
      data.mensagem || 'E-mail reenviado com sucesso. Verifique sua caixa de entrada.',
      'success'
    );
  } catch (error) {
    console.error('Erro no reenvio de e-mail:', error);
    setMessage('msgConfirmacao', 'Erro interno ao reenviar e-mail.', 'error');
  }
}

// ----------------------------------------------------------------------
// Navegação entre telas de autenticação
// ----------------------------------------------------------------------
function setupNavigation() {
  document.querySelectorAll('[data-nav-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav-target');
      if (!target) return;

      document.querySelectorAll('[data-auth-view]').forEach((view) => {
        if (view.getAttribute('data-auth-view') === target) {
          view.classList.remove('is-hidden');
        } else {
          view.classList.add('is-hidden');
        }
      });
    });
  });
}

// ----------------------------------------------------------------------
// Inicialização
// ----------------------------------------------------------------------
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

  // Se existir token na URL da página de confirmação, tenta confirmar automaticamente
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    confirmarEmailPorToken(token);
  }

  setupNavigation();
});
