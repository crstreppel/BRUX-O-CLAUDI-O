async function cadastrarUsuario() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  const resp = await fetch('/usuarios/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (resp.ok) {
    alert('Usuário cadastrado!');
    window.location.href = 'login.html';
  } else {
    alert('Erro ao cadastrar');
  }
}

async function logarUsuario() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  const resp = await fetch('/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });

  if (resp.ok) {
    window.location.href = 'fogo.html';
  } else {
    alert('Usuário ou senha incorretos.');
  }
}