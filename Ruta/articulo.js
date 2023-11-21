const express = require("express");
const router = express.Router();

const ArticuloControlador  = require("../Controladores/articulos");

router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.get("/cursos", ArticuloControlador.cursos);

router.post("/crear", ArticuloControlador.crear)

module.exports = router;