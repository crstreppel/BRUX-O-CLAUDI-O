/* =============================================================
 * 🧙‍♂️ associations.js • Config Central • PBQE-C
 * -------------------------------------------------------------
 * Orquestra as associações por módulo.
 * Cada domínio mantém seu próprio arquivo de associações.
 * ============================================================= */

module.exports = () => {
  require('../modules/entidades/associations')();
  require('../modules/seguranca/associations')();
};
