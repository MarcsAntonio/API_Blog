const path = require("path");
const fs = require("fs");
const { validarArticulo } = require("../helper/validar");
const Articulo = require("../Modelos/Articulo");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una accion de prueba de mi controlador de articulo",
    });
};

const cursos = (req, res) => {
    return res.status(200).json([
        {
            curso: "master en React",
            autor: "Victor Roble Web",
            url: "Victorroblesweb.es/master-react",
        },
        {
            curso: "master en React",
            autor: "Victor Roble Web",
            url: "Victorroblesweb.es/master-react",
        },
    ]);
};

const crear = (req, res) => {
    //Recoger los datos
    let parametros = req.body;

    //Validar los datos
    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Falta datos por guardar",
        });
    }
    //Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    //Asignar valor a objeto basado segun en el modelo (manual o automatico)
    //articulo.titulo = parametros.titulo;

    //Guardar el articulo en la base de dato
    articulo
        .save()
        .then((articuloGuardado) => {
            return res.status(200).json({
                status: "success",
                Articulo: articuloGuardado,
                mensaje: "Articulo creado con exito",
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el articulo: " + error.message,
            });
        });
};

const listar = (req, res) => {
    let consulta = Articulo.find({});

    if (req.params.ultimos && req.params.ultimos != undefined) {
        consulta.limit(3);
    }

    consulta
        .sort({ fecha: -1 })
        .then((articulos) => {
            if (!articulos) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos!!",
                });
            }

            return res.status(200).send({
                status: "success",
                parametros_url: req.params.ultimos,
                contador: articulos.length,
                articulos,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al listar los articulos",
                error: error.message,
            });
        });
};

const uno = (req, res) => {
    let id = req.params.id;

    Articulo.findById(id)
        .then((articulos) => {
            if (!articulos) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos!!",
                });
            }

            return res.status(200).json({
                status: "success",
                articulos,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al listar los articulos",
                error: error.message,
            });
        });
};

const borrar = (req, res) => {
    let articulo_id = req.params.id;

    Articulo.findOneAndDelete({ _id: articulo_id })
        .then((articuloBorrado) => {
            return res.status(200).json({
                status: "success",
                articulo: articuloBorrado,
                mensaje: "Articulo borrado",
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                mensaje: "Ha ocurrido un error al eliminar un articulo",
                error: error.message,
            });
        });
};

const editar = (req, res) => {
    let articuloId = req.params.id;

    let parametros = req.body;

    try {
        validarArticulo(parametros);
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Falta datos por guardar",
        });
    }

    Articulo.findOneAndUpdate({ _id: articuloId }, req.body, { new: true }).then(
        (articuloActualizado) => {
            if (!articuloActualizado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "Error al actualizar",
                });
            }
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                mensaje: "Registro exitoso",
            });
        }
    );
};

const subir = (req, res) => {
    //Configurar multer

    //Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "Peticion invalida",
        });
    }

    //Nombre del archivo
    let archivo = req.file.originalname;

    //Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    //Comprobar extension correcta
    try {
        if (
            extension != "png" &&
            extension != "jpg" &&
            extension != "jpeg" &&
            extension != "gif"
        ) {
            fs.unlink(req.file.path, (err) => {
                return res.status(400).json({
                    status: "error",
                    mensaje: "formato invalido " + err,
                });
            });
        } else {
            let articuloId = req.params.id;

            Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename}, 
                {new: true,})
                .then((articuloActualizado) => {
                if (!articuloActualizado) {
                    return res.status(404).json({
                        status: "error",
                        mensaje: "Error al actualizar",
                    });
                }
                return res.status(200).json({
                    status: "success",
                    articulo: articuloActualizado,
                    mensaje: "Registro exitoso",
                    fichero: req.file
                });
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en el registro " + error,
        });
    }
};

const imagen = (req, res) =>{
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica, (error, existe) =>{
        if (existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: error,
                mensaje: "Fichero no existente",
                existe,
                fichero,
                ruta_fisica
            });
        }

    })
}

const buscar = async(req, res) =>{

    try {
        //sacar el string de buscar
    let busqueda = req.params.busqueda

    //Find OR
    let articuloEncontrado = await Articulo.find({ 
        "$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
        {"contenido": {"$regex": busqueda, "$options": "i"}}
    ]})
        //Orden
    .sort({fecha: -1})
        //Devolver resultado
    //.exec()
        if(!articuloEncontrado || articuloEncontrado.length < 1){
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos con ese nombre"
            })
        }
        return res.status(200).json({
            status: "success",
            articuloEncontrado
        })
    } catch (err) {
        return res.status(500).json({
            status: "err",
            mensaje: "Error a la hora de realizarla busqueda"
        })
    }
    


    //Ejecutar consulta
    
}

module.exports = {
    prueba,
    cursos,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscar
};
