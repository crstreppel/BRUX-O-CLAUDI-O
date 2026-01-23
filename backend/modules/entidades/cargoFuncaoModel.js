/* =============================================================
 * 🧙‍♂️ cargoFuncaoModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Vínculo canônico CARGO ↔ FUNÇÃO.
 * Onde o poder nasce (funções atribuídas ao cargo).
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection'); // conexão padronizada PBQE-C

const CargoFuncao = sequelize.define(
  'CargoFuncao',
  {
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

    funcaoId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'funcao_id',
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
    tableName: 'cargos_funcoes',
    schema: 'entidades',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

module.exports = CargoFuncao;
