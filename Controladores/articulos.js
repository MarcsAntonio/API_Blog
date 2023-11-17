const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una accion de prueba de mi controlador de articulo"
    });
}

const cursos= (req, res) => {
    return res.status(200).json([
    {
        curso: "master en React",
        autor:"Victor Roble Web",
        url: "Victorroblesweb.es/master-react"
    },
    {
        curso: "master en React",
        autor:"Victor Roble Web",
        url: "Victorroblesweb.es/master-react"
    }])
}

module.exports = {
    prueba,
    cursos
}