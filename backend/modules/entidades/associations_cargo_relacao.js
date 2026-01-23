/* =============================================================
 * 🧙‍♂️ associations_cargo_relacao.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Associações canônicas: Relação ↔ Cargo
 * Cargo pertence a UMA Relação.
 * ============================================================= */

const Relacao = require('./relacaoModel');
const Cargo = require('./cargoModel');

function aplicarAssociacoesCargoRelacao() {
  // Relação possui muitos cargos
  Relacao.hasMany(Cargo, {
    as: 'cargos',
    foreignKey: 'relacaoId',
  });

  // Cargo pertence a uma relação
  Cargo.belongsTo(Relacao, {
    as: 'relacao',
    foreignKey: 'relacaoId',
  });
}

module.exports = aplicarAssociacoesCargoRelacao;
