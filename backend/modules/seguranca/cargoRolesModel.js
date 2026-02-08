/* =============================================================
 * 🧙‍♂️ cargoRolesModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model da relação CARGO ↔ ROLE (N:N)
 * Vincula estrutura organizacional à segurança técnica.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const CargoRole = sequelize.define('CargoRole', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  cargoId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'cargo_id',
  },

  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'role_id',
  },

  statusId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'status_id',
  },

  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at',
  },

  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by',
  },

  updatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'updated_by',
  },

}, {
  tableName: 'cargo_roles',
  schema: 'seguranca',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

module.exports = CargoRole;
