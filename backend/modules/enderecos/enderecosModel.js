/* =============================================================
 * 🧙‍♂️ enderecosModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model canônico de ENDEREÇOS
 * Endereço sempre pertence a uma ENTIDADE.
 * Cobrança/Entrega são resolvidas via RELAÇÕES, não aqui.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const Entidade = require('../entidades/entidadesModel');

const Endereco = sequelize.define('Endereco', {
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

  sequencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  cep: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },

  logradouro: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },

  numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },

  complemento: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  condominio: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  edificio: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  bloco: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },

  unidade: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },

  bairro: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  cidade: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  uf: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },

  pais: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'BR',
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
    field: 'deleted_at',
  },
}, {
  tableName: 'enderecos',
  schema: 'entidades',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

Endereco.belongsTo(Entidade, { as: 'entidade', foreignKey: 'entidadeId' });
Entidade.hasMany(Endereco, { as: 'enderecos', foreignKey: 'entidadeId' });

module.exports = Endereco;
