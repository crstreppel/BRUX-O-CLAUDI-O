module.exports = (sequelize, models) => {
  const Usuario = models.Usuario;
  const Role = models.Role;
  const Permissao = models.Permissao;
  const Status = models.Status;

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
