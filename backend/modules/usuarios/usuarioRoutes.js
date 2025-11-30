const express = require('express');
const router = express.Router();

const controller = require('./usuarioController');

// =============================================================
// Rotas do módulo Usuarios (Maria Fumaça PBQE-C)
// =============================================================

// Cadastro
router.post('/cadastrar', controller.cadastrarUsuario);

// Login
router.post('/login', controller.loginUsuario);

module.exports = router;