// PBQE-C • Auth config central
// Responsável por JWT (segredo e expiração)
// Padrão V1: require explícito, sem dotenv

module.exports = {
  jwtSecret: 'PBQE_SUPER_SECRET_CHANGEME',
  jwtExpiresIn: '1h'
};
