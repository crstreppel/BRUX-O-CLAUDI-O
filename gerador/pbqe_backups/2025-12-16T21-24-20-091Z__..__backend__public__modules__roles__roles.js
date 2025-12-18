(() => {
  const api = window.api;

  let roles = [];
  let roleEditando = null;
  let rolePermissaoAtual = null;

  const els = {
    nome: document.getElementById('nome'),
    descricao: document.getElementById('descricao'),
    statusId: document.getElementById('statusId'),
    ativo: document.getElementById('ativo'),
    btnSalvar: document.getElementById('btn-salvar'),
    btnCancelar: document.getElementById('btn-cancelar'),
    btnAtualizar: document.getElementById('btn-atualizar'),
    tbody: document.getElementById('tbody-roles'),
    msg: document.getElementById('msg'),
    badgeEdit: document.getElementById('role-editing-badge'),
    cardPerms: document.getElementById('card-permissoes'),
    permsRoleNome: document.getElementById('perms-role-nome'),
    listaPermsAtuais: document.getElementById('lista-perms-atuais'),
    listaPermsTodas: document.getElementById('lista-perms-todas'),
    btnFecharPerms: document.getElementById('btn-fechar-perms')
  };

  function showMsg(texto, tipo = 'ok') {
    els.msg.textContent = texto;
    els.msg.className = `msg ${tipo}`;
    els.msg.style.display = 'block';
    setTimeout(() => (els.msg.style.display = 'none'), 3000);
  }

  function limparForm() {
    roleEditando = null;
    els.nome.value = '';
    els.descricao.value = '';
    els.statusId.value = 1;
    els.ativo.checked = true;
    els.btnCancelar.style.display = 'none';
    els.badgeEdit.style.display = 'none';
    document.getElementById('form-title').innerText = 'Nova Role';
  }

  async function listarRoles() {
    try {
      const res = await api.get('/roles/listar');
      roles = res.data || [];
      renderTabela();
    } catch (err) {
      tratarErro(err);
    }
  }

  function renderTabela() {
    els.tbody.innerHTML = '';
    roles.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.id}</td>
        <td>${r.nome}</td>
        <td>${r.descricao}</td>
        <td>${r.ativo ? 'Sim' : 'Não'}</td>
        <td>
          <button class="btn btn-mini" data-acao="editar">Editar</button>
          <button class="btn btn-mini" data-acao="perms">Permissões</button>
          <button class="btn btn-mini btn-danger" data-acao="excluir">Excluir</button>
        </td>
      `;

      tr.querySelector('[data-acao="editar"]').onclick = () => editarRole(r);
      tr.querySelector('[data-acao="perms"]').onclick = () => abrirPermissoes(r);
      tr.querySelector('[data-acao="excluir"]').onclick = () => excluirRole(r.id);

      els.tbody.appendChild(tr);
    });
  }

  async function salvarRole() {
    const payload = {
      nome: els.nome.value.trim(),
      descricao: els.descricao.value.trim(),
      statusId: Number(els.statusId.value)
    };

    try {
      if (roleEditando) {
        payload.ativo = els.ativo.checked;
        await api.put(`/roles/atualizar/${roleEditando.id}`, payload);
        showMsg('Role atualizada com sucesso');
      } else {
        await api.post('/roles/criar', payload);
        showMsg('Role criada com sucesso');
      }
      limparForm();
      listarRoles();
    } catch (err) {
      tratarErro(err);
    }
  }

  function editarRole(role) {
    roleEditando = role;
    els.nome.value = role.nome;
    els.descricao.value = role.descricao;
    els.statusId.value = role.statusId || 1;
    els.ativo.checked = !!role.ativo;
    els.btnCancelar.style.display = 'inline-block';
    els.badgeEdit.style.display = 'inline-block';
    document.getElementById('form-title').innerText = 'Editar Role';
  }

  async function excluirRole(id) {
    if (!confirm('Confirma exclusão desta role?')) return;
    try {
      await api.delete(`/roles/excluir/${id}`);
      showMsg('Role excluída');
      listarRoles();
    } catch (err) {
      tratarErro(err);
    }
  }

  async function abrirPermissoes(role) {
    rolePermissaoAtual = role;
    els.cardPerms.style.display = 'block';
    els.permsRoleNome.innerText = role.nome;
    await carregarPermissoes();
  }

  async function carregarPermissoes() {
    try {
      const atuais = await api.get(`/roles/${rolePermissaoAtual.id}/permissoes`);
      const todas = await api.get('/permissoes/listar');
      renderPermissoes(atuais.data.permissoes || [], todas.data || []);
    } catch (err) {
      tratarErro(err);
    }
  }

  function renderPermissoes(atuais, todas) {
    els.listaPermsAtuais.innerHTML = '';
    els.listaPermsTodas.innerHTML = '';

    atuais.forEach(p => {
      const div = document.createElement('div');
      div.className = 'perm-item';
      div.innerHTML = `${p.nome} <button>Remover</button>`;
      div.querySelector('button').onclick = () => removerPermissao(p.id);
      els.listaPermsAtuais.appendChild(div);
    });

    todas.forEach(p => {
      const div = document.createElement('div');
      div.className = 'perm-item';
      div.innerHTML = `${p.nome} <button>Adicionar</button>`;
      div.querySelector('button').onclick = () => adicionarPermissao(p.id);
      els.listaPermsTodas.appendChild(div);
    });
  }

  async function adicionarPermissao(permissaoId) {
    try {
      await api.post(`/roles/${rolePermissaoAtual.id}/permissoes/adicionar`, { permissaoId });
      carregarPermissoes();
    } catch (err) {
      tratarErro(err);
    }
  }

  async function removerPermissao(permissaoId) {
    try {
      await api.delete(
        `/roles/${rolePermissaoAtual.id}/permissoes/remover`,
        { data: { permissaoId } }
      );
      carregarPermissoes();
    } catch (err) {
      tratarErro(err);
    }
  }

  function tratarErro(err) {
    if (err.response) {
      if (err.response.status === 401) return showMsg('Sessão expirada', 'erro');
      if (err.response.status === 403) return showMsg('Acesso negado', 'erro');
      if (err.response.data?.erro) return showMsg(err.response.data.erro, 'erro');
    }
    showMsg('Erro inesperado', 'erro');
  }

  els.btnSalvar.onclick = salvarRole;
  els.btnCancelar.onclick = limparForm;
  els.btnAtualizar.onclick = listarRoles;
  els.btnFecharPerms.onclick = () => (els.cardPerms.style.display = 'none');

  listarRoles();
})();