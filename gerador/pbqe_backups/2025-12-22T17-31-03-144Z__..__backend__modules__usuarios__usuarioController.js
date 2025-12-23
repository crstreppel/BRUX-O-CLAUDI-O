// ======================================================================
// 🧙‍♂️ usuarioController.js • PBQE-C V2 – Módulo Usuários
// ----------------------------------------------------------------------
const Usuario = require('./usuarioModel');
const Status = require('../status/statusModel');
const Role = require('../roles/roleModel');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function addHoras(horas) {
  const d = new Date();
  d.setHours(d.getHours() + horas);
  return d;
}

module.exports = {
  async cadastrarUsuario(req, res) {
    try {
      const { usuario, email, senha } = req.body;

      if (!usuario || !email || !senha) {
        return res.status(400).json({ erro: 'Faltou preencher usuário, email ou senha.' });
      }

      const emailNorm = email.trim().toLowerCase();

      if (await Usuario.findOne({ where: { email: emailNorm } })) {
        return res.status(400).json({ erro: 'Email já em uso.' });
      }

      if (await Usuario.findOne({ where: { usuario } })) {
        return res.status(400).json({ erro: 'Usuário já existe.' });
      }

      const statusAtivo = await Status.findOne({ where: { nome: 'ATIVO', ativo: true } });
      if (!statusAtivo) {
        return res.status(500).json({ erro: 'Status ATIVO não encontrado.' });
      }

      const rolePadrao = await Role.findByPk('d521e8cb-8f5a-4c7c-b489-32f794f755ff');
      if (!rolePadrao) {
        return res.status(500).json({ erro: 'Role padrão USUARIO não encontrada.' });
      }

      const senhaHash = await argon2.hash(senha, { type: argon2.argon2id });
      const emailToken = uuidv4();
      const emailCodigo = gerarCodigo();
      const emailTokenExpiraEn = addHoras(24);

      const user = await Usuario.create({
        usuario,
        email: emailNorm,
        senhaHash,
        emailVerificado: false,
        emailToken,
        emailTokenExpiraEn,
        emailCodigo,
        emailCodigoTentativas: 0,
        statusId: statusAtivo.id,
        roleId: rolePadrao.id,
        ativo: true
      });

      console.log('=== SIMULAÇÃO DE EMAIL ===');
      console.log('Link:', `/api/usuarios/confirmar-email?token=${user.emailToken}`);
      console.log('Código:', user.emailCodigo);

      return res.json({
        sucesso: true,
        mensagem: 'Usuário criado! Verifique o e-mail para confirmar o acesso.',
        email: user.email,
        codigo: user.emailCodigo
      });
    } catch (e) {
      console.error('Erro em cadastrarUsuario:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  }
};
