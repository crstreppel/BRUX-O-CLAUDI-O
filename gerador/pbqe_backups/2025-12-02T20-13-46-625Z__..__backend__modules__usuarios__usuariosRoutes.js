const express = require('express');
const router = express.Router();
const controller = require('./usuarioController');

// Rotas de API do módulo Usuarios (Maria Fumaça PBQE-C)
router.post('/cadastrar', controller.cadastrarUsuario);
router.post('/login', controller.loginUsuario);

module.exports = router;