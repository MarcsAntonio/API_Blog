const validator = require("validator");
const Articulo = require("../Modelos/Articulo");


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

const crear = (req, res) => {

    //Recoger los datos
    let parametros = req.body;

    //Validar los datos
    try {
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                            validator.isLength(parametros.titulo, {min: 5, max: undefined});
        let validar_contenido = !validator.isEmpty(parametros.contenido) &&
                            validator.isLength(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error("No se ha validado la informacion !!");
        }
    } catch (error) {
        return res.status(400).json({
            status:"error",
            mensaje: "Falta datos por guardar"
        })
    }
    //Crear el objeto a guardar 
    const articulo = new Articulo(parametros);
    
    //Asignar valor a objeto basado segun en el modelo (manual o automatico)
    //articulo.titulo = parametros.titulo;

    //Guardar el articulo en la base de dato
    articulo.save()
        .then((articuloGuardado) => {
            return res.status(200).json({
                status: 'success',
                Articulo: articuloGuardado,
                mensaje: 'Articulo creado con exito'
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el articulo: ' + error.message
            });
        });
}

module.exports = {
    prueba,
    cursos,
    crear
}