// PBQE-C • Login integrado ao Session Manager (fluxo robusto)
// Hardening Essencial (PBQE-SEC-001):
// - Mensagens seguras (sem innerHTML vindo do servidor)
// - Tratamento correto de erros do apiFetch (que lança exceção em !response.ok)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const msgEl = document.getElementById('msgLogin');

  function clearMsg() {
    if (!msgEl) return;
    msgEl.textContent = '';
    msgEl.style.display = 'none';
    // limpa qualquer conteúdo extra
    while (msgEl.firstChild) msgEl.removeChild(msgEl.firstChild);
  }

  function showText(text) {
    if (!msgEl) return;
    clearMsg();
    msgEl.textContent = text;
    msgEl.style.display = 'block';
  }

  function showEmailNaoVerificado() {
    if (!msgEl) return;
    clearMsg();
    msgEl.style.display = 'block';

    const p1 = document.createElement('div');
    p1.textContent = 'Seu e-mail ainda não foi confirmado.';
    msgEl.appendChild(p1);

    msgEl.appendChild(document.createElement('br'));

    const a1 = document.createElement('a');
    a1.href = '/modules/confirmacao/confirmacao.html';
    a1.textContent = 'Confirmar e-mail';

    const sep = document.createTextNode(' | ');

    const a2 = document.createElement('a');
    a2.href = '/modules/confirmacao/confirmacao.html#reenviar';
    a2.textContent = 'Reenviar código';

    msgEl.appendChild(a1);
    msgEl.appendChild(sep);
    msgEl.appendChild(a2);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg();

    const email = document.querySelector('#loginEmail')?.value;
    const senha = document.querySelector('#loginSenha')?.value;

    if (!email || !senha) {
      showText('Email e senha obrigatórios');
      return;
    }

    let data = null;

    try {
      data = await apiFetch('/api/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });
    } catch (err) {
      // apiFetch lança Error('API_ERROR') com err.payload quando response !ok
      const payload = err && err.payload ? err.payload : null;

      if (payload && payload.motivo === 'EMAIL_NAO_VERIFICADO') {
        showEmailNaoVerificado();
        return;
      }

      if (payload && (payload.erro || payload.mensagem)) {
        showText(payload.erro || payload.mensagem);
        return;
      }

      // fallback
      showText('Erro no login');
      return;
    }

    // login bem-sucedido
    if (!data || !data.token || !data.usuario) {
      showText('Login inválido');
      return;
    }

    Session.setSession({ token: data.token, usuario: data.usuario });

    // PBQE-C: decisão explícita de perfil pós-login (hardcoded temporário)
    // Para o usuário atual: Sócio + Super_Admin
    if (typeof decidirDestinoPosLogin === 'function') {
      decidirDestinoPosLogin(['SOCIO', 'SUPER_ADMIN']);
      return;
    }

    // Fallback seguro
    window.location.href = '/painel/index.html';
  });
});
