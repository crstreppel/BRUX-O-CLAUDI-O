/* =============================================================
 * 🧙‍♂️ funcaoModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Modelo canônico de FUNÇÕES.
 * Função define permissão técnica, sem contexto.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection'); // conexão padronizada PBQE-C

const Funcao = sequelize.define(
  'Funcao',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    codigo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },

    descricao: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'funcoes',
    schema: 'entidades',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

module.exports = Funcao;
