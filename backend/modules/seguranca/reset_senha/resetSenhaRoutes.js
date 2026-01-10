const express = require("express");
const router = express.Router();
const controller = require("./resetSenhaController");

router.post("/solicitar", controller.solicitar);
router.post("/confirmar", controller.confirmar);

module.exports = router;
