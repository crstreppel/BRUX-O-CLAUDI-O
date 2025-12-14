const Role = require('./roleModel');
const Permissao = require('../permissoes/permissaoModel');
const sequelize = require('../../config/connection');

module.exports = {
  async atribuirPermissao(req, res) {
    try {
      const { id } = req.params; 
      const { permissaoId } = req.body;

      if (!permissaoId) {
        return res.status(400).json({ erro: 'permissaoId é obrigatório.' });
      }

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ erro: 'Role não encontrada.' });
      }

      const permissao = await Permissao.findByPk(permissaoId);
      if (!permissao) {
        return res.status(404).json({ erro: 'Permissão não encontrada.' });
      }

      await role.addPermissoes(permissao);

      return res.json({ mensagem: 'Permissão atribuída com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async removerPermissao(req, res) {
    try {
      const { id } = req.params;
      const { permissaoId } = req.body;

      if (!permissaoId) {
        return res.status(400).json({ erro: 'permissaoId é obrigatório.' });
      }

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ erro: 'Role não encontrada.' });
      }

      const permissao = await Permissao.findByPk(permissaoId);
      if (!permissao) {
        return res.status(404).json({ erro: 'Permissão não encontrada.' });
      }

      await role.removePermissoes(permissao);

      return res.json({ mensagem: 'Permissão removida com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async listarPermissoes(req, res) {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id, {
        include: [{ model: Permissao, as: 'permissoes' }]
      });

      if (!role) {
        return res.status(404).json({ erro: 'Role não encontrada.' });
      }

      return res.json({
        role: role.nome,
        permissoes: role.permissoes || []
      });

    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};
