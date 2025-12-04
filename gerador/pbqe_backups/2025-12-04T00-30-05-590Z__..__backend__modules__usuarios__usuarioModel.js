// ======================================================================
// 🧙‍♂️ usuarioModel.js • PBQE-C V2 – Módulo Usuários
// ----------------------------------------------------------------------
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    senhaHash: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    emailVerificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailToken: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    emailTokenExpiraEn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    emailCodigo: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    emailCodigoTentativas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    statusId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'usuarios',
    paranoid: true,
    timestamps: true,
    underscored: true
  }
);

module.exports = Usuario;