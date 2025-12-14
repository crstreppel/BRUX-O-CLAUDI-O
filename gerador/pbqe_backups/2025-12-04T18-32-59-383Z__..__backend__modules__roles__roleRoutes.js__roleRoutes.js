const express = require('express');
const router = express.Router();
const controller = require('./roleController');

router.post('/criar', controller.criar);
router.get('/listar', controller.listar);

module.exports = router;