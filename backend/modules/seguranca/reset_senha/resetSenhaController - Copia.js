const Usuario = require("../../usuarios/usuarioModel");
const argon2 = require("argon2");

function gerarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.solicitar = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (usuario) {
      usuario.resetCodigo = gerarCodigo();
      usuario.resetCodigoExpiraEm = new Date(Date.now() + 15 * 60 * 1000);
      usuario.resetCodigoTentativas = 0;
      await usuario.save();

      // === SIMULAÇÃO DE EMAIL (RESET SENHA) ===
      console.log("=== SIMULAÇÃO DE EMAIL (RESET SENHA) ===");
      console.log("E-mail:", usuario.email);
      console.log("Código:", usuario.resetCodigo);
    }

    return res.json({
      message: "Se o e-mail existir, um código foi enviado."
    });
  } catch (err) {
    console.error("Erro ao solicitar reset de senha:", err);
    return res.status(500).json({ message: "Erro interno ao solicitar reset." });
  }
};

exports.confirmar = async (req, res) => {
  try {
    console.log("=== DEBUG RESET CONFIRMAR ===");
    console.log("Payload recebido:", req.body);

    const { email, codigo, novaSenha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    console.log("Usuário encontrado?", !!usuario);

    if (!usuario) {
      console.log("DEBUG: usuário não encontrado");
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    console.log("DEBUG resetCodigo:", usuario.resetCodigo);
    console.log("DEBUG resetCodigoExpiraEm:", usuario.resetCodigoExpiraEm);
    console.log("DEBUG resetCodigoTentativas:", usuario.resetCodigoTentativas);
    console.log("DEBUG agora:", new Date());
    console.log("DEBUG codigo recebido:", codigo);

    if (!usuario.resetCodigo || usuario.resetCodigoExpiraEm < new Date()) {
      console.log("DEBUG: caiu no if de código nulo ou expirado");
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    if (usuario.resetCodigoTentativas >= 5) {
      console.log("DEBUG: caiu no if de tentativas >= 5");
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    if (usuario.resetCodigo !== codigo) {
      console.log("DEBUG: código diferente");
      usuario.resetCodigoTentativas += 1;
      await usuario.save();
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    console.log("DEBUG: código validado, alterando senha");

    usuario.senha_hash = await argon2.hash(novaSenha, { type: argon2.argon2id });

    // ✅ NOVO (mínimo e cirúrgico): reset confirmado => e-mail validado
    usuario.emailVerificado = true;
    usuario.emailVerificadoEm = new Date();

    usuario.resetCodigo = null;
    usuario.resetCodigoExpiraEm = null;
    usuario.resetCodigoTentativas = 0;
    await usuario.save();

    // ✅ NOVO (simulação de e-mail informativo)
    console.log("=== SIMULAÇÃO DE EMAIL (SENHA ALTERADA) ===");
    console.log("E-mail:", usuario.email);
    console.log("Mensagem: Sua senha foi alterada com sucesso. Se não foi você, entre em contato com o suporte.");

    console.log("DEBUG: senha alterada com sucesso");

    return res.json({ message: "Senha alterada com sucesso." });
  } catch (err) {
    console.error("Erro ao confirmar reset de senha:", err);
    return res.status(500).json({ message: "Erro interno ao confirmar reset." });
  }
};
