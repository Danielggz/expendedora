//<------------------DEPENDENCIAS-------------->

var Expendedora = require("../mainClass/Expendedora");
var maquina = new Expendedora("delikia", 12, 20);
maquina.cargarProductosFich("../json/productos.json");
maquina.cargarMonedasFich("../json/monedas.json");
var express = require('express'); //LIBRERÍA EXPRESS
var bodyParser = require('body-parser');
var fs = require('fs');
// var mysql = require('mysql'); //LIBRERÍA MYSQL
var app = express();
// var cookieSession = require('cookie-session'); //LIBRERÍA COOKIES cookie-session

// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(jsonParser);
app.use(urlencodedParser);

//COOKIES
/*
app.use(cookieSession({
    name: 'Usuario',
    keys:['SIDuser'],
    maxAge: 24*60*60*1000 //24h
}));
*/

//<---------------------------------------CONEXION CON BASE DE DATOS-------------------------------------------->
/*
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'apptareas',
    port: 3306 //Puerto por defecto
  });
  connection.connect(function(error){
    if(error)
    {
       throw error;
    }
    else
    {
       console.log('Conexion correcta. Conectado como root');
    }
  });

*/
  

//<---------------------------------------ENDPOINTS (EXPRESS)-------------------------------------------->
app.get("/", function(req, res){
  res.send(JSON.stringify(maquina.leerAvisos()));
});

app.post("/datos", function(req, res){
  if(req.body.nombre_prod!=undefined)
  {
    res.send(JSON.stringify(maquina.seleccionarProd(req.body.nombre_prod)));
  }
  res.end();
});

app.post("/comprar", function(req, res){
  
  var nombre_prod = req.body.producto;
  var arrayMonedas = JSON.parse(req.body.arrayMonedas);

  var objRes = {
    "cambio_mensajes": maquina.comprarProducto(nombre_prod, arrayMonedas),
    "ranuras_vacias": maquina.leerAvisos().ranuras_vacias,
    "productos": maquina.leerAvisos().productos
  };
  
  res.send(JSON.stringify(objRes));
});

app.get("/vaciar", function(req, res){
  let importe = maquina.vaciarCajetines();
  res.send(JSON.stringify(importe));
});

app.post("/llenar", function(req, res){
  var datos = JSON.parse(req.body.datos);
  var arrayDatos = [];

 for (const dato in datos) {
   if (datos.hasOwnProperty(dato)) {
     const element = parseInt(datos[dato]);
     arrayDatos.push({
       "valor": dato,
       "cantidad": element
     });

   }
 }

  maquina.addMonedas(arrayDatos);
  res.send({"avisos": maquina.leerAvisos(),"cajetines": maquina._cajetines });
})

//INICIO EXPRESS
app.use(express.static('../web'));


//INICIAR SERVIDOR
var server = app.listen(3000, function () {
    console.log('Servidor de la EXPENDEDORA iniciado');
  });


//<---------------------------------------------MÉTODOS--------------------------------------------------------->
/*
function connectBD(usuario, pass)
{
  var connection = mysql.createConnection({
    host: 'localhost',
    user: usuario,
    password: pass,
    database: 'apptareas',
    port: 3306 //Puerto por defecto
  });
  connection.connect(function(error){
    if(error)
    {
       throw error;
    }
    else
    {
       console.log('Conexion correcta. Conectado como' + usuario);
    }
  });
}
*/