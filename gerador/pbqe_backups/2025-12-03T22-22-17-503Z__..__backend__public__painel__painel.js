// ======================================================================
// 🧙‍♂️ painel.js • Painel Central PBQE-C V2
// ----------------------------------------------------------------------
// Versão inicial: foco em navegação e preparação para leitura do usuário
// logado no futuro (via sessão, token ou endpoint dedicado).
// ======================================================================

document.addEventListener('DOMContentLoaded', () => {
  const userEl = document.getElementById('dashboardUser');
  const statusEl = document.getElementById('dashboardStatus');
  const btnLogout = document.getElementById('btnLogout');

  // Placeholder: no futuro vamos ler o usuário logado de um endpoint
  // (/api/usuarios/me) ou de um token salvo com segurança.
  try {
    const storedUser = sessionStorage.getItem('usuarioAtual') || localStorage.getItem('usuarioAtual');
    if (storedUser) {
      userEl.textContent = storedUser;
    } else {
      userEl.textContent = 'Usuário autenticado';
    }
  } catch (e) {
    console.warn('Não foi possível ler usuário do storage:', e);
    userEl.textContent = 'Usuário autenticado';
  }

  if (statusEl) {
    statusEl.textContent = 'Painel carregado com sucesso. Módulo Usuários V2 ativo.';
  }

  // Navegação dos cards
  document.querySelectorAll('[data-href]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });

  // Logout básico (placeholder)
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      try {
        sessionStorage.removeItem('usuarioAtual');
        localStorage.removeItem('usuarioAtual');
      } catch (e) {
        console.warn('Erro ao limpar storage no logout:', e);
      }
      window.location.href = '/modules/usuarios/login.html';
    });
  }
});
