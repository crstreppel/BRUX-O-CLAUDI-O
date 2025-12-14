// PBQE-C • Guard + Logout usando sessionStorage
document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('tokenPetropolitan');

  if (!token) {
    window.location.href = '/modules/login/login.html';
    return;
  }

  const btnSair = document.querySelector('#btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      sessionStorage.clear();
      window.location.href = '/modules/login/login.html';
    });
  }
});
