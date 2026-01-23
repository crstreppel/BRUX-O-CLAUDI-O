/* =============================================================
 * 🧙‍♂️ ocupacaoModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Modelo canônico de OCUPAÇÕES.
 * Liga ENTIDADE ↔ CARGO sob STATUS.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection'); // conexão padronizada PBQE-C

const Ocupacao = sequelize.define(
  'Ocupacao',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    entidadeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entidade_id',
    },

    cargoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'cargo_id',
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
      allowNull: true,
      field: 'deleted_at',
    },
  },
  {
    tableName: 'ocupacoes',
    schema: 'entidades',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

module.exports = Ocupacao;
