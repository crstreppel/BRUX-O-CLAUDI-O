const express = require('express');
const router = express.Router();
const controller = require('./areasController.js');

const auth = require('../guard/authMiddleware.js');
const permission = require('../guard/permissionMiddleware.js');

router.post('/criar', auth, permission('areas.criar'), controller.criar);
router.get('/listar', auth, permission('areas.listar'), controller.listar);
router.put('/atualizar/:id', auth, permission('areas.atualizar'), controller.atualizar);
router.delete('/excluir/:id', auth, permission('areas.excluir'), controller.excluir);

module.exports = router;
