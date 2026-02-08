/* =============================================================
 * 🧙‍♂️ cargosModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model do CARGO
 * Estrutura hierárquica organizacional com governança formal.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Cargo = sequelize.define('Cargo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  descricao: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  subnivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  podeAprovarSolicitacoes: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'pode_aprovar_solicitacoes',
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
  tableName: 'cargos',
  schema: 'seguranca',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

module.exports = Cargo;
