/* =============================================================
 * 🧙‍♂️ associations.js • Módulo Segurança • PBQE-C
 * -------------------------------------------------------------
 * Associações do domínio SEGURANCA
 * Mantém separação de domínio conforme padrão arquitetural.
 * ============================================================= */

const Area = require('./areasModel');
const Cargo = require('./cargosModel');
const CargoRole = require('./cargoRolesModel');
const CargoArea = require('./cargoAreasModel');
const Solicitacao = require('./solicitacoesModel');

const Status = require('../status/statusModel');
const Role = require('../roles/roleModel');
const Entidade = require('../entidades/entidadesModel');

function aplicarAssociacoesSeguranca() {

  // ==========================
  // Cargo ↔ Role (N:N)
  // ==========================
  Cargo.belongsToMany(Role, {
    through: CargoRole,
    as: 'roles',
    foreignKey: 'cargoId',
    otherKey: 'roleId'
  });

  Role.belongsToMany(Cargo, {
    through: CargoRole,
    as: 'cargos',
    foreignKey: 'roleId',
    otherKey: 'cargoId'
  });

  // ==========================
  // Cargo ↔ Area (N:N)
  // ==========================
  Cargo.belongsToMany(Area, {
    through: CargoArea,
    as: 'areas',
    foreignKey: 'cargoId',
    otherKey: 'areaId'
  });

  Area.belongsToMany(Cargo, {
    through: CargoArea,
    as: 'cargos',
    foreignKey: 'areaId',
    otherKey: 'cargoId'
  });

  // ==========================
  // Solicitacao ↔ Area
  // ==========================
  Solicitacao.belongsTo(Area, {
    as: 'area',
    foreignKey: 'areaId'
  });

  Area.hasMany(Solicitacao, {
    as: 'solicitacoes',
    foreignKey: 'areaId'
  });

  // ==========================
  // Status (comum a todos)
  // ==========================
  Cargo.belongsTo(Status, { as: 'status', foreignKey: 'statusId' });
  Area.belongsTo(Status, { as: 'status', foreignKey: 'statusId' });
  CargoRole.belongsTo(Status, { as: 'status', foreignKey: 'statusId' });
  CargoArea.belongsTo(Status, { as: 'status', foreignKey: 'statusId' });
  Solicitacao.belongsTo(Status, { as: 'status', foreignKey: 'statusId' });

  // ==========================
  // Auditoria (Entidade)
  // ==========================
  const auditoriaModels = [Cargo, Area, CargoRole, CargoArea, Solicitacao];

  auditoriaModels.forEach(model => {
    model.belongsTo(Entidade, { as: 'createdByUser', foreignKey: 'createdBy' });
    model.belongsTo(Entidade, { as: 'updatedByUser', foreignKey: 'updatedBy' });
  });

  // ==========================
  // Solicitacao ↔ Entidade
  // ==========================
  Solicitacao.belongsTo(Entidade, {
    as: 'solicitante',
    foreignKey: 'solicitanteId'
  });

  Solicitacao.belongsTo(Entidade, {
    as: 'aprovador',
    foreignKey: 'aprovadorId'
  });

  Solicitacao.belongsTo(Entidade, {
    as: 'executor',
    foreignKey: 'executorId'
  });

}

module.exports = aplicarAssociacoesSeguranca;
