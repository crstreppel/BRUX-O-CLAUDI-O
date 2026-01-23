/* =============================================================
 * 🧙‍♂️ nivelAcessoModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Modelo canônico de NÍVEIS DE ACESSO.
 * Nível é hierárquico, absoluto e comparável.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection'); // conexão padronizada PBQE-C

const NivelAcesso = sequelize.define(
  'NivelAcesso',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    codigo: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: true,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'niveis_acesso',
    schema: 'entidades',
    timestamps: true,
    paranoid: false,
    underscored: true,
  }
);

module.exports = NivelAcesso;
