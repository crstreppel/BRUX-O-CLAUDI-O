/* =============================================================
 * 🧙‍♂️ contextoAtivoService.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Integração LEITURA com Login.
 * Dado entidadeId autenticado, resolve o CONTEXTO ATIVO:
 * Entidade → Relação → Cargo → Funções
 * (Sem decidir acesso no login)
 * ============================================================= */

const Entidade = require('./entidadesModel');
const Relacao = require('./relacaoModel');
const Cargo = require('./cargoModel');
const Funcao = require('./funcaoModel');

async function resolverContextoAtivo({ entidadeId, relacaoId = null }) {
  // 1) Carregar entidade
  const entidade = await Entidade.findByPk(entidadeId);
  if (!entidade) return null;

  // 2) Determinar relação (se não vier, pega a primeira ativa)
  let relacao = null;
  if (relacaoId) {
    relacao = await Relacao.findOne({
      where: { id: relacaoId, ativo: true },
    });
  } else {
    relacao = await Relacao.findOne({
      where: { entidadeOrigemId: entidadeId, ativo: true },
      order: [['createdAt', 'ASC']],
    });
  }

  if (!relacao) {
    return { entidade, relacao: null, cargos: [], funcoes: [] };
  }

  // 3) Cargos da relação
  const cargos = await Cargo.findAll({
    where: { relacaoId: relacao.id, ativo: true },
    include: [
      {
        model: Funcao,
        as: 'funcoes',
        where: { ativo: true },
        required: false,
      },
    ],
  });

  // 4) Normalizar funções únicas
  const funcoesMap = new Map();
  for (const cargo of cargos) {
    if (cargo.funcoes) {
      for (const f of cargo.funcoes) funcoesMap.set(f.id, f);
    }
  }

  return {
    entidade,
    relacao,
    cargos,
    funcoes: Array.from(funcoesMap.values()),
  };
}

module.exports = { resolverContextoAtivo };
