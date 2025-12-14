const { Permissao } = require('../../config/sequelize');

module.exports = {
  async criar(req, res) {
    try {
      const { descricao, modulo, acao } = req.body;

      if (!descricao || !modulo || !acao) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
      }

      const chave = `${modulo}.${acao}`;

      const nova = await Permissao.create({
        descricao,
        modulo,
        acao,
        chave
      });

      return res.status(201).json(nova);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async listar(req, res) {
    try {
      const dados = await Permissao.findAll();
      return res.json(dados);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { descricao, modulo, acao, ativo, statusId } = req.body;

      const registro = await Permissao.findByPk(id);
      if (!registro) {
        return res.status(404).json({ erro: 'Registro não encontrado.' });
      }

      const chave = `${modulo}.${acao}`;

      await registro.update({
        descricao,
        modulo,
        acao,
        chave,
        ativo,
        statusId
      });

      return res.json({ mensagem: 'Atualizado com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const registro = await Permissao.findByPk(id);
      if (!registro) {
        return res.status(404).json({ erro: 'Registro não encontrado.' });
      }

      await registro.destroy();

      return res.json({ mensagem: 'Excluído com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};
