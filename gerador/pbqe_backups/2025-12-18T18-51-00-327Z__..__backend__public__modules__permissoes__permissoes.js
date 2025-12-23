document.addEventListener('DOMContentLoaded', () => {
  console.log('[PERMISSOES] DOM carregado');

  const tbody = document.getElementById('permissoes-tbody');
  const form = document.getElementById('form-permissao');
  const formTitulo = document.getElementById('form-titulo');
  const inputId = document.getElementById('permissao-id');
  const inputNome = document.getElementById('nome');
  const inputChave = document.getElementById('chave');
  const inputDescricao = document.getElementById('descricao');
  const btnCancelar = document.getElementById('btn-cancelar');

  console.log('[PERMISSOES] Elementos capturados:', { tbody, form, formTitulo });

  async function carregarPermissoes() {
    console.log('[PERMISSOES] carregarPermissoes() chamado');
    try {
      console.log('[PERMISSOES] apiFetch GET /api/permissoes/listar');
      const dados = await apiFetch('/api/permissoes/listar');
      console.log('[PERMISSOES] Dados recebidos:', dados);

      tbody.innerHTML = '';

      dados.forEach((item) => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.dataset.statusId = item.statusId;
        tr.dataset.ativo = item.ativo;

        tr.innerHTML = `
          <td>${item.id}</td>
          <td>${item.nome}</td>
          <td>${item.chave}</td>
          <td>${item.descricao || ''}</td>
          <td>${item.statusId || ''}</td>
          <td><span class="badge-ativo ${item.ativo ? 'sim' : 'nao'}">${item.ativo ? 'Sim' : 'Não'}</span></td>
          <td class="acoes">
            <button class="btn-acao btn-editar">Editar</button>
            <button class="btn-acao btn-excluir">Excluir</button>
          </td>
        `;

        tr.querySelector('.btn-editar').addEventListener('click', () => preencherForm(item));
        tr.querySelector('.btn-excluir').addEventListener('click', () => excluirPermissao(item.id));

        tbody.appendChild(tr);
      });
    } catch (erro) {
      console.error('[PERMISSOES] ERRO carregarPermissoes:', erro);
      alert('Erro ao carregar permissões.');
    }
  }

  function limparForm() {
    inputId.value = '';
    inputNome.value = '';
    inputChave.value = '';
    inputDescricao.value = '';
    formTitulo.textContent = 'Nova permissão';
  }

  function preencherForm(item) {
    inputId.value = item.id;
    inputNome.value = item.nome;
    inputChave.value = item.chave;
    inputDescricao.value = item.descricao || '';
    formTitulo.textContent = 'Editar permissão';
  }

  async function salvarPermissao(e) {
    e.preventDefault();

    const id = inputId.value;
    const nome = inputNome.value.trim();
    const chave = inputChave.value.trim();
    const descricao = inputDescricao.value.trim();

    if (!nome || !chave) {
      alert('Nome e chave são obrigatórios.');
      return;
    }

    try {
      if (!id) {
        await apiFetch('/api/permissoes/criar', {
          method: 'POST',
          body: JSON.stringify({ nome, chave, descricao, statusId: '00000000-0000-0000-0000-000000000001' })
        });
      } else {
        await apiFetch(`/api/permissoes/atualizar/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ nome, chave, descricao })
        });
      }

      limparForm();
      carregarPermissoes();
    } catch (erro) {
      console.error('[PERMISSOES] ERRO salvarPermissao:', erro);
      alert('Erro ao salvar permissão.');
    }
  }

  async function excluirPermissao(id) {
    if (!confirm('Confirma excluir esta permissão?')) return;

    try {
      await apiFetch(`/api/permissoes/excluir/${id}`, { method: 'DELETE' });
      carregarPermissoes();
    } catch (erro) {
      console.error('[PERMISSOES] ERRO excluirPermissao:', erro);
      alert('Erro ao excluir permissão.');
    }
  }

  form.addEventListener('submit', salvarPermissao);
  btnCancelar.addEventListener('click', limparForm);

  carregarPermissoes();
});