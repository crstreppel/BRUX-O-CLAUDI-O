// ======================================================================
// 🧙‍♂️ areasController.js • PBQE-C – Camada de Aplicação Areas
// ----------------------------------------------------------------------
const Area = require('./areasModel');
const Status = require('../status/statusModel');
const CargoArea = require('./cargoAreasModel');
const Cargo = require('./cargosModel');

module.exports = {
  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({ erro: 'Campo nome é obrigatório.' });
      }

      const existente = await Area.findOne({ where: { nome } });
      if (existente) {
        return res.status(400).json({ erro: 'Já existe uma área com esse nome.' });
      }

      const statusAtivo = await Status.findOne({ where: { nome: 'ATIVO' } });
      if (!statusAtivo) {
        return res.status(500).json({ erro: 'Status ATIVO não encontrado.' });
      }

      const nova = await Area.create({
        nome,
        descricao: descricao || null,
        statusId: statusAtivo.id,
        ativo: true,
        createdBy: req.usuario.entidadeId,
        updatedBy: req.usuario.entidadeId
      });

      return res.status(201).json(nova);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async listar(req, res) {
    try {
      const dados = await Area.findAll({
        where: { ativo: true },
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

      const registro = await Area.findByPk(id);
      if (!registro) {
        return res.status(404).json({ erro: 'Registro não encontrado.' });
      }

      if (nome !== undefined) {
        const duplicado = await Area.findOne({ where: { nome } });
        if (duplicado && duplicado.id !== registro.id) {
          return res.status(400).json({ erro: 'Já existe uma área com esse nome.' });
        }
      }

      const camposAtualizar = {};
      if (nome !== undefined) camposAtualizar.nome = nome;
      if (descricao !== undefined) camposAtualizar.descricao = descricao;
      if (ativo !== undefined) camposAtualizar.ativo = ativo;
      if (statusId !== undefined) camposAtualizar.statusId = statusId;

      camposAtualizar.updatedBy = req.usuario.entidadeId;

      await registro.update(camposAtualizar);

      return res.json({ mensagem: 'Atualizado com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const registro = await Area.findByPk(id);
      if (!registro) {
        return res.status(404).json({ erro: 'Registro não encontrado.' });
      }

      const vinculacoes = await CargoArea.findAll({ where: { areaId: id } });

      for (const vinculo of vinculacoes) {
        const cargo = await Cargo.findByPk(vinculo.cargoId);
        if (cargo && cargo.ativo) {
          return res.status(400).json({ erro: 'Não é possível inativar a área com cargos ativos vinculados.' });
        }
      }

      await registro.update({
        ativo: false,
        deletedAt: new Date(),
        updatedBy: req.usuario.entidadeId
      });

      return res.json({ mensagem: 'Área inativada com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};
