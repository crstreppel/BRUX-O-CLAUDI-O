// ======================================================================
// 🧙‍♂️ usuarioModel.js • PBQE-C V2 – Módulo Usuários (ARGON2id)
// ----------------------------------------------------------------------
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const argon2 = require('argon2');

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

// ======================================================================
// 🔐 Hooks PBQE-C – Hash automático da senha (Argon2id)
// ----------------------------------------------------------------------
Usuario.beforeCreate(async (usuario) => {
  if (usuario.senhaHash) {
    usuario.senhaHash = await argon2.hash(usuario.senhaHash, {
      type: argon2.argon2id,
    });
  }
});

Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('senhaHash')) {
    usuario.senhaHash = await argon2.hash(usuario.senhaHash, {
      type: argon2.argon2id,
    });
  }
});

// ======================================================================
// 🔎 Método de instância – Validação de senha
// ----------------------------------------------------------------------
Usuario.prototype.validarSenha = async function (senhaPlain) {
  return argon2.verify(this.senhaHash, senhaPlain);
};

module.exports = Usuario;
