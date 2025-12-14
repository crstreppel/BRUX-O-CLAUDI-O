document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('permissoes-tbody');
  const form = document.getElementById('form-permissao');
  const formTitulo = document.getElementById('form-titulo');
  const inputId = document.getElementById('permissao-id');
  const inputDescricao = document.getElementById('descricao');
  const inputModulo = document.getElementById('modulo');
  const inputAcao = document.getElementById('acao');
  const btnCancelar = document.getElementById('btn-cancelar');

  async function carregarPermissoes() {
    try {
      const resposta = await axios.get('/permissoes/listar');
      const dados = resposta.data || [];
      tbody.innerHTML = '';

      dados.forEach((item) => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.dataset.statusId = item.statusId;
        tr.dataset.ativo = item.ativo;

        const tdId = document.createElement('td');
        tdId.textContent = item.id;

        const tdDescricao = document.createElement('td');
        tdDescricao.textContent = item.descricao;

        const tdModulo = document.createElement('td');
        tdModulo.textContent = item.modulo;

        const tdAcao = document.createElement('td');
        tdAcao.textContent = item.acao;

        const tdChave = document.createElement('td');
        tdChave.textContent = item.chave;

        const tdStatus = document.createElement('td');
        tdStatus.textContent = item.statusId != null ? item.statusId : '';

        const tdAtivo = document.createElement('td');
        const spanAtivo = document.createElement('span');
        spanAtivo.classList.add('badge-ativo');
        if (item.ativo) {
          spanAtivo.classList.add('sim');
          spanAtivo.textContent = 'Sim';
        } else {
          spanAtivo.classList.add('nao');
          spanAtivo.textContent = 'Não';
        }
        tdAtivo.appendChild(spanAtivo);

        const tdAcoes = document.createElement('td');
        tdAcoes.classList.add('acoes');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('btn-acao', 'btn-editar');
        btnEditar.addEventListener('click', () => preencherForm(item));

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.classList.add('btn-acao', 'btn-excluir');
        btnExcluir.addEventListener('click', () => excluirPermissao(item.id));

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdId);
        tr.appendChild(tdDescricao);
        tr.appendChild(tdModulo);
        tr.appendChild(tdAcao);
        tr.appendChild(tdChave);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAtivo);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
      });
    } catch (erro) {
      console.error('Erro ao carregar permissões:', erro);
      alert('Erro ao carregar permissões.');
    }
  }

  function limparForm() {
    inputId.value = '';
    inputDescricao.value = '';
    inputModulo.value = '';
    inputAcao.value = '';
    formTitulo.textContent = 'Nova permissão';
  }

  function preencherForm(item) {
    inputId.value = item.id;
    inputDescricao.value = item.descricao;
    inputModulo.value = item.modulo;
    inputAcao.value = item.acao;
    formTitulo.textContent = 'Editar permissão';
  }

  async function salvarPermissao(evento) {
    evento.preventDefault();
    const id = inputId.value;
    const payloadBase = {
      descricao: inputDescricao.value.trim(),
      modulo: inputModulo.value.trim(),
      acao: inputAcao.value.trim()
    };

    if (!payloadBase.descricao || !payloadBase.modulo || !payloadBase.acao) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      if (!id) {
        await axios.post('/permissoes/criar', payloadBase);
      } else {
        const linha = [...tbody.querySelectorAll('tr')].find(tr => String(tr.dataset.id) === String(id));
        const statusId = linha ? Number(linha.dataset.statusId) || 1 : 1;
        const ativo = linha ? (linha.dataset.ativo === 'true' || linha.dataset.ativo === '1') : true;

        await axios.put(`/permissoes/atualizar/${id}`, {
          ...payloadBase,
          statusId,
          ativo
        });
      }

      limparForm();
      await carregarPermissoes();
    } catch (erro) {
      console.error('Erro ao salvar permissão:', erro);
      const msg = erro.response && erro.response.data && erro.response.data.erro
        ? erro.response.data.erro
        : 'Erro ao salvar permissão.';
      alert(msg);
    }
  }

  async function excluirPermissao(id) {
    if (!confirm('Confirma excluir esta permissão?')) {
      return;
    }

    try {
      await axios.delete(`/permissoes/excluir/${id}`);
      await carregarPermissoes();
    } catch (erro) {
      console.error('Erro ao excluir permissão:', erro);
      const msg = erro.response && erro.response.data && erro.response.data.erro
        ? erro.response.data.erro
        : 'Erro ao excluir permissão.';
      alert(msg);
    }
  }

  form.addEventListener('submit', salvarPermissao);
  btnCancelar.addEventListener('click', limparForm);
  carregarPermissoes();
});
