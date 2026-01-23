/* =============================================================
 * 🧙‍♂️ autorizacaoMiddleware.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Middleware de AUTORIZAÇÃO.
 * Consome contexto ativo (Entidade → Relação → Cargo → Funções).
 * Login apenas autentica.
 * ============================================================= */

const { resolverContextoAtivo } = require('./contextoAtivoService');

/**
 * Uso:
 * router.get('/rota', autorizacao('usuarios.criar'), handler)
 */
function autorizacao(codigoFuncao) {
  return async function (req, res, next) {
    try {
      const entidadeId = req.user?.entidadeId;
      if (!entidadeId) {
        return res.status(401).json({ erro: 'Entidade não autenticada.' });
      }

      // Resolve contexto ativo (leitura)
      const contexto = await resolverContextoAtivo({
        entidadeId,
        relacaoId: req.headers['x-relacao-id'] || null,
      });

      if (!contexto || !contexto.relacao) {
        return res.status(403).json({ erro: 'Nenhum contexto ativo disponível.' });
      }

      const possuiFuncao = contexto.funcoes.some(
        (f) => f.codigo === codigoFuncao && f.ativo === true
      );

      if (!possuiFuncao) {
        return res.status(403).json({ erro: 'Acesso negado.' });
      }

      // Anexa contexto para uso posterior
      req.contextoAtivo = contexto;

      return next();
    } catch (err) {
      console.error('Erro no middleware de autorização:', err);
      return res.status(500).json({ erro: 'Erro interno de autorização.' });
    }
  };
}

module.exports = autorizacao;
