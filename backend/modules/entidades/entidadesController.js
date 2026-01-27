const Entidade = require('./entidadesModel');
const Status = require('../status/statusModel');

module.exports = {

  async criar(req, res) {
    try {
      const { nome_razao, nome_fantasia, tipo_pessoa, documento_raiz, status_id } = req.body;

      if (!nome_razao || !tipo_pessoa || !documento_raiz || !status_id) {
        return res.status(400).json({
          mensagem: 'Campos obrigatórios: nome_razao, tipo_pessoa, documento_raiz, status_id'
        });
      }

      const entidade = await Entidade.create({
        nomeRazao: nome_razao,
        nomeFantasia: nome_fantasia || null,
        tipoPessoa: tipo_pessoa,
        documentoRaiz: documento_raiz,
        statusId: status_id
      });

      return res.status(201).json(entidade);

    } catch (error) {
      console.error('[ENTIDADES] Erro ao criar:', error);
      return res.status(500).json({ mensagem: 'Erro ao criar entidade' });
    }
  },

  async listar(req, res) {
    try {
      const entidades = await Entidade.findAll({
        where: { ativo: true },
        include: [{ model: Status, as: 'status' }],
        order: [['created_at', 'DESC']]
      });

      return res.json(entidades);

    } catch (error) {
      console.error('[ENTIDADES] Erro ao listar:', error);
      return res.status(500).json({ mensagem: 'Erro ao listar entidades' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const entidade = await Entidade.findByPk(id, {
        include: [{ model: Status, as: 'status' }]
      });

      if (!entidade) {
        return res.status(404).json({ mensagem: 'Entidade não encontrada' });
      }

      return res.json(entidade);

    } catch (error) {
      console.error('[ENTIDADES] Erro ao buscar:', error);
      return res.status(500).json({ mensagem: 'Erro ao buscar entidade' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome_razao, nome_fantasia, status_id } = req.body;

      const entidade = await Entidade.findByPk(id);

      if (!entidade) {
        return res.status(404).json({ mensagem: 'Entidade não encontrada' });
      }

      await entidade.update({
        nomeRazao: nome_razao ?? entidade.nomeRazao,
        nomeFantasia: nome_fantasia ?? entidade.nomeFantasia,
        statusId: status_id ?? entidade.statusId
      });

      return res.json(entidade);

    } catch (error) {
      console.error('[ENTIDADES] Erro ao atualizar:', error);
      return res.status(500).json({ mensagem: 'Erro ao atualizar entidade' });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const entidade = await Entidade.findByPk(id);

      if (!entidade) {
        return res.status(404).json({ mensagem: 'Entidade não encontrada' });
      }

      await entidade.update({ ativo: false });

      return res.json({ mensagem: 'Entidade desativada com sucesso' });

    } catch (error) {
      console.error('[ENTIDADES] Erro ao excluir:', error);
      return res.status(500).json({ mensagem: 'Erro ao excluir entidade' });
    }
  }

};
