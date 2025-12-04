// ======================================================================
// 🧙‍♂️ usuarioController.js • PBQE-C V2 – Módulo Usuários
// ----------------------------------------------------------------------
const Usuario = require('./usuarioModel');
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
        return res.status(400).json({ erro: "Faltou preencher usuário, email ou senha." });
      }
      const emailNormalizado = email.trim().toLowerCase();
      const emailExiste = await Usuario.findOne({ where: { email: emailNormalizado } });
      if (emailExiste) return res.status(400).json({ erro: "Email já em uso." });
      const usuarioExiste = await Usuario.findOne({ where: { usuario } });
      if (usuarioExiste) return res.status(400).json({ erro: "Usuário já existe." });
      const senhaHash = await argon2.hash(senha, { type: argon2.argon2d });
      const emailToken = uuidv4();
      const emailCodigo = gerarCodigo();
      const emailTokenExpiraEm = addHoras(24);
      await Usuario.create({
        usuario,
        email: emailNormalizado,
        senhaHash,
        emailVerificado: false,
        emailToken,
        emailCodigo,
        emailTokenExpiraEm,
        emailCodigoTentativas: 0,
        statusId: null,
        ativo: true
      });
      console.log("=== SIMULAÇÃO DE EMAIL ===");
      console.log("Link:", `/api/usuarios/confirmar-email?token=${emailToken}`);
      console.log("Código:", emailCodigo);
      return res.json({
        sucesso: true,
        precisaConfirmarEmail: true,
        mensagem: "Usuário criado!"
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async loginUsuario(req, res) {
    try {
      const { usuario, senha } = req.body;
      if (!usuario || !senha) return res.status(400).json({ erro: "Informe usuário e senha." });
      const user = await Usuario.findOne({ where: { usuario } });
      if (!user) return res.status(400).json({ erro: "Usuário ou senha inválidos." });
      const senhaOk = await argon2.verify(user.senhaHash, senha);
      if (!senhaOk) return res.status(400).json({ erro: "Usuário ou senha inválidos." });
      if (!user.emailVerificado) {
        return res.status(401).json({
          ok: false,
          motivo: "EMAIL_NAO_VERIFICADO",
          mensagem: "Confirme seu email."
        });
      }
      return res.json({ ok: true, mensagem: "Login autorizado!" });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async confirmarEmailPorToken(req, res) {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ erro: "Token não informado." });
      const user = await Usuario.findOne({ where: { emailToken: token } });
      if (!user) return res.status(400).json({ erro: "Token inválido." });
      if (user.emailTokenExpiraEm < new Date()) {
        return res.status(400).json({ erro: "Token expirado." });
      }
      user.emailVerificado = true;
      user.emailToken = null;
      user.emailCodigo = null;
      user.emailTokenExpiraEm = null;
      user.emailCodigoTentativas = 0;
      await user.save();
      return res.json({ sucesso: true, emailVerificado: true });
    } catch (error) {
      console.error("Erro:", error);
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async confirmarEmailPorCodigo(req, res) {
    try {
      const { email, codigo } = req.body;
      if (!email || !codigo) return res.status(400).json({ erro: "Informe email e código." });

      const emailNormalizado = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNormalizado } });

      if (!user) return res.status(400).json({ erro: "Email não encontrado." });
      if (user.emailVerificado) return res.status(400).json({ erro: "Email já confirmado." });
      if (user.emailTokenExpiraEm < new Date()) {
        return res.status(400).json({ erro: "Código expirado." });
      }
      if (user.emailCodigo !== codigo) {
        user.emailCodigoTentativas++;
        if (user.emailCodigoTentativas >= 5) {
          user.emailCodigo = null;
          user.emailToken = null;
          await user.save();
          return res.status(400).json({ erro: "Muitas tentativas." });
        }
        await user.save();
        return res.status(400).json({ erro: "Código incorreto." });
      }
      user.emailVerificado = true;
      user.emailToken = null;
      user.emailCodigo = null;
      user.emailTokenExpiraEm = null;
      user.emailCodigoTentativas = 0;
      await user.save();
      return res.json({ sucesso: true, emailVerificado: true });
    } catch (error) {
      console.error("Erro:", error);
      return res.status(500).json({ erro: "Erro interno." });
    }
  },

  async reenviarConfirmacao(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ erro: "Informe o email." });
      const emailNormalizado = email.trim().toLowerCase();
      const user = await Usuario.findOne({ where: { email: emailNormalizado } });
      if (!user) return res.status(400).json({ erro: "Email não encontrado." });
      if (user.emailVerificado) {
        return res.status(400).json({ erro: "Email já confirmado." });
      }
      user.emailToken = uuidv4();
      user.emailCodigo = gerarCodigo();
      user.emailTokenExpiraEm = addHoras(24);
      user.emailCodigoTentativas = 0;
      await user.save();
      console.log("=== REENVIO ===");
      console.log("Link:", `/api/usuarios/confirmar-email?token=${user.emailToken}`);
      console.log("Código:", user.emailCodigo);
      return res.json({ sucesso: true, reenviado: true });
    } catch (error) {
      console.error("Erro:", error);
      return res.status(500).json({ erro: "Erro interno." });
    }
  }
};
