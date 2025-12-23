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
      console.log('[PERMISSOES] GET /api/permissoes/listar');
      const resposta = await axios.get('/api/permissoes/listar');
      console.log('[PERMISSOES] Resposta recebida:', resposta);

      const dados = resposta.data || [];
      console.log('[PERMISSOES] Dados:', dados);

      tbody.innerHTML = '';

      dados.forEach((item) => {
        console.log('[PERMISSOES] Renderizando item:', item);

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
      console.error('[PERMISSOES] Status:', erro?.response?.status);
      console.error('[PERMISSOES] Data:', erro?.response?.data);
      alert('Erro ao carregar permissões.');
    }
  }

  function limparForm() {
    console.log('[PERMISSOES] limparForm()');
    inputId.value = '';
    inputNome.value = '';
    inputChave.value = '';
    inputDescricao.value = '';
    formTitulo.textContent = 'Nova permissão';
  }

  function preencherForm(item) {
    console.log('[PERMISSOES] preencherForm()', item);
    inputId.value = item.id;
    inputNome.value = item.nome;
    inputChave.value = item.chave;
    inputDescricao.value = item.descricao || '';
    formTitulo.textContent = 'Editar permissão';
  }

  async function salvarPermissao(e) {
    e.preventDefault();
    console.log('[PERMISSOES] salvarPermissao()');

    const id = inputId.value;
    const nome = inputNome.value.trim();
    const chave = inputChave.value.trim();
    const descricao = inputDescricao.value.trim();

    console.log('[PERMISSOES] Payload:', { id, nome, chave, descricao });

    if (!nome || !chave) {
      alert('Nome e chave são obrigatórios.');
      return;
    }

    try {
      if (!id) {
        console.log('[PERMISSOES] POST /api/permissoes/criar');
        await axios.post('/api/permissoes/criar', { nome, chave, descricao, statusId: '00000000-0000-0000-0000-000000000001' });
      } else {
        console.log('[PERMISSOES] PUT /api/permissoes/atualizar/' + id);
        await axios.put(`/api/permissoes/atualizar/${id}`, { nome, chave, descricao });
      }

      limparForm();
      carregarPermissoes();
    } catch (erro) {
      console.error('[PERMISSOES] ERRO salvarPermissao:', erro);
      console.error('[PERMISSOES] Status:', erro?.response?.status);
      console.error('[PERMISSOES] Data:', erro?.response?.data);
      alert(erro.response?.data?.erro || 'Erro ao salvar permissão.');
    }
  }

  async function excluirPermissao(id) {
    console.log('[PERMISSOES] excluirPermissao()', id);

    if (!confirm('Confirma excluir esta permissão?')) return;

    try {
      console.log('[PERMISSOES] DELETE /api/permissoes/excluir/' + id);
      await axios.delete(`/api/permissoes/excluir/${id}`);
      carregarPermissoes();
    } catch (erro) {
      console.error('[PERMISSOES] ERRO excluirPermissao:', erro);
      console.error('[PERMISSOES] Status:', erro?.response?.status);
      console.error('[PERMISSOES] Data:', erro?.response?.data);
      alert(erro.response?.data?.erro || 'Erro ao excluir permissão.');
    }
  }

  form.addEventListener('submit', salvarPermissao);
  btnCancelar.addEventListener('click', limparForm);

  carregarPermissoes();
});