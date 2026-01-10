// ======================================================================
// 🧙‍♂️ loginController.js • PBQE-C V2 – Autenticação (Argon2id)
// ----------------------------------------------------------------------
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Usuario = require('./usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');

const JWT_SECRET = require('../../config/auth').jwtSecret;

module.exports = {
  async login(req, res) {
    try {
      let { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      }

      const emailNorm = email.trim().toLowerCase();

      const usuario = await Usuario.findOne({
        where: { email: emailNorm },
        include: [
          {
            model: Role,
            as: 'role',
            include: [{ model: Permissao, as: 'permissoes' }]
          }
        ]
      });

      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      if (!usuario.emailVerificado) {
        return res.status(401).json({
          ok: false,
          motivo: 'EMAIL_NAO_VERIFICADO',
          mensagem: 'Confirme seu e-mail antes de entrar.'
        });
      }

      if (!usuario.ativo) {
        return res.status(403).json({ erro: 'Usuário inativo.' });
      }

      if (!usuario.statusId) {
        return res.status(403).json({ erro: 'Usuário sem status válido.' });
      }

      const senhaOk = await argon2.verify(usuario.senhaHash, senha);
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