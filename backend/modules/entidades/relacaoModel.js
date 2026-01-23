/* =============================================================
 * 🧙‍♂️ relacaoModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Modelo canônico de RELAÇÕES entre entidades.
 * RELAÇÃO define CONTEXTO. Não define poder.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection'); // conexão padronizada PBQE-C

const Relacao = sequelize.define(
  'Relacao',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    entidadeOrigemId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entidade_origem_id',
    },

    entidadeDestinoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'entidade_destino_id',
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
    tableName: 'relacoes',
    schema: 'entidades',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

module.exports = Relacao;
