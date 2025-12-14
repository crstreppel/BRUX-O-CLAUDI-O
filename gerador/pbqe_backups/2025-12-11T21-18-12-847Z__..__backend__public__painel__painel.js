// painel.js atualizado com proteção client-side
document.addEventListener('DOMContentLoaded', () => {
  const storedUser = sessionStorage.getItem('usuarioAtual') || localStorage.getItem('usuarioAtual');
  if (!storedUser) {
    return window.location.href = '/modules/usuarios/login.html';
  }

  const userEl = document.getElementById('dashboardUser');
  if (userEl) userEl.textContent = storedUser;

  const statusEl = document.getElementById('dashboardStatus');
  if (statusEl) statusEl.textContent = 'Painel carregado com sucesso. Segurança PBQE-C ativa.';

  document.querySelectorAll('[data-href]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = btn.getAttribute('data-href');
    });
  });

  document.getElementById('btnLogout')?.addEventListener('click', () => {
    sessionStorage.removeItem('usuarioAtual');
    localStorage.removeItem('usuarioAtual');
    window.location.href = '/modules/usuarios/login.html';
  });
});
