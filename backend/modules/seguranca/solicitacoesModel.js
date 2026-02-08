/* =============================================================
 * 🧙‍♂️ solicitacoesModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model de SOLICITAÇÕES
 * Motor de governança formal e workflow estrutural.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Solicitacao = sequelize.define('Solicitacao', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  tipo: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },

  entidadeAlvo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'entidade_alvo',
  },

  idAlvo: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'id_alvo',
  },

  dadosOriginais: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'dados_originais',
  },

  dadosPropostos: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'dados_propostos',
  },

  areaId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'area_id',
  },

  solicitanteId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'solicitante_id',
  },

  aprovadorId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'aprovador_id',
  },

  executorId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'executor_id',
  },

  statusSolicitacao: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'status_solicitacao',
    validate: {
      isIn: [['PENDENTE', 'APROVADA', 'REJEITADA']],
    },
  },

  motivoRejeicao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'motivo_rejeicao',
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

  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by',
  },

  updatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'updated_by',
  },

}, {
  tableName: 'solicitacoes',
  schema: 'seguranca',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

module.exports = Solicitacao;
