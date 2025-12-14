const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Permissao = sequelize.define('Permissao', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  descricao: { type: DataTypes.STRING, allowNull: false },
  modulo: { type: DataTypes.STRING, allowNull: false },
  acao: { type: DataTypes.STRING, allowNull: false },
  chave: { type: DataTypes.STRING, allowNull: false, unique: true },

  statusId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

  deletedAt: { type: DataTypes.DATE },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'permissoes',
  paranoid: true
});

module.exports = Permissao;
