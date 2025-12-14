const Role = require('./roleModel');

module.exports = {
  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;
      const novo = await Role.create({ nome, descricao });
      return res.status(201).json(novo);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async listar(req, res) {
    try {
      const dados = await Role.findAll();
      return res.json(dados);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};