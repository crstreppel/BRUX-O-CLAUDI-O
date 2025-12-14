const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('petropolitan_lab', 'bruxao', 'bruxao123', {
  host: 'localhost',
  dialect: 'postgres'
});

// 🔥 PBQE-C Associations Loader
const initAssociations = require('./associations');
initAssociations(sequelize, sequelize.models);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔥 Banco de dados conectado com sucesso!');

    // PBQE-C MODE: sem alter, sem force. Quem manda é a migration.
    await sequelize.sync();
    console.log('🔥 Tabelas sincronizadas (migration mode).');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error);
  }
})();

module.exports = sequelize;
