const jwt = require('jsonwebtoken');
const { Usuario, Role, Permissao } = require('../config/sequelize');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ erro: 'Token inválido.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, 'SEGREDO_SUPER_PBQE');
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

    const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role?.nome || null,
      permissoes
    };

    next();
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};