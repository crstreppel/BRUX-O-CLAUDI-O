/* =============================================================
 * 🧙‍♂️ associations.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Agregador central de associações Sequelize
 * Padrão real do projeto (snapshot validado)
 * ============================================================= */

module.exports = () => {
  // ÚNICA associação com arquivo dedicado no projeto
  require('../modules/entidades/associations')();
};
