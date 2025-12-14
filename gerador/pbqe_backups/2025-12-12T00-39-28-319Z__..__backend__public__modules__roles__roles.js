document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('roles-tbody');
  const form = document.getElementById('form-role');
  const formTitulo = document.getElementById('form-titulo-role');
  const inputId = document.getElementById('role-id');
  const inputNome = document.getElementById('role-nome');
  const inputDescricao = document.getElementById('role-descricao');
  const btnCancelar = document.getElementById('btn-cancelar-role');

  async function carregarRoles() {
    try {
      const resposta = await axios.get('/roles/listar');
      const dados = resposta.data || [];
      tbody.innerHTML = '';

      dados.forEach((item) => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        tr.dataset.statusId = item.statusId;
        tr.dataset.ativo = item.ativo;

        const tdId = document.createElement('td');
        tdId.textContent = item.id;

        const tdNome = document.createElement('td');
        tdNome.textContent = item.nome;

        const tdDescricao = document.createElement('td');
        tdDescricao.textContent = item.descricao;

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
        btnExcluir.addEventListener('click', () => excluirRole(item.id));

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdId);
        tr.appendChild(tdNome);
        tr.appendChild(tdDescricao);
        tr.appendChild(tdStatus);
        tr.appendChild(tdAtivo);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
      });
    } catch (erro) {
      console.error('Erro ao carregar roles:', erro);
      alert('Erro ao carregar roles.');
    }
  }

  function limparForm() {
    inputId.value = '';
    inputNome.value = '';
    inputDescricao.value = '';
    formTitulo.textContent = 'Novo role';
  }

  function preencherForm(item) {
    inputId.value = item.id;
    inputNome.value = item.nome;
    inputDescricao.value = item.descricao;
    formTitulo.textContent = 'Editar role';
  }

  async function salvarRole(evento) {
    evento.preventDefault();
    const id = inputId.value;
    const payloadBase = {
      nome: inputNome.value.trim(),
      descricao: inputDescricao.value.trim()
    };

    if (!payloadBase.nome || !payloadBase.descricao) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      if (!id) {
        await axios.post('/roles/criar', payloadBase);
      } else {
        const linha = [...tbody.querySelectorAll('tr')].find(tr => String(tr.dataset.id) === String(id));
        const statusId = linha ? Number(linha.dataset.statusId) || 1 : 1;
        const ativo = linha ? (linha.dataset.ativo === 'true' || linha.dataset.ativo === '1') : true;

        await axios.put(`/roles/atualizar/${id}`, {
          ...payloadBase,
          statusId,
          ativo
        });
      }

      limparForm();
      await carregarRoles();
    } catch (erro) {
      console.error('Erro ao salvar role:', erro);
      const msg = erro.response && erro.response.data && erro.response.data.erro
        ? erro.response.data.erro
        : 'Erro ao salvar role.';
      alert(msg);
    }
  }

  async function excluirRole(id) {
    if (!confirm('Confirma excluir este role?')) {
      return;
    }

    try {
      await axios.delete(`/roles/excluir/${id}`);
      await carregarRoles();
    } catch (erro) {
      console.error('Erro ao excluir role:', erro);
      const msg = erro.response && erro.response.data && erro.response.data.erro
        ? erro.response.data.erro
        : 'Erro ao excluir role.';
      alert(msg);
    }
  }

  form.addEventListener('submit', salvarRole);
  btnCancelar.addEventListener('click', limparForm);
  carregarRoles();
});
