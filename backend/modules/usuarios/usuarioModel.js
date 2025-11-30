const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

// Modelo simples de usuário (Maria Fumaça)
const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = Usuario;