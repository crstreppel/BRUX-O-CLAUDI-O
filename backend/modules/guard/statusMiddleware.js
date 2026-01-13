const Usuario = require('../usuarios/usuarioModel');
const Status = require('../status/statusModel');

module.exports = async function (req, res, next) {
  try {
    const isPainel = req.originalUrl.startsWith('/painel');

    if (!req.usuario || !req.usuario.id) {
      if (isPainel) {
        return res.redirect('/modules/login/login.html');
      }
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
      if (isPainel) {
        return res.redirect('/modules/login/login.html');
      }
      return res.status(403).json({ erro: 'Status do usuário inválido.' });
    }

    if (usuario.status.nome === 'TROCA_SENHA') {
      if (req.originalUrl.startsWith('/alterar-senha')) {
        return next();
      }
      if (isPainel) {
        return res.redirect('/modules/seguranca/troca_senha/troca_senha.html');
      }
      return res.status(403).json({ erro: 'Troca de senha obrigatória.' });
    }

    return next();
  } catch (err) {
    if (req.originalUrl.startsWith('/painel')) {
      return res.redirect('/modules/login/login.html');
    }
    return res.status(500).json({ erro: err.message });
  }
};
