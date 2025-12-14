const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Status = sequelize.define('Status', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false, unique: true },
  descricao: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deletedAt: { type: DataTypes.DATE },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'status',
  paranoid: true
});

module.exports = Status;
