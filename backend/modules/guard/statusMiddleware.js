const Usuario = require('../usuarios/usuarioModel');
const Status = require('../status/statusModel');

module.exports = async function (req, res, next) {
  try {
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [
        {
          model: Status,
          as: 'status'
        }
      ]
    });

    if (!usuario || !usuario.status) {
      return res.status(403).json({ erro: 'Status do usuário inválido.' });
    }

    if (usuario.status.nome === 'TROCA_SENHA') {
      if (req.path.startsWith('/alterar-senha')) {
        return next();
      }
      return res.status(403).json({ erro: 'Troca de senha obrigatória.' });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
