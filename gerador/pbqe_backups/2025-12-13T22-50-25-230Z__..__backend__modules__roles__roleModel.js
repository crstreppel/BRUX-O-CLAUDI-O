const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false, unique: true },
  descricao: { type: DataTypes.STRING, allowNull: false },
  statusId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  deletedAt: { type: DataTypes.DATE },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false }
}, {
  tableName: 'roles',
  paranoid: true
});

module.exports = Role;
