/* =============================================================
 * 🧙‍♂️ associations_cargo_funcao.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Associações canônicas: Cargo ↔ Função (N:N)
 * Via tabela de vínculo cargos_funcoes.
 * ============================================================= */

const Cargo = require('./cargoModel');
const Funcao = require('./funcaoModel');
const CargoFuncao = require('./cargoFuncaoModel');

function aplicarAssociacoesCargoFuncao() {
  // Cargo possui muitas Funções
  Cargo.belongsToMany(Funcao, {
    through: CargoFuncao,
    as: 'funcoes',
    foreignKey: 'cargoId',
    otherKey: 'funcaoId',
  });

  // Função pertence a muitos Cargos
  Funcao.belongsToMany(Cargo, {
    through: CargoFuncao,
    as: 'cargos',
    foreignKey: 'funcaoId',
    otherKey: 'cargoId',
  });

  // Vínculo explícito
  CargoFuncao.belongsTo(Cargo, {
    as: 'cargo',
    foreignKey: 'cargoId',
  });

  CargoFuncao.belongsTo(Funcao, {
    as: 'funcao',
    foreignKey: 'funcaoId',
  });
}

module.exports = aplicarAssociacoesCargoFuncao;
