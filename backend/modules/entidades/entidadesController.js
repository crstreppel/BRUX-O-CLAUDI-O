const Entidade = require('./entidadesModel');
const Status = require('../status/statusModel');

module.exports = {
  async listar(req, res) {
    try {
      const entidades = await Entidade.findAll({
        where: { ativo: true },
        include: [{ model: Status, as: 'status' }],
        order: [['created_at', 'ASC']]
      });
      return res.json(entidades);
    } catch (err) {
      console.error('Erro ao listar entidades:', err);
      return res.status(500).json({ erro: 'Erro ao listar entidades' });
    }
  },

  async criar(req, res) {
    try {
      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({ erro: 'Nome é obrigatório' });
      }

      const statusAtivo = await Status.findOne({ where: { codigo: 'ATIVO' } });
      if (!statusAtivo) {
        return res.status(500).json({ erro: 'Status ATIVO não encontrado' });
      }

      const entidade = await Entidade.create({
        nome,
        status_id: statusAtivo.id
      });

      return res.status(201).json(entidade);
    } catch (err) {
      console.error('Erro ao criar entidade:', err);
      return res.status(500).json({ erro: 'Erro ao criar entidade' });
    }
  }
};