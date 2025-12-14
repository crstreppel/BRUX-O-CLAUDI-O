const jwt = require('jsonwebtoken');
const Usuario = require('../usuarios/usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');

// Segredo JWT centralizado (PBQE-C)
const JWT_SECRET = require('../../config/auth').jwtSecret;

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ erro: 'Token inválido.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ erro: 'Token expirado ou inválido.' });
    }

    const usuario = await Usuario.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permissao,
              as: 'permissoes'
            }
          ]
        }
      ]
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Usuário inativo.' });
    }

    const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

    req.usuario = {
      id: usuario.id,
      usuario: usuario.usuario,
      email: usuario.email,
      role: usuario.role?.nome || null,
      permissoes
    };

    return next();
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
