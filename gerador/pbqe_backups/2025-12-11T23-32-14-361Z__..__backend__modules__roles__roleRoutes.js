const express = require('express');
const router = express.Router();
const controller = require('./roleController.js');

router.post('/criar', controller.criar);
router.get('/listar', controller.listar);
router.put('/atualizar/:id', controller.atualizar);
router.delete('/excluir/:id', controller.excluir);

module.exports = router;
