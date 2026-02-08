/* =============================================================
 * 🧙‍♂️ entidadesModel.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Model canônico da ENTIDADE
 * Identidade pura. Base absoluta do sistema.
 * ============================================================= */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

const Entidade = sequelize.define('Entidade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  // Antes: nome
  // Agora: nome_razao (renomeado no model; a coluna será ajustada no banco no próximo passo)
  nomeRazao: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: 'nome_razao',
  },

  nomeFantasia: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'nome_fantasia',
  },

  tipoPessoa: {
    type: DataTypes.STRING(2),
    allowNull: false,
    field: 'tipo_pessoa',
    validate: {
      isIn: [['PF', 'PJ']],
    },
  },

  // Natureza ontológica da entidade
  // AGENTE   -> inicia ações, decide, assume papéis
  // REAGENTE -> não inicia ações; reage a estímulos de um agente
  natureza: {
    type: DataTypes.STRING(8),
    allowNull: false,
    field: 'natureza',
    validate: {
      isIn: [['AGENTE', 'REAGENTE']],
      isImmutable(value) {
        if (!this.isNewRecord && this.previous('natureza') !== value) {
          throw new Error('natureza é imutável após a criação da entidade.');
        }
      }
    }
  },

  // PF: CPF completo (11)
  // PJ: CNPJ base (8)
  documentoRaiz: {
    type: DataTypes.STRING(11),
    allowNull: false,
    field: 'documento_raiz',
    validate: {
      isValidDocumentoRaiz(value) {
        const v = String(value ?? '').replace(/\D/g, '');
        const tipo = String(this.tipoPessoa ?? '').toUpperCase();

        if (!v) throw new Error('documento_raiz é obrigatório.');

        if (tipo === 'PF') {
          if (v.length !== 11) throw new Error('PF exige CPF com 11 dígitos em documento_raiz.');
        } else if (tipo === 'PJ') {
          if (v.length !== 8) throw new Error('PJ exige CNPJ base com 8 dígitos em documento_raiz.');
        } else {
          throw new Error('tipo_pessoa inválido (use PF ou PJ).');
        }
      },
    },
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
  tableName: 'entidades',
  schema: 'entidades',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: false,
});

module.exports = Entidade;
