const { Permissao, Status } = require('../../config/sequelize');

module.exports = {
  async criar(req, res) {
    try {
      const { descricao, modulo, acao } = req.body;

      if (!descricao || !modulo || !acao) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
      }

      const chave = `${modulo}.${acao}`;

      const existente = await Permissao.findOne({ where: { chave } });
      if (existente) {
        return res.status(400).json({ erro: 'Já existe uma permissão com essa chave.' });
      }

      const nova = await Permissao.create({
        descricao,
        modulo,
        acao,
        chave,
        statusId: 1,
        ativo: true
      });

      return res.status(201).json(nova);
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  },

  async listar(req, res) {
    try {
      const dados = await Permissao.findAll({
        include: [{ model: Status, as: 'status' }]
      });

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

      const campos = {};

      if (descricao !== undefined) campos.descricao = descricao;
      if (modulo !== undefined) campos.modulo = modulo;
      if (acao !== undefined) campos.acao = acao;
      if (statusId !== undefined) campos.statusId = statusId;
      if (ativo !== undefined) campos.ativo = ativo;

      if (modulo && acao) {
        campos.chave = `${modulo}.${acao}`;
        const existente = await Permissao.findOne({
          where: { chave: campos.chave }
        });
        if (existente && existente.id !== registro.id) {
          return res.status(400).json({ erro: 'Outra permissão já usa esta chave.' });
        }
      }

      await registro.update(campos);

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