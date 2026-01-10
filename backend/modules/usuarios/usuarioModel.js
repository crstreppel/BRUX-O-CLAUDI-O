const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

const Usuario = sequelize.define("Usuario", {
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  senhaHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "senha_hash"
  },

  emailVerificado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: "email_verificado"
  },

  emailVerificadoEm: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "email_verificado_em"
  },

  emailToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "email_token"
  },

  emailTokenExpiraEn: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "email_token_expira_en"
  },

  emailCodigo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "email_codigo"
  },

  emailCodigoTentativas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "email_codigo_tentativas"
  },

  statusId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "status_id"
  },

  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "role_id"
  },

  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  /* ===== RESET DE SENHA ===== */

  resetCodigo: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: "reset_codigo"
  },

  resetCodigoExpiraEm: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "reset_codigo_expira_em"
  },

  resetCodigoTentativas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "reset_codigo_tentativas"
  }

}, {
  tableName: "usuarios",
  paranoid: true,
  underscored: true
});

module.exports = Usuario;
