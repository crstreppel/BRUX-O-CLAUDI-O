// PBQE-C • Auth config central
// Responsável por JWT (segredo e expiração)
// Padrão V1: require explícito, sem dotenv
//
// 🔒 Hardening Essencial (PBQE-SEC-001):
// - Segredo NÃO pode ficar hardcoded no repositório.
// - Fonte de segredo: variáveis de ambiente (preferencial) ou arquivo local não versionado.
// - Expiração centralizada (fonte única).

function carregarSegredoJWT() {
  // 1) Preferência: ambiente
  let secret = process.env.PBQE_JWT_SECRET || process.env.JWT_SECRET;

  // 2) Fallback controlado: arquivo local (NÃO versionar)
  if (!secret) {
    try {
      const local = require('./local_secrets');
      secret = local && local.jwtSecret;
    } catch (e) {
      // sem arquivo local, segue
    }
  }

  if (!secret || typeof secret !== 'string' || secret.trim().length < 24) {
    // 24+ chars para evitar segredo fraco (regra simples e prática)
    throw new Error(
      'JWT secret não configurado ou fraco. Defina PBQE_JWT_SECRET (ou JWT_SECRET) no ambiente, ' +
      'ou crie ./config/local_secrets.js com { jwtSecret: "..." } (não versionar).'
    );
  }

  return secret.trim();
}

module.exports = {
  jwtSecret: carregarSegredoJWT(),
  jwtExpiresIn: '1h' // ✅ Fonte única (Hardening Essencial)
};
