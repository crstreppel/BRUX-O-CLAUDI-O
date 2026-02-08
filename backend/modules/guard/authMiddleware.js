// ======================================================================
// 🧙‍♂️ authMiddleware.js • PBQE-C – Autenticação JWT (Banco governa em runtime)
// ----------------------------------------------------------------------
// Segurança consolidada: token identifica, banco governa.
// ======================================================================

const jwt = require('jsonwebtoken');
const Usuario = require('../usuarios/usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');

// Fonte única do segredo JWT
const JWT_SECRET = require('../../config/auth').jwtSecret;

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔎 Banco governa: sempre buscar usuário atual
    const usuario = await Usuario.findByPk(decoded.id, {
      include: {
        model: Role,
        as: 'role',
        include: {
          model: Permissao,
          as: 'permissoes'
        }
      }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário inválido ou inativo.' });
    }

    const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

    // Contexto mínimo confiável para runtime
    req.usuario = {
      id: usuario.id,
      entidadeId: usuario.entidadeId,
      usuario: usuario.usuario,
      email: usuario.email,
      role: usuario.role?.nome || null,
      permissoes
    };

    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido.' });
  }
};
