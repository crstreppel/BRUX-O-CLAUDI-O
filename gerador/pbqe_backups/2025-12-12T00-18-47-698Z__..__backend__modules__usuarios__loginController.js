const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, Role, Permissao } = require('../config/sequelize');

module.exports = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
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

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha inválida.' });
      }

      const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

      const token = jwt.sign(
        {
          id: usuario.id,
          roleId: usuario.role?.id || null,
          permissoes
        },
        'SEGREDO_SUPER_PBQE',
        { expiresIn: '8h' }
      );

      return res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role?.nome || null,
        permissoes,
        token
      });
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  }
};