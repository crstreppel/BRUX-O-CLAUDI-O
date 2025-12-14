const { Sequelize } = require('sequelize');

// Instância única do Sequelize (Padrão SINGLETON PBQE-C)
const sequelize = new Sequelize('petropolitan_lab', 'bruxao', 'bruxao123', {
  host: 'localhost',
  dialect: 'postgres'
});

// Carrega associações após os models (models importam esta conexão)
const initAssociations = require('./associations');
initAssociations();

module.exports = sequelize;
