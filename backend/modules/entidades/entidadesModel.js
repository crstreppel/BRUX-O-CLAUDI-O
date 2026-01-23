/* =============================================================
 * 🧙‍♂️ entidadesModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model canônico da ENTIDADE
 * Identidade pura. Base absoluta do sistema.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Entidade = sequelize.define('Entidade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
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
}, {
  tableName: 'entidades',
  schema: 'entidades',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

module.exports = Entidade;
