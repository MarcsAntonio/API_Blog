const Articulo = require("../Modelos/Articulo");
const {validarArticulo} = require("../helper/validar");


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
        validarArticulo(parametros)
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

const listar = (req, res) =>{

    let consulta = Articulo.find({})

    if(req.params.ultimos && req.params.ultimos != undefined){
        consulta.limit(3);
    }

    consulta.sort({fecha: -1})
        .then((articulos)=>{
        
        if (!articulos) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos!!"
            })
        }
        
        return res.status(200).send({
            status: "success",
            parametros_url: req.params.ultimos,
            contador: articulos.length,
            articulos
        });
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al listar los articulos",
            error: error.message
        });
    });
};

const uno = (req, res) =>{

    let id = req.params.id;

    Articulo.findById(id)
        .then((articulos) => {

        if (!articulos) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos!!"
            })
        }
        
        return res.status(200).json({
            status: "success",
            articulos
        });
    })
    .catch((error) => {
        return res.status(500).json({
            status: "error",
            mensaje: "Ha ocurrido un error al listar los articulos",
            error: error.message
        });
    })
}

const borrar = (req, res) =>{
    let articulo_id = req.params.id;

    Articulo.findOneAndDelete({_id: articulo_id})
        .then((articuloBorrado) => {
            return res.status(200).json({
                status: "success",
                articulo: articuloBorrado,
                mensaje: "Articulo borrado"
            })
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al eliminar un articulo",
                error: error.message
        })
    })
}

const editar = (req, res) =>{

    let articuloId = req.params.id;

    let parametros = req.body;

    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(500).json({
            status:"error",
            mensaje: "Falta datos por guardar"
        })
    }

Articulo.findOneAndUpdate({_id: articuloId}, req.body, {new: true})
    .then((articuloActualizado)=>{
        if (!articuloActualizado) {
            return res.status(404).json({
                status:"error",
                mensaje: "Error al actualizar"
            })
        }
        return res.status(200).json({
            status:"success",
            articulo: articuloActualizado,
            mensaje: "Registro exitoso"
        })
    })
        .catch((error)=>{
            return res.status(500).json({
            status:"error",
            mensaje: "Ha ocurrido un error al editar un articulos",
            error: error.message        })
    })
}


module.exports = {
    prueba,
    cursos,
    crear,
    listar,
    uno,
    borrar,
    editar
}