const { Sequelize } = require('sequelize');

// Instância única do Sequelize (PBQE-C SINGLETON)
const sequelize = new Sequelize('petropolitan_lab', 'bruxao', 'bruxao123', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
