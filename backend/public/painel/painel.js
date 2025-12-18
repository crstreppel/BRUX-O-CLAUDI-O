document.addEventListener('DOMContentLoaded', () => {
  Session.requireAuth();

  const usuario = Session.getUsuario();
  const elNome = document.querySelector('#usuario-nome');
  if (elNome && usuario) {
    elNome.textContent = usuario.nome || usuario.email;
  }

  const btnSair = document.querySelector('#btn-sair');
  if (btnSair) btnSair.addEventListener('click', () => Session.logout());

  const navMap = {
    login: '/modules/login/login.html',
    roles: '/modules/roles/roles.html',
    permissoes: '/modules/permissoes/permissoes.html'
  };

  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-nav');
      if (navMap[key]) window.location.href = navMap[key];
    });
  });
});