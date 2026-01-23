/* =============================================================
 * 🧙‍♂️ contextoRoutes.js • Petropolitan V2 • PBQE-C
 * -------------------------------------------------------------
 * Rotas de contexto ativo (DEBUG/UX)
 * ============================================================= */

const express = require('express');
const router = express.Router();

const contextoController = require('./contextoController');
const autorizacao = require('./autorizacaoMiddleware');

// Endpoint de debug: apenas exige entidade autenticada
router.get('/contexto/ativo', autorizacao('*'), contextoController.contextoAtivo);

module.exports = router;
