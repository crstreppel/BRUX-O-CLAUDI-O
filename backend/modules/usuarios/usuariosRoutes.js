const express = require('express');
const router = express.Router();

const usuarioController = require('./usuarioController');
const loginController = require('./loginController');

router.post('/cadastrar', usuarioController.cadastrarUsuario);

// LOGIN JWT OFICIAL (PBQE-C)
router.post('/login', loginController.login);

router.get('/confirmar-email', usuarioController.confirmarEmailPorToken);
router.post('/confirmar-codigo', usuarioController.confirmarEmailPorCodigo);
router.post('/reenviar-confirmacao', usuarioController.reenviarConfirmacao);

module.exports = router;
