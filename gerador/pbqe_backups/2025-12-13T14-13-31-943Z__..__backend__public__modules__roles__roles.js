const api = axios.create({
  baseURL: '/roles',
  headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
});

async function carregarRoles() {
  const res = await api.get('/listar');
  const container = document.getElementById('roles-list');
  container.innerHTML = '';

  res.data.forEach(role => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${role.nome}</strong></p>
      <button onclick="gerenciarPermissoes(${role.id})">Gerenciar Permissões</button>
    `;
    container.appendChild(div);
  });
}

async function gerenciarPermissoes(roleId) {
  document.getElementById('perms-section').style.display = 'block';

  const res = await api.get(`/${roleId}/permissoes`);
  const rolePerms = document.getElementById('role-perms');
  rolePerms.innerHTML = '<h3>Permissões atuais:</h3>';

  res.data.permissoes.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${p.chave}
      <button onclick="remover(${roleId}, ${p.id})">Remover</button>
    `;
    rolePerms.appendChild(div);
  });

  const all = await axios.get('/permissoes/listar', {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
  });

  const allPerms = document.getElementById('all-perms');
  allPerms.innerHTML = '<h3>Todas permissões:</h3>';

  all.data.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      ${p.chave}
      <button onclick="adicionar(${roleId}, ${p.id})">Adicionar</button>
    `;
    allPerms.appendChild(div);
  });
}

async function adicionar(roleId, permId) {
  await api.post(`/${roleId}/permissoes/adicionar`, { permissaoId: permId });
  gerenciarPermissoes(roleId);
}

async function remover(roleId, permId) {
  await api.delete(`/${roleId}/permissoes/remover`, {
    data: { permissaoId: permId }
  });
  gerenciarPermissoes(roleId);
}

carregarRoles();
