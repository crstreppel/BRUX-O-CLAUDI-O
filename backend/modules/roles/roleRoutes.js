const express = require('express');
const router = express.Router();
const controller = require('./roleController.js');
const rolePermissaoController = require('./rolePermissaoController.js');
const { auth, permission } = require('../guard/gatekeeper.js');

router.post('/criar', auth, permission('roles.criar'), controller.criar);
router.get('/listar', auth, permission('roles.listar'), controller.listar);
router.put('/atualizar/:id', auth, permission('roles.atualizar'), controller.atualizar);
router.delete('/excluir/:id', auth, permission('roles.excluir'), controller.excluir);

// Permissões vinculadas à Role
router.post('/:id/permissoes/adicionar', auth, permission('roles.permissoes.atribuir'), rolePermissaoController.atribuirPermissao);
router.delete('/:id/permissoes/remover', auth, permission('roles.permissoes.remover'), rolePermissaoController.removerPermissao);
router.get('/:id/permissoes', auth, permission('roles.permissoes.listar'), rolePermissaoController.listarPermissoes);

module.exports = router;
