/* =============================================================
 * 🧙‍♂️ cargoModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Modelo canônico de CARGOS.
 * Cargo define posição da entidade dentro de UMA relação.
 * Não define poder (funções vêm depois).
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection'); // conexão padronizada PBQE-C

const Cargo = sequelize.define(
  'Cargo',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    relacaoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'relacao_id',
    },

    nomeCargo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nome_cargo',
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
    tableName: 'cargos',
    schema: 'entidades',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

module.exports = Cargo;
