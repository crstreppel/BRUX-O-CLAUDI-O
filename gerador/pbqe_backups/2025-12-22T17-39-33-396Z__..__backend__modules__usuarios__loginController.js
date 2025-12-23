// ======================================================================
// 🧙‍♂️ loginController.js • PBQE-C V2 – Autenticação (Argon2id)
// ----------------------------------------------------------------------
const jwt = require('jsonwebtoken');
const Usuario = require('./usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');

// Segredo JWT centralizado (PBQE-C)
const JWT_SECRET = require('../../config/auth').jwtSecret;

module.exports = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      }

      const usuario = await Usuario.findOne({
        where: { email },
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

      // Resposta genérica para evitar enumeração de usuários
      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      if (!usuario.ativo) {
        return res.status(403).json({ erro: 'Usuário inativo.' });
      }

      if (!usuario.statusId) {
        return res.status(403).json({ erro: 'Usuário sem status válido.' });
      }

      const senhaOk = await usuario.validarSenha(senha);
      if (!senhaOk) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

      const payload = {
        id: usuario.id,
        usuario: usuario.usuario,
        email: usuario.email,
        role: usuario.role?.nome || null,
        permissoes
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

      return res.json({
        mensagem: 'Login efetuado com sucesso.',
        usuario: payload,
        token
      });

    } catch (err) {
      console.error('[PBQE-LOGIN-ERROR]', err);
      return res.status(500).json({ erro: err.message });
    }
  }
};