const express = require("express");
const router = express.Router();

const ArticuloControlador  = require("../Controladores/articulos");

router.get("/ruta-de-prueba", ArticuloControlador.prueba);
router.get("/cursos", ArticuloControlador.cursos);

router.post("/crear", ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.uno)
router.delete("/articulo/:id", ArticuloControlador.borrar)



module.exports = router;