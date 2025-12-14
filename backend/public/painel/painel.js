// PBQE-C • Painel protegido com Session Manager
document.addEventListener('DOMContentLoaded', () => {
  Session.requireAuth();

  const usuario = Session.getUsuario();
  const elNome = document.querySelector('#usuario-nome');

  if (elNome && usuario) {
    elNome.textContent = usuario.nome || usuario.email;
  }

  const btnSair = document.querySelector('#btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', () => Session.logout());
  }
});
