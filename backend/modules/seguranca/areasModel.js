/* =============================================================
 * 🧙‍♂️ areasModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model da ÁREA
 * Estrutura plana de domínio organizacional.
 * Define escopo de atuação e aprovação.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Area = sequelize.define('Area', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  nome: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
  },

  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
  tableName: 'areas',
  schema: 'seguranca',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

module.exports = Area;
