const Usuario = require('../usuarios/usuarioModel');
const Status = require('../status/statusModel');
const AuditoriaEvento = require('../seguranca/auditoriaModel');

async function auditar({ evento, sucesso, usuarioId, email, ip, userAgent, motivo }) {
  try {
    await AuditoriaEvento.create({
      evento,
      sucesso: !!sucesso,
      usuarioId: usuarioId || null,
      email: email || null,
      ip: ip || null,
      userAgent: userAgent || null,
      motivo: motivo || null
    });
  } catch (e) {
    // não derrubar fluxo
  }
}

function getIp(req) {
  return (req.ip || req.connection?.remoteAddress || '').toString();
}

module.exports = async function (req, res, next) {
  try {
    const isPainel = req.originalUrl.startsWith('/painel');
    const ip = getIp(req);
    const userAgent = (req.headers['user-agent'] || '').toString();

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
      await auditar({
        evento: 'TROCA_SENHA_OBRIGATORIA',
        sucesso: false,
        usuarioId: usuario.id,
        email: usuario.email,
        ip,
        userAgent,
        motivo: 'STATUS_TROCA_SENHA'
      });

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
