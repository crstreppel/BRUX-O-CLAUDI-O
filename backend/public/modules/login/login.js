
// PBQE-C • Login integrado ao Session Manager (fluxo robusto)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const msgEl = document.getElementById('msgLogin');

  function setMsg(html) {
    if (!msgEl) return;
    msgEl.innerHTML = html;
    msgEl.style.display = 'block';
  }

  function clearMsg() {
    if (!msgEl) return;
    msgEl.innerHTML = '';
    msgEl.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg();

    const email = document.querySelector('#loginEmail')?.value;
    const senha = document.querySelector('#loginSenha')?.value;

    if (!email || !senha) {
      setMsg('Email e senha obrigatórios');
      return;
    }

    const data = await apiFetch('/api/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });

    if (data.ok === false) {
      if (data.motivo === 'EMAIL_NAO_VERIFICADO') {
        setMsg(
          'Seu e-mail ainda não foi confirmado.<br><br>' +
          '<a href="/modules/confirmacao/confirmacao.html">Confirmar e-mail</a>' +
          ' | ' +
          '<a href="/modules/confirmacao/confirmacao.html#reenviar">Reenviar código</a>'
        );
        return;
      }

      setMsg(data.erro || data.mensagem || 'Erro no login');
      return;
    }

    if (!data.token || !data.usuario) {
      setMsg('Login inválido');
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
