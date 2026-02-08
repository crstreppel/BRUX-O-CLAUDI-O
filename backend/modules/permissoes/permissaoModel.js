// ======================================================================
// 🧙‍♂️ permissaoModel.js • PBQE-C V2 (alinhado ao schema real)
// ----------------------------------------------------------------------
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');
const Status = require('../status/statusModel');

const Permissao = sequelize.define('Permissao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chave: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true
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

// ----------------------------------------------------------------------
// Associações
// ----------------------------------------------------------------------
Permissao.belongsTo(Status, {
  as: 'status',
  foreignKey: 'statusId'
});

module.exports = Permissao;
