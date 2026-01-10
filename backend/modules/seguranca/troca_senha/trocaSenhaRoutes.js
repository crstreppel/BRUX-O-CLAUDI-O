const express = require('express');
const router = express.Router();

const trocaSenhaController = require('./trocaSenhaController');
const gatekeeper = require('../../guard/gatekeeper');

router.post(
  '/troca-senha',
  gatekeeper.auth,
  gatekeeper.status,
  trocaSenhaController
);

module.exports = router;
