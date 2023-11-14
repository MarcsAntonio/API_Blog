//importar la conexion a la base de datos,tenemos que utilizar la libreria de mongoose
const mongoose = require("mongoose");

//conexion asincrona La comunicación asíncrona es un método de intercambio de mensajes entre dos o más partes, en la que cada parte recibe y procesa el mensaje cuando sea conveniente o posible de realizar, en vez de hacerlo inmediatamente al recibirlo.
const conexion = async()=>{
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");
        console.log("Conexion exitosa a la base de datos mi_blog");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

//exportamos el modo de conexion a la tabla de la base dato

module.exports ={
    conexion
};