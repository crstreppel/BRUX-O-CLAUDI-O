// Trecho para inserir no final do login (usuarios.js)
if (resultado.sucesso) {
  sessionStorage.setItem('usuarioAtual', email);
  window.location.href = '/painel';
}
