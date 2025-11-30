const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('petropolitan_lab', 'bruxao', 'bruxao123', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('🔥 Banco de dados conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no banco:', error.message);
  }
}

testarConexao();

module.exports = sequelize;