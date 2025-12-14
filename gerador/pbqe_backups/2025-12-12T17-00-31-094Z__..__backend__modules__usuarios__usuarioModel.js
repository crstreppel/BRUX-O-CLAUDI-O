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
      primaryKey: true,
    },

    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },

    senhaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'senha_hash',
    },

    emailVerificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verificado',
    },

    emailToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'email_token',
    },

    emailTokenExpiraEn: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'email_token_expira_en',
    },

    emailCodigo: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'email_codigo',
    },

    emailCodigoTentativas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'email_codigo_tentativas',
    },

    statusId: {
      type: DataTypes.UUID,
      allowNull: true,
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
    tableName: 'usuarios',
    paranoid: true,
    timestamps: true,
    underscored: true,
  }
);

module.exports = Usuario;
