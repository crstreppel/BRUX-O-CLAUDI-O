// ======================================================================
// 🧙‍♂️ usuarioController.js • PBQE-C V2 – Módulo Usuários
// ----------------------------------------------------------------------
const Usuario = require('./usuarioModel');
const Status = require('../status/statusModel');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

// Utilitários
function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

function addHoras(horas) {
  const d = new Date();
  d.setHours(d.getHours() + horas);
  return d;
}

module.exports = {
  // -------------------------------------------------------------------
  // Cadastro de usuário
  // -------------------------------------------------------------------
  async cadastrarUsuario(req, res) {
    try {
      const { usuario, email, senha } = req.body;

      if (!usuario || !email || !senha) {
        return res
          .status(400)
          .json({ erro: 'Faltou preencher usuário, email ou senha.' });
      }

      const emailNorm = email.trim().toLowerCase();

      const emailExiste = await Usuario.findOne({ where: { email: emailNorm } });
      if (emailExiste) {
        return res.status(400).json({ erro: 'Email já em uso.' });
      }

      const usuarioExiste = await Usuario.findOne({ where: { usuario } });
      if (usuarioExiste) {
        return res.status(400).json({ erro: 'Usuário já existe.' });
      }

      // 🔐 Status inicial obrigatório
      const statusAtivo = await Status.findOne({ where: { nome: 'ATIVO' } });
      if (!statusAtivo) {
        return res.status(500).json({ erro: 'Status ATIVO não encontrado.' });
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
  },

  // -------------------------------------------------------------------
  // Login por email + senha
  // -------------------------------------------------------------------
  async loginUsuario(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Informe e-mail e senha.' });
      }

      const emailNorm = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNorm } });

      if (!user) {
        return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
      }

      const senhaOk = await argon2.verify(user.senhaHash, senha);
      if (!senhaOk) {
        return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
      }

      if (!user.emailVerificado) {
        return res.status(401).json({
          ok: false,
          motivo: 'EMAIL_NAO_VERIFICADO',
          mensagem: 'Confirme seu e-mail antes de entrar.'
        });
      }

      return res.json({
        sucesso: true,
        emailVerificado: true,
        mensagem: 'Login autorizado!'
      });
    } catch (e) {
      console.error('Erro em loginUsuario:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  },

  // -------------------------------------------------------------------
  // Confirmação de e-mail por token (link)
  // -------------------------------------------------------------------
  async confirmarEmailPorToken(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ erro: 'Token não informado.' });
      }

      const user = await Usuario.findOne({ where: { emailToken: token } });
      if (!user) {
        return res.status(400).json({ erro: 'Token inválido.' });
      }

      if (user.emailVerificado) {
        return res.status(400).json({ erro: 'Email já confirmado.' });
      }

      if (!user.emailTokenExpiraEn || user.emailTokenExpiraEn < new Date()) {
        return res.status(400).json({ erro: 'Token expirado.' });
      }

      user.emailVerificado = true;
      user.emailToken = null;
      user.emailTokenExpiraEn = null;
      user.emailCodigoTentativas = 0;
      await user.save();

      return res.json({ sucesso: true, emailVerificado: true });
    } catch (e) {
      console.error('Erro em confirmarEmailPorToken:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  },

  // -------------------------------------------------------------------
  // Confirmação de e-mail por código + email
  // -------------------------------------------------------------------
  async confirmarEmailPorCodigo(req, res) {
    try {
      const { email, codigo } = req.body;

      if (!email || !codigo) {
        return res.status(400).json({ erro: 'Informe email e código.' });
      }

      const emailNorm = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNorm } });

      if (!user) {
        return res.status(400).json({ erro: 'Email não encontrado.' });
      }

      if (user.emailVerificado) {
        return res.status(400).json({ erro: 'Email já confirmado.' });
      }

      if (!user.emailTokenExpiraEn || user.emailTokenExpiraEn < new Date()) {
        return res.status(400).json({ erro: 'Código expirado.' });
      }

      if (user.emailCodigo !== codigo) {
        user.emailCodigoTentativas += 1;
        await user.save();
        return res.status(400).json({ erro: 'Código inválido.' });
      }

      user.emailVerificado = true;
      user.emailToken = null;
      user.emailTokenExpiraEn = null;
      user.emailCodigoTentativas = 0;
      await user.save();

      return res.json({ sucesso: true, emailVerificado: true });
    } catch (e) {
      console.error('Erro em confirmarEmailPorCodigo:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  },

  // -------------------------------------------------------------------
  // Reenvio do email/código de confirmação
  // -------------------------------------------------------------------
  async reenviarConfirmacao(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ erro: 'Informe o email.' });
      }

      const emailNorm = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNorm } });

      if (!user) {
        return res.status(400).json({ erro: 'Email não encontrado.' });
      }

      if (user.emailVerificado) {
        return res.status(400).json({ erro: 'Email já confirmado.' });
      }

      user.emailToken = uuidv4();
      user.emailCodigo = gerarCodigo();
      user.emailTokenExpiraEn = addHoras(24);
      user.emailCodigoTentativas = 0;
      await user.save();

      console.log('=== REENVIO CONFIRMAÇÃO ===');
      console.log('Link:', `/api/usuarios/confirmar-email?token=${user.emailToken}`);
      console.log('Código:', user.emailCodigo);

      return res.json({
        sucesso: true,
        reenviado: true,
        mensagem: 'Confirmação reenviada.'
      });
    } catch (e) {
      console.error('Erro em reenviarConfirmacao:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  }
};
