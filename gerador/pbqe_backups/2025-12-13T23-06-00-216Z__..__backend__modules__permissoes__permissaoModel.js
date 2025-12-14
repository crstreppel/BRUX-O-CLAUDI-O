// ======================================================================
// 🧙‍♂️ permissaoModel.js • PBQE-C V2
// ----------------------------------------------------------------------
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Permissao = sequelize.define('Permissao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  acao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chave: {
    type: DataTypes.STRING,
    allowNull: false
  },
  statusId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'status_id'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'permissoes',
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at'
});

module.exports = Permissao;
