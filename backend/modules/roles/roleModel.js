// ======================================================================
// 🧙‍♂️ roleModel.js • PBQE-C V2
// ----------------------------------------------------------------------
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const Status = require('../status/statusModel');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING
  },
  statusId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'status_id'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'roles',
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at'
});

// ======================================================================
// Associações
// ----------------------------------------------------------------------
// Role possui um Status (ATIVO, INATIVO, etc.)
Role.belongsTo(Status, {
  as: 'status',
  foreignKey: 'statusId'
});

module.exports = Role;
