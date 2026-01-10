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

      console.log("=== SIMULAÇÃO DE EMAIL (RESET SENHA) ===");
      console.log("E-mail:", usuario.email);
      console.log("Código:", usuario.resetCodigo);
    }

    return res.json({ message: "Se o e-mail existir, um código foi enviado." });
  } catch (err) {
    console.error("Erro ao solicitar reset de senha:", err);
    return res.status(500).json({ message: "Erro interno ao solicitar reset." });
  }
};

exports.confirmar = async (req, res) => {
  try {
    const { email, codigo, novaSenha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    if (!usuario.resetCodigo || usuario.resetCodigoExpiraEm < new Date()) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    if (usuario.resetCodigoTentativas >= 5) {
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    if (usuario.resetCodigo !== codigo) {
      usuario.resetCodigoTentativas += 1;
      await usuario.save();
      return res.status(400).json({ message: "Código inválido ou expirado." });
    }

    console.log("[RESET] Antes do hash", {
      id: usuario.id,
      email: usuario.email,
      changedSenhaHash: usuario.changed("senhaHash")
    });

    const novoHash = await argon2.hash(novaSenha, { type: argon2.argon2id });
    usuario.senhaHash = novoHash;

    console.log("[RESET] Depois do hash", {
      hashLength: novoHash.length,
      changed: usuario.changed(),
      changedSenhaHash: usuario.changed("senhaHash")
    });

    usuario.resetCodigo = null;
    usuario.resetCodigoExpiraEm = null;
    usuario.resetCodigoTentativas = 0;

    console.log("[RESET] Antes do save", {
      changed: usuario.changed(),
      changedSenhaHash: usuario.changed("senhaHash")
    });

    const resultadoSave = await usuario.save();

    console.log("[RESET] Depois do save", {
      id: resultadoSave.id
    });

    return res.json({ message: "Senha alterada com sucesso." });
  } catch (err) {
    console.error("Erro ao confirmar reset de senha:", err);
    return res.status(500).json({ message: "Erro interno ao confirmar reset." });
  }
};