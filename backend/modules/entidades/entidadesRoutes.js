const express = require('express');
const router = express.Router();

const entidadesController = require('./entidadesController');
const authMiddleware = require('../guard/authMiddleware');

router.use(authMiddleware);

router.get('/', entidadesController.listar);
router.post('/', entidadesController.criar);
router.get('/:id', entidadesController.buscarPorId);
router.put('/:id', entidadesController.atualizar);
router.delete('/:id', entidadesController.excluir);

module.exports = router;
