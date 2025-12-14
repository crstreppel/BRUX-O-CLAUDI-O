// PBQE-C • Login integrado ao Session Manager
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#loginEmail')?.value;
    const senha = document.querySelector('#loginSenha')?.value;

    if (!email || !senha) {
      alert('Email e senha obrigatórios');
      return;
    }

    try {
      const data = await apiFetch('/api/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });

      if (!data?.token || !data?.usuario) {
        alert('Login inválido');
        return;
      }

      Session.setSession({ token: data.token, usuario: data.usuario });
      window.location.href = '/painel/index.html';

    } catch (err) {
      alert(err?.erro || 'Erro no login');
    }
  });
});
