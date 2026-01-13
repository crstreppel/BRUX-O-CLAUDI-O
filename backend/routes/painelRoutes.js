const express = require('express');
const path = require('path');
const router = express.Router();

const { auth } = require('../modules/guard/gatekeeper.js');
const statusMiddleware = require('../modules/guard/statusMiddleware.js');

// Todas as rotas abaixo passam por auth + status
router.use(auth, statusMiddleware);

// Página piloto: Roles
router.get('/roles', (req, res) => {
  const arquivoHtml = path.join(__dirname, '..', 'public', 'modules', 'roles', 'roles.html');
  res.sendFile(arquivoHtml);
});

module.exports = router;
