const Usuario = require('../modules/usuarios/usuarioModel');
const Role = require('../modules/roles/roleModel');
const Permissao = require('../modules/permissoes/permissaoModel');
const Status = require('../modules/status/statusModel');

module.exports = () => {

  // Usuario -> Role
  Usuario.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
  });

  Role.hasMany(Usuario, {
    foreignKey: 'roleId',
    as: 'usuarios'
  });

  // Role -> Status
  Role.belongsTo(Status, {
    foreignKey: 'statusId',
    as: 'status'
  });

  // Permissao -> Status
  Permissao.belongsTo(Status, {
    foreignKey: 'statusId',
    as: 'status'
  });

  // Role <-> Permissao (many-to-many)
  Role.belongsToMany(Permissao, {
    through: 'roles_permissoes',
    as: 'permissoes',
    foreignKey: 'roleId'
  });

  Permissao.belongsToMany(Role, {
    through: 'roles_permissoes',
    as: 'roles',
    foreignKey: 'permissaoId'
  });
};
