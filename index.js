const { conexion } = require("./BasedeDatos/conexion");
const express = require("express");
const cors = require("cors");

// Conectar a la DB
conexion()

// crear el servidor Node
const app = express();
const port = 3900;

// Configurar el Cors
app.use(cors());

// Convertir el body a objeto js
app.use(express.json());

// Rutas
const rutas_articulo = require("./Ruta/articulo");
app.use("/api", rutas_articulo);

// Rutas prueba hardcodeadas
app.get("/probando", (req, res)=>{
    console.log("Se a ejecutado el EndPoind probando")
    return res.status(200).send({
        curso: "master en React",
        autor:"Victor Roble Web",
        url: "Victorroblesweb.es/master-react"
    })
});

app.get("/1", (req, res)=>{
    return res.status(200).send(
    `<div>
        <h1>Probando ruta 1</h1>
        <p>Primera prueba de la Ruta 1 Ejemplo</p>
    </div>`
    )
});

// Crear servidor y escuchar peticiones http
app.listen(port, ()=>{
    console.log("Salida del servidor por el puerto " + port);
});