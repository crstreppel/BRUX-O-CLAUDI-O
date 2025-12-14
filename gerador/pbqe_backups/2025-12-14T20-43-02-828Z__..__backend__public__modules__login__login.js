// PBQE-C • Login usando sessionStorage (padrão oficial)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.querySelector('#loginEmail');
    const senhaInput = document.querySelector('#loginSenha');

    if (!emailInput || !senhaInput) {
      alert('Campos de login não encontrados no HTML.');
      return;
    }

    const email = emailInput.value;
    const senha = senhaInput.value;

    try {
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        alert(data.erro || 'Erro no login');
        return;
      }

      // 🔐 PADRÃO PBQE-C — sessionStorage
      sessionStorage.setItem('tokenPetropolitan', data.token);
      sessionStorage.setItem('usuarioPetropolitan', JSON.stringify(data.usuario));

      window.location.href = '/painel/index.html';

    } catch (err) {
      alert('Erro de conexão com o servidor');
    }
  });
});
