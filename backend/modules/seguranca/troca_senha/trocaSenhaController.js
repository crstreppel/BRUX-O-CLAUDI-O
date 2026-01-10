const argon2 = require('argon2');
const Usuario = require('../../usuarios/usuarioModel');
const Status = require('../../status/statusModel');

module.exports = async function (req, res) {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: 'Dados obrigatórios não informados.' });
    }

    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [{ model: Status, as: 'status' }]
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    const senhaValida = await argon2.verify(usuario.senhaHash, senhaAtual);
    if (!senhaValida) {
      return res.status(403).json({ erro: 'Senha atual incorreta.' });
    }

    const novaHash = await argon2.hash(novaSenha);

    const statusAtivo = await Status.findOne({
      where: { nome: 'ATIVO' }
    });

    await usuario.update({
      senhaHash: novaHash,
      statusId: statusAtivo.id
    });

    return res.json({ sucesso: true });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
