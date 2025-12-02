async function cadastrarUsuario() {
  const usuario = document.getElementById('cad-usuario').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value.trim();
  const msgEl = document.getElementById('cad-msg');

  resetMessage(msgEl);

  if (!usuario || !email || !senha) {
    showMessage(msgEl, 'Faltou preencher usuário, email ou senha. Sem eles não consigo continuar 😅', 'error');
    return;
  }

  try {
    const resposta = await fetch('/api/usuarios/cadastrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      showMessage(msgEl, dados.erro || 'Algo deu errado no cadastro.', 'error');
      return;
    }

    showMessage(msgEl, dados.mensagem || 'Usuário criado com sucesso!', 'success');

    document.getElementById('cad-usuario').value = '';
    document.getElementById('cad-email').value = '';
    document.getElementById('cad-senha').value = '';
  } catch (error) {
    console.error('Erro no fetch de cadastro:', error);
    showMessage(msgEl, 'Erro ao se comunicar com o servidor.', 'error');
  }
}

async function loginUsuario() {
  const usuario = document.getElementById('login-usuario').value.trim();
  const senha = document.getElementById('login-senha').value.trim();
  const msgEl = document.getElementById('login-msg');

  resetMessage(msgEl);

  if (!usuario || !senha) {
    showMessage(msgEl, 'Preciso de usuário e senha pra te encontrar direitinho 😉', 'error');
    return;
  }

  try {
    const resposta = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      showMessage(msgEl, dados.erro || 'Não foi possível fazer login.', 'error');
      return;
    }

    showMessage(msgEl, dados.mensagem || 'Login autorizado!', 'success');
  } catch (error) {
    console.error('Erro no fetch de login:', error);
    showMessage(msgEl, 'Erro ao se comunicar com o servidor.', 'error');
  }
}

function resetMessage(el) {
  el.textContent = '';
  el.classList.remove('success', 'error');
}

function showMessage(el, texto, tipo) {
  el.textContent = texto;
  el.classList.remove('success', 'error');
  if (tipo === 'success') {
    el.classList.add('success');
  } else if (tipo === 'error') {
    el.classList.add('error');
  }
}
