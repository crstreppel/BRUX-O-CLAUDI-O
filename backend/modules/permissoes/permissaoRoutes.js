const express = require('express');
const router = express.Router();
const controller = require('./permissaoController.js');
const { auth, permission } = require('../guard/gatekeeper.js');

router.post('/criar', auth, permission('permissoes.criar'), controller.criar);
router.get('/listar', auth, permission('permissoes.listar'), controller.listar);
router.put('/atualizar/:id', auth, permission('permissoes.atualizar'), controller.atualizar);
router.delete('/excluir/:id', auth, permission('permissoes.excluir'), controller.excluir);

module.exports = router;