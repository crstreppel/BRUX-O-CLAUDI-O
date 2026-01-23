/**
 * entidadesRoutes.js
 * Módulo: Entidades
 * Correção PBQE:
 * - Ajuste do require do authMiddleware
 * - Rota raiz '/' para evitar duplicação
 */

const express = require('express');
const router = express.Router();

const entidadesController = require('./entidadesController');
const auth = require('../guard/authMiddleware');

// LISTAR entidades
router.get('/', auth, entidadesController.listar);

// CRIAR entidade
router.post('/', auth, entidadesController.criar);

module.exports = router;
