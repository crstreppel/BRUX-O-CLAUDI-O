const { Sequelize } = require('sequelize');

// =============================================================
// 🔥 Conexão PBQE-C com Postgres (modo Maria Fumaça)
// =============================================================

const sequelize = new Sequelize('petropolitan_lab', 'bruxao', 'bruxao123', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false // deixa o console limpo
});

// Testa a conexão automaticamente
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔥 Banco de dados conectado com sucesso!');

    // Sincroniza modelos → cria/ajusta tabelas
    await sequelize.sync({ alter: true });
    console.log('🔥 Tabelas sincronizadas (alter mode).');

  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error.message);
  }
})();

module.exports = sequelize;