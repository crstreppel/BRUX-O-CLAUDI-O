/* =============================================================
 * 🧙‍♂️ contextoController.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Endpoint de DEBUG/UX para contexto ativo.
 * Somente leitura. Não decide acesso.
 * ============================================================= */

const { resolverContextoAtivo } = require('./contextoAtivoService');

async function contextoAtivo(req, res) {
  try {
    const entidadeId = req.user?.entidadeId;
    if (!entidadeId) {
      return res.status(401).json({ erro: 'Entidade não autenticada.' });
    }

    const contexto = await resolverContextoAtivo({
      entidadeId,
      relacaoId: req.headers['x-relacao-id'] || null,
    });

    return res.json(contexto);
  } catch (err) {
    console.error('Erro ao resolver contexto ativo:', err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { contextoAtivo };
