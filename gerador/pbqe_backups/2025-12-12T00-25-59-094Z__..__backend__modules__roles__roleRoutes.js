const express = require('express');
const router = express.Router();
const controller = require('./roleController.js');
const { auth, permission } = require('../guard/gatekeeper.js');

router.post('/criar', auth, permission('roles.criar'), controller.criar);
router.get('/listar', auth, permission('roles.listar'), controller.listar);
router.put('/atualizar/:id', auth, permission('roles.atualizar'), controller.atualizar);
router.delete('/excluir/:id', auth, permission('roles.excluir'), controller.excluir);

module.exports = router;