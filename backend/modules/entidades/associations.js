/* =============================================================
 * 🧙‍♂️ associations.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Associações canônicas do módulo ENTIDADES.
 * ============================================================= */

const Entidade = require('./entidadesModel');
const Relacao = require('./relacaoModel');
const Status = require('../status/statusModel');

// LOGIN DEPENDENCIES (já existentes no projeto)
const Usuario = require('../usuarios/usuarioModel');
const Role = require('../roles/roleModel');
const Permissao = require('../permissoes/permissaoModel');

function aplicarAssociacoes() {
  // Entidade como origem da relação
  Entidade.hasMany(Relacao, {
    as: 'relacoesOrigem',
    foreignKey: 'entidadeOrigemId',
  });

  // Entidade como destino da relação
  Entidade.hasMany(Relacao, {
    as: 'relacoesDestino',
    foreignKey: 'entidadeDestinoId',
  });

  // Relação aponta para entidade de origem
  Relacao.belongsTo(Entidade, {
    as: 'origem',
    foreignKey: 'entidadeOrigemId',
  });

  // Relação aponta para entidade de destino
  Relacao.belongsTo(Entidade, {
    as: 'destino',
    foreignKey: 'entidadeDestinoId',
  });

  // Associação Entidade -> Status
  Entidade.belongsTo(Status, {
    as: 'status',
    foreignKey: 'statusId',
  });

  // Associação Status -> Entidades
  Status.hasMany(Entidade, {
    as: 'entidades',
    foreignKey: 'statusId',
  });

  // --- ADIÇÕES PBQE-C (login dependencies) ---
  Usuario.belongsTo(Role, { as: 'role', foreignKey: 'roleId' });
  Role.hasMany(Usuario, { as: 'usuarios', foreignKey: 'roleId' });

  Role.belongsToMany(Permissao, {
    through: 'roles_permissoes',
    as: 'permissoes',
    foreignKey: 'roleId',
    otherKey: 'permissaoId'
  });
  // --- FIM ADIÇÕES ---
}

module.exports = aplicarAssociacoes;
