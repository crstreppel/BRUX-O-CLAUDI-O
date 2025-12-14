const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('./usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');

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

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const senhaOk = bcrypt.compareSync(senha, usuario.senha);
      if (!senhaOk) {
        return res.status(401).json({ erro: 'Senha inválida.' });
      }

      const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

      const payload = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role?.nome || null,
        permissoes
      };

      const token = jwt.sign(payload, 'SEGREDO_SUPER_PBQE', {
        expiresIn: '8h'
      });

      return res.json({
        mensagem: 'Login efetuado com sucesso.',
        usuario: payload,
        token
      });

    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};
