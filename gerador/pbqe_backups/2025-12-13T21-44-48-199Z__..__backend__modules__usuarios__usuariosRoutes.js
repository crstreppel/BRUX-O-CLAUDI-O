// ======================================================================
// 🧙‍♂️ usuariosRoutes.js • PBQE-C V2 – Módulo Usuários
// ----------------------------------------------------------------------
const express = require('express');
const router = express.Router();
const controller = require('./usuarioController');

router.post('/cadastrar', controller.cadastrarUsuario);
router.post('/login', controller.loginUsuario);
router.get('/confirmar-email', controller.confirmarEmailPorToken);
router.post('/confirmar-codigo', controller.confirmarEmailPorCodigo);
router.post('/reenviar-confirmacao', controller.reenviarConfirmacao);

module.exports = router;