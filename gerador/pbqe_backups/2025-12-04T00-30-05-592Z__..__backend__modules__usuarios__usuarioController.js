// ======================================================================
// 🧙‍♂️ usuarioController.js • PBQE-C V2 – Módulo Usuários
// ----------------------------------------------------------------------
const Usuario = require('./usuarioModel');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

function gerarCodigo() { return String(Math.floor(100000 + Math.random() * 900000)); }
function addHoras(h) { const d = new Date(); d.setHours(d.getHours() + h); return d; }

module.exports = {
  async cadastrarUsuario(req, res) {
    try {
      const { usuario, email, senha } = req.body;
      if (!usuario || !email || !senha) return res.status(400).json({ erro: "Faltou preencher usuário, email ou senha." });
      const emailNorm = email.trim().toLowerCase();
      const emailExiste = await Usuario.findOne({ where: { email: emailNorm } });
      if (emailExiste) return res.status(400).json({ erro: "Email já em uso." });
      const usuarioExiste = await Usuario.findOne({ where: { usuario } });
      if (usuarioExiste) return res.status(400).json({ erro: "Usuário já existe." });
      const senhaHash = await argon2.hash(senha, { type: argon2.argon2d });
      const emailToken = uuidv4();
      const emailCodigo = gerarCodigo();
      const emailTokenExpiraEn = addHoras(24);
      await Usuario.create({ usuario, email: emailNorm, senhaHash, emailVerificado: false, emailToken, emailCodigo, emailTokenExpiraEn, emailCodigoTentativas: 0, statusId: null, ativo: true });
      console.log("=== SIMULAÇÃO DE EMAIL ==="); console.log("Link:", `/api/usuarios/confirmar-email?token=${emailToken}`); console.log("Código:", emailCodigo);
      return res.json({ sucesso: true, precisaConfirmarEmail: true, mensagem: "Usuário criado!" });
    } catch (e) { console.error(e); return res.status(500).json({ erro: "Erro interno." }); }
  },

    async loginUsuario(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "Informe e-mail e senha." });
      }

      const emailNorm = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNorm } });

      if (!user) {
        return res.status(400).json({ erro: "E-mail ou senha inválidos." });
      }

      const senhaOk = await argon2.verify(user.senhaHash, senha);
      if (!senhaOk) {
        return res.status(400).json({ erro: "E-mail ou senha inválidos." });
      }

      if (!user.emailVerificado) {
        return res.status(401).json({
          ok: false,
          motivo: "EMAIL_NAO_VERIFICADO",
          mensagem: "Confirme seu e-mail antes de entrar."
        });
      }

      return res.json({
        sucesso: true,
        emailVerificado: true,
        mensagem: "Login autorizado!"
      });

    } catch (e) {
      console.error(e);
      return res.status(500).json({ erro: "Erro interno." });
    }
  },);
      if (!user) return res.status(400).json({ erro: "Usuário ou senha inválidos." });
      const senhaOk = await argon2.verify(user.senhaHash, senha);
      if (!senhaOk) return res.status(400).json({ erro: "Usuário ou senha inválidos." });
      if (!user.emailVerificado) return res.status(401).json({ ok: false, motivo: "EMAIL_NAO_VERIFICADO", mensagem: "Confirme seu email." });
      return res.json({ ok: true, mensagem: "Login autorizado!" });
    } catch (e) { console.error(e); return res.status(500).json({ erro: "Erro interno." }); }
  },

  async confirmarEmailPorToken(req, res) {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ erro: "Token não informado." });
      const user = await Usuario.findOne({ where: { emailToken: token } });
      if (!user) return res.status(400).json({ erro: "Token inválido." });
      if (user.emailTokenExpiraEn < new Date()) return res.status(400).json({ erro: "Token expirado." });
      user.emailVerificado = true; user.emailToken = null; user.emailCodigo = null; user.emailTokenExpiraEn = null; user.emailCodigoTentativas = 0; await user.save();
      return res.json({ sucesso: true, emailVerificado: true });
    } catch (e) { console.error(e); return res.status(500).json({ erro: "Erro interno." }); }
  },

  async confirmarEmailPorCodigo(req, res) {
    try {
      const { email, codigo } = req.body;
      if (!email || !codigo) return res.status(400).json({ erro: "Informe email e código." });
      const emailNorm = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNorm } });
      if (!user) return res.status(400).json({ erro: "Email não encontrado." });
      if (user.emailVerificado) return res.status(400).json({ erro: "Email já confirmado." });
      if (user.emailTokenExpiraEn < new Date()) return res.status(400).json({ erro: "Código expirado." });
      if (user.emailCodigo !== codigo) {
        user.emailCodigoTentativas++;
        if (user.emailCodigoTentativas >= 5) { user.emailCodigo = null; user.emailToken = null; await user.save(); return res.status(400).json({ erro: "Muitas tentativas." }); }
        await user.save(); return res.status(400).json({ erro: "Código incorreto." });
      }
      user.emailVerificado = true; user.emailToken = null; user.emailCodigo = null; user.emailTokenExpiraEn = null; user.emailCodigoTentativas = 0; await user.save();
      return res.json({ sucesso: true, emailVerificado: true });
    } catch (e) { console.error(e); return res.status(500).json({ erro: "Erro interno." }); }
  },

  async reenviarConfirmacao(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ erro: "Informe o email." });
      const emailNorm = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNorm } });
      if (!user) return res.status(400).json({ erro: "Email não encontrado." });
      if (user.emailVerificado) return res.status(400).json({ erro: "Email já confirmado." });
      user.emailToken = uuidv4(); user.emailCodigo = gerarCodigo(); user.emailTokenExpiraEn = addHoras(24); user.emailCodigoTentativas = 0;
      await user.save(); console.log("=== REENVIO ==="); console.log("Link:", `/api/usuarios/confirmar-email?token=${user.emailToken}`); console.log("Código:", user.emailCodigo);
      return res.json({ sucesso: true, reenviado: true });
    } catch (e) { console.error(e); return res.status(500).json({ erro: "Erro interno." }); }
  }
};
