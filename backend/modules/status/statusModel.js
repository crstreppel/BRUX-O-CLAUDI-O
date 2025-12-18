const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Status = sequelize.define('Status', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nome: { type: DataTypes.STRING, allowNull: false, unique: true },
  descricao: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, {
  tableName: 'status',
  paranoid: true,
  underscored: true
});

module.exports = Status;
