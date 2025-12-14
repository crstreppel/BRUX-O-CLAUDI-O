const Permissao = require('./permissaoModel');

module.exports = {
  async criar(req, res) {
    try {
      const { descricao, modulo, acao } = req.body;
      const chave = `${modulo}.${acao}`;
      const nova = await Permissao.create({ descricao, modulo, acao, chave });
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
      const chave = `${modulo}.${acao}`;
      await Permissao.update({ descricao, modulo, acao, chave, ativo, statusId }, { where: { id } });
      return res.json({ mensagem: 'Atualizado com sucesso' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;
      await Permissao.destroy({ where: { id } });
      return res.json({ mensagem: 'Excluído com sucesso' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};