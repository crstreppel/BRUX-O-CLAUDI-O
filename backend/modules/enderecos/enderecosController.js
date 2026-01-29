const Endereco = require('./enderecosModel');
const Status = require('../status/statusModel');

module.exports = {

  async criar(req, res) {
    try {
      const {
        entidade_id,
        cep, logradouro, numero, complemento,
        condominio, edificio, bloco, unidade,
        bairro, cidade, uf, pais,
        status_id
      } = req.body;

      if (!entidade_id || !cep || !logradouro || !numero || !bairro || !cidade || !uf || !status_id) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios não informados.' });
      }

      const total = await Endereco.count({ where: { entidadeId: entidade_id } });

      const endereco = await Endereco.create({
        entidadeId: entidade_id,
        sequencia: total + 1,
        cep,
        logradouro,
        numero,
        complemento: complemento || null,
        condominio: condominio || null,
        edificio: edificio || null,
        bloco: bloco || null,
        unidade: unidade || null,
        bairro,
        cidade,
        uf,
        pais: pais || 'BR',
        statusId: status_id
      });

      return res.status(201).json(endereco);

    } catch (error) {
      console.error('[ENDERECOS] Erro ao criar:', error);
      return res.status(500).json({ mensagem: 'Erro ao criar endereço' });
    }
  },

  async listarPorEntidade(req, res) {
    try {
      const { entidadeId } = req.params;

      const enderecos = await Endereco.findAll({
        where: { entidadeId, ativo: true },
        include: [{ model: Status, as: 'status' }],
        order: [['sequencia', 'ASC']]
      });

      return res.json(enderecos);

    } catch (error) {
      console.error('[ENDERECOS] Erro ao listar:', error);
      return res.status(500).json({ mensagem: 'Erro ao listar endereços' });
    }
  },

  async inativar(req, res) {
    try {
      const { id } = req.params;

      const endereco = await Endereco.findByPk(id);

      if (!endereco) {
        return res.status(404).json({ mensagem: 'Endereço não encontrado' });
      }

      await endereco.update({ ativo: false });

      return res.json({ mensagem: 'Endereço inativado com sucesso' });

    } catch (error) {
      console.error('[ENDERECOS] Erro ao inativar:', error);
      return res.status(500).json({ mensagem: 'Erro ao inativar endereço' });
    }
  }

};
