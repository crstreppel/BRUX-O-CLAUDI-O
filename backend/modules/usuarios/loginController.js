// ======================================================================
// 🧙‍♂️ loginController.js • PBQE-C V2 – Autenticação (Argon2id)
// ----------------------------------------------------------------------
// Hardening Essencial (PBQE-SEC-001):
// - Expiração centralizada (config/auth.js)
// - Rate limit / lockout simples (anti brute force)
// - Auditoria mínima de eventos (seguranca.auditoria_eventos)
// ======================================================================

const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const Usuario = require('./usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');
const AuditoriaEvento = require('../seguranca/auditoriaModel');

const authConfig = require('../../config/auth');
const JWT_SECRET = authConfig.jwtSecret;
const JWT_EXPIRES_IN = authConfig.jwtExpiresIn;

// ===============================
// Rate limit / lockout em memória
// ===============================
// Observação: Hardening Essencial (simples, single instance).
// Para V3 (nível banco): sessão revogável + controle persistente.
const tentativas = new Map();
// chave = email|ip => { falhas, bloqueadoAte, ultimoErroEm }
const MAX_FALHAS = 5;
const BLOQUEIO_MINUTOS = 15;

function getIp(req) {
  // Se houver proxy, ajustar mais tarde. Por ora: o que o Express fornece.
  return (req.ip || req.connection?.remoteAddress || '').toString();
}

function chaveTentativa(emailNorm, ip) {
  return `${emailNorm}|${ip}`;
}

function agoraMs() {
  return Date.now();
}

async function auditar({ evento, sucesso, usuarioId, email, ip, userAgent, motivo }) {
  try {
    await AuditoriaEvento.create({
      evento,
      sucesso: !!sucesso,
      usuarioId: usuarioId || null,
      email: email || null,
      ip: ip || null,
      userAgent: userAgent || null,
      motivo: motivo || null
    });
  } catch (e) {
    // Auditoria nunca pode derrubar login
    console.error('[PBQE-AUDITORIA-ERRO]', e.message);
  }
}

module.exports = {
  async login(req, res) {
    const ip = getIp(req);
    const userAgent = (req.headers['user-agent'] || '').toString();

    try {
      let { email, senha } = req.body;

      if (!email || !senha) {
        await auditar({
          evento: 'LOGIN_FALHA',
          sucesso: false,
          email: email || null,
          ip,
          userAgent,
          motivo: 'EMAIL_OU_SENHA_AUSENTE'
        });
        return res.status(400).json({ ok: false, erro: 'E-mail e senha são obrigatórios.' });
      }

      const emailNorm = email.trim().toLowerCase();
      const key = chaveTentativa(emailNorm, ip);
      const entry = tentativas.get(key) || { falhas: 0, bloqueadoAte: 0, ultimoErroEm: 0 };

      if (entry.bloqueadoAte && entry.bloqueadoAte > agoraMs()) {
        await auditar({
          evento: 'LOGIN_BLOQUEADO',
          sucesso: false,
          email: emailNorm,
          ip,
          userAgent,
          motivo: 'LOCKOUT_ATIVO'
        });
        return res.status(429).json({
          ok: false,
          erro: 'Muitas tentativas. Tente novamente em alguns minutos.'
        });
      }

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
        entry.falhas += 1;
        entry.ultimoErroEm = agoraMs();
        if (entry.falhas >= MAX_FALHAS) {
          entry.bloqueadoAte = agoraMs() + BLOQUEIO_MINUTOS * 60 * 1000;
        }
        tentativas.set(key, entry);

        await auditar({
          evento: entry.bloqueadoAte > agoraMs() ? 'LOGIN_BLOQUEADO' : 'LOGIN_FALHA',
          sucesso: false,
          email: emailNorm,
          ip,
          userAgent,
          motivo: 'USUARIO_NAO_ENCONTRADO'
        });

        return res.status(401).json({ ok: false, erro: 'Credenciais inválidas.' });
      }

      if (!usuario.emailVerificado) {
        await auditar({
          evento: 'LOGIN_FALHA',
          sucesso: false,
          usuarioId: usuario.id,
          email: emailNorm,
          ip,
          userAgent,
          motivo: 'EMAIL_NAO_VERIFICADO'
        });

        return res.status(401).json({
          ok: false,
          motivo: 'EMAIL_NAO_VERIFICADO',
          mensagem: 'Confirme seu e-mail antes de entrar.'
        });
      }

      if (!usuario.ativo) {
        await auditar({
          evento: 'LOGIN_FALHA',
          sucesso: false,
          usuarioId: usuario.id,
          email: emailNorm,
          ip,
          userAgent,
          motivo: 'USUARIO_INATIVO'
        });
        return res.status(403).json({ ok: false, erro: 'Usuário inativo.' });
      }

      if (!usuario.statusId) {
        await auditar({
          evento: 'LOGIN_FALHA',
          sucesso: false,
          usuarioId: usuario.id,
          email: emailNorm,
          ip,
          userAgent,
          motivo: 'SEM_STATUS'
        });
        return res.status(403).json({ ok: false, erro: 'Usuário sem status válido.' });
      }

      const senhaOk = await argon2.verify(usuario.senhaHash, senha);
      if (!senhaOk) {
        entry.falhas += 1;
        entry.ultimoErroEm = agoraMs();
        if (entry.falhas >= MAX_FALHAS) {
          entry.bloqueadoAte = agoraMs() + BLOQUEIO_MINUTOS * 60 * 1000;
        }
        tentativas.set(key, entry);

        await auditar({
          evento: entry.bloqueadoAte > agoraMs() ? 'LOGIN_BLOQUEADO' : 'LOGIN_FALHA',
          sucesso: false,
          usuarioId: usuario.id,
          email: emailNorm,
          ip,
          userAgent,
          motivo: 'SENHA_INVALIDA'
        });

        return res.status(401).json({ ok: false, erro: 'Credenciais inválidas.' });
      }

      // sucesso: zera falhas
      tentativas.delete(key);

      const permissoes = usuario.role?.permissoes?.map(p => p.chave) || [];

      const payload = {
        id: usuario.id,
        usuario: usuario.usuario,
        email: usuario.email,
        role: usuario.role?.nome || null,
        permissoes
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      await auditar({
        evento: 'LOGIN_OK',
        sucesso: true,
        usuarioId: usuario.id,
        email: emailNorm,
        ip,
        userAgent,
        motivo: null
      });

      return res.json({
        mensagem: 'Login efetuado com sucesso.',
        usuario: payload,
        token
      });

    } catch (err) {
      console.error('[PBQE-LOGIN-ERROR]', err);
      await auditar({
        evento: 'LOGIN_FALHA',
        sucesso: false,
        email: (req.body && req.body.email) ? String(req.body.email).trim().toLowerCase() : null,
        ip,
        userAgent,
        motivo: 'ERRO_INTERNO: ' + err.message
      });
      return res.status(500).json({ ok: false, erro: 'Erro interno no login.' });
    }
  }
};
