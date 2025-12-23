(() => {
  console.log('[ROLES] script carregou');

  let roles = [];
  let roleEditando = null;
  let rolePermissaoAtual = null;

  let els = {};

  function mapearElementos() {
    console.log('[ROLES] mapeando elementos DOM');

    els = {
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

    Object.entries(els).forEach(([k, v]) => {
      if (!v) {
        console.error(`[ROLES][DOM] elemento NÃO encontrado: ${k}`);
      }
    });
  }

  function showMsg(texto, tipo = 'ok') {
    console.log('[ROLES][MSG]', texto, tipo);
    if (!els.msg) return;
    els.msg.textContent = texto;
    els.msg.className = `msg ${tipo}`;
    els.msg.style.display = 'block';
    setTimeout(() => (els.msg.style.display = 'none'), 3000);
  }

  function limparForm() {
    console.log('[ROLES] limparForm');
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
    console.log('[ROLES] listarRoles');
    try {
      const data = await apiFetch('/api/roles/listar');
      console.log('[ROLES] dados recebidos', data);
      roles = data || [];
      renderTabela();
    } catch (err) {
      console.error('[ROLES] erro listarRoles', err);
      tratarErro(err);
    }
  }

  function renderTabela() {
    console.log('[ROLES] renderTabela', roles.length);
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
    console.log('[ROLES] salvarRole');
    const payload = {
      nome: els.nome.value.trim(),
      descricao: els.descricao.value.trim(),
      statusId: Number(els.statusId.value)
    };

    try {
      if (roleEditando) {
        payload.ativo = els.ativo.checked;
        await apiFetch(`/api/roles/atualizar/${roleEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showMsg('Role atualizada com sucesso');
      } else {
        await apiFetch('/api/roles/criar', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showMsg('Role criada com sucesso');
      }
      limparForm();
      listarRoles();
    } catch (err) {
      console.error('[ROLES] erro salvarRole', err);
      tratarErro(err);
    }
  }

  function editarRole(role) {
    console.log('[ROLES] editarRole', role);
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
    console.log('[ROLES] excluirRole', id);
    if (!confirm('Confirma exclusão desta role?')) return;
    try {
      await apiFetch(`/api/roles/excluir/${id}`, { method: 'DELETE' });
      showMsg('Role excluída');
      listarRoles();
    } catch (err) {
      console.error('[ROLES] erro excluirRole', err);
      tratarErro(err);
    }
  }

  async function abrirPermissoes(role) {
    console.log('[ROLES] abrirPermissoes', role);
    rolePermissaoAtual = role;
    els.cardPerms.style.display = 'block';
    els.permsRoleNome.innerText = role.nome;
    await carregarPermissoes();
  }

  async function carregarPermissoes() {
    console.log('[ROLES] carregarPermissoes');
    try {
      const atuais = await apiFetch(`/api/roles/${rolePermissaoAtual.id}/permissoes`);
      const todas = await apiFetch('/api/permissoes/listar');
      renderPermissoes(atuais.permissoes || [], todas || []);
    } catch (err) {
      console.error('[ROLES] erro carregarPermissoes', err);
      tratarErro(err);
    }
  }

  function renderPermissoes(atuais, todas) {
    console.log('[ROLES] renderPermissoes', atuais.length, todas.length);
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
    console.log('[ROLES] adicionarPermissao', permissaoId);
    try {
      await apiFetch(`/api/roles/${rolePermissaoAtual.id}/permissoes/adicionar`, {
        method: 'POST',
        body: JSON.stringify({ permissaoId })
      });
      carregarPermissoes();
    } catch (err) {
      console.error('[ROLES] erro adicionarPermissao', err);
      tratarErro(err);
    }
  }

  async function removerPermissao(permissaoId) {
    console.log('[ROLES] removerPermissao', permissaoId);
    try {
      await apiFetch(`/api/roles/${rolePermissaoAtual.id}/permissoes/remover`, {
        method: 'DELETE',
        body: JSON.stringify({ permissaoId })
      });
      carregarPermissoes();
    } catch (err) {
      console.error('[ROLES] erro removerPermissao', err);
      tratarErro(err);
    }
  }

  function tratarErro(err) {
    console.error('[ROLES] tratarErro', err);
    if (err && err.erro) {
      showMsg(err.erro, 'erro');
      return;
    }
    showMsg('Erro inesperado (ver console)', 'erro');
  }

  document.addEventListener('DOMContentLoaded', () => {
    console.log('[ROLES] DOMContentLoaded');
    mapearElementos();

    els.btnSalvar.onclick = salvarRole;
    els.btnCancelar.onclick = limparForm;
    els.btnAtualizar.onclick = listarRoles;
    els.btnFecharPerms.onclick = () => (els.cardPerms.style.display = 'none');

    listarRoles();
  });
})();
