// ======================================================================
// 🧙‍♂️ usuarioController.js • PBQE-C V2 (DEBUG)
// ----------------------------------------------------------------------
// DEBUG ativo em confirmarEmailPorCodigo
// ======================================================================

const Usuario = require('./usuarioModel');
const Status = require('../status/statusModel');
const Role = require('../roles/roleModel');
const argon2 = require('argon2');

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function addMinutos(minutos) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutos);
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
      const emailCodigo = gerarCodigo();

      const user = await Usuario.create({
        usuario,
        email: emailNorm,
        senhaHash,
        emailVerificado: false,
        emailCodigo,
        emailCodigoTentativas: 0,
        emailTokenExpiraEn: addMinutos(15),
        statusId: statusAtivo.id,
        roleId: rolePadrao.id,
        ativo: true
      });

      console.log('=== SIMULAÇÃO DE EMAIL ===');
      console.log('Código:', user.emailCodigo);

      return res.json({
        sucesso: true,
        usuarioId: user.id,
        mensagem: 'Usuário criado! Verifique seu e-mail e informe o código recebido.'
      });

    } catch (e) {
      console.error('Erro em cadastrarUsuario:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  },

  async confirmarEmailPorCodigo(req, res) {
    try {
      const { usuarioId, codigo } = req.body;

      const user = await Usuario.findByPk(usuarioId);

      console.log('=== DEBUG CONFIRMAÇÃO EMAIL ===');
      console.log('usuarioId recebido:', usuarioId);
      console.log('codigo recebido:', codigo);
      console.log('codigo salvo:', user?.emailCodigo);
      console.log('expira em:', user?.emailTokenExpiraEn);
      console.log('agora:', new Date());
      console.log('tentativas:', user?.emailCodigoTentativas);
      console.log('emailVerificado:', user?.emailVerificado);

      if (!usuarioId || !codigo) {
        return res.status(400).json({ erro: 'Dados inválidos.' });
      }

      if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      if (user.emailVerificado) {
        return res.json({ sucesso: true, mensagem: 'E-mail já verificado.' });
      }

      if (!user.emailCodigo || !user.emailTokenExpiraEn) {
        return res.status(400).json({ erro: 'Código não gerado.' });
      }

      if (new Date() > user.emailTokenExpiraEn) {
        return res.status(400).json({ erro: 'Código expirado.' });
      }

      if (user.emailCodigoTentativas >= 1) {
        return res.status(403).json({ erro: 'Tentativa excedida.' });
      }

      if (codigo !== user.emailCodigo) {
        user.emailCodigoTentativas += 1;
        await user.save();
        return res.status(400).json({ erro: 'Código inválido.' });
      }

      user.emailVerificado = true;
      user.emailVerificadoEm = new Date();
      user.emailCodigo = null;
      user.emailCodigoTentativas = 0;
      user.emailTokenExpiraEn = null;
      await user.save();

      return res.json({ sucesso: true });

    } catch (e) {
      console.error('Erro em confirmarEmailPorCodigo:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  },

  async reenviarConfirmacao(req, res) {
    try {
      const { usuarioId } = req.body;

      if (!usuarioId) {
        return res.status(400).json({ erro: 'Usuário inválido.' });
      }

      const user = await Usuario.findByPk(usuarioId);
      if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      if (user.emailVerificado) {
        return res.status(400).json({ erro: 'E-mail já confirmado.' });
      }

      user.emailCodigo = gerarCodigo();
      user.emailCodigoTentativas = 0;
      user.emailTokenExpiraEn = addMinutos(15);
      await user.save();

      console.log('=== SIMULAÇÃO DE EMAIL (REENVIO) ===');
      console.log('Código:', user.emailCodigo);

      return res.json({ sucesso: true });

    } catch (e) {
      console.error('Erro em reenviarConfirmacao:', e);
      return res.status(500).json({ erro: 'Erro interno.' });
    }
  }

};
