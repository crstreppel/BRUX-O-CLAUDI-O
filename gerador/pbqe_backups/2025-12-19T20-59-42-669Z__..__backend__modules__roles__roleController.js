const Role = require('./roleModel');
const Status = require('../status/statusModel');

module.exports = {
  async criar(req, res) {
    try {
      const { nome, descricao, statusId } = req.body;

      if (!nome || !descricao) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
      }

      const existente = await Role.findOne({ where: { nome } });
      if (existente) {
        return res.status(400).json({ erro: 'Já existe um role com esse nome.' });
      }

      const novo = await Role.create({
        nome,
        descricao,
        statusId,
        ativo: true
      });

      return res.status(201).json(novo);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async listar(req, res) {
    try {
      const dados = await Role.findAll({
        include: [
          {
            model: Status,
            as: 'status'
          }
        ]
      });
      return res.json(dados);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, ativo, statusId } = req.body;

      const registro = await Role.findByPk(id);
      if (!registro) {
        return res.status(404).json({ erro: 'Registro não encontrado.' });
      }

      const camposAtualizar = {};

      if (nome !== undefined) camposAtualizar.nome = nome;
      if (descricao !== undefined) camposAtualizar.descricao = descricao;
      if (ativo !== undefined) camposAtualizar.ativo = ativo;
      if (statusId !== undefined) camposAtualizar.statusId = statusId;

      await registro.update(camposAtualizar);

      return res.json({ mensagem: 'Atualizado com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const registro = await Role.findByPk(id);
      if (!registro) {
        return res.status(404).json({ erro: 'Registro não encontrado.' });
      }

      await registro.update({
        ativo: false,
        deletedAt: new Date()
      });

      return res.json({ mensagem: 'Excluído com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};