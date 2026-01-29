const express = require('express');
const router = express.Router();

const enderecosController = require('./enderecosController');
const authMiddleware = require('../guard/authMiddleware');

router.use(authMiddleware);

router.post('/', enderecosController.criar);
router.get('/entidade/:entidadeId', enderecosController.listarPorEntidade);
router.delete('/:id', enderecosController.inativar);

module.exports = router;
