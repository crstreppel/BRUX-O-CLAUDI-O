// ======================================================================
// 🧙‍♂️ auditoriaModel.js • PBQE-C – Auditoria mínima de eventos (SEGURANCA)
// ----------------------------------------------------------------------
// Hardening Essencial (PBQE-SEC-001)
// Objetivo: trilha mínima de eventos críticos (LOGIN/LOGOUT/TROCA_SENHA)
// ======================================================================

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const AuditoriaEvento = sequelize.define('AuditoriaEvento', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },

  evento: {
    type: DataTypes.STRING(50),
    allowNull: false
  },

  sucesso: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  usuarioId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'usuario_id'
  },

  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  ip: {
    type: DataTypes.STRING(64),
    allowNull: true
  },

  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent'
  },

  motivo: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  schema: 'seguranca',
  tableName: 'auditoria_eventos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = AuditoriaEvento;
