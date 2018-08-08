var Expendedora = require("./Expendedora");

var maquina = new Expendedora("delikia",14,20);
maquina.cargarProductosFich("../json/productos.json");
maquina.cargarMonedasFich("../json/monedas.json");

// maquina.cargarProductosFich("productos.json");

setTimeout(()=> {
    // console.log(maquina._ranuras);
    
    // console.log(maquina.comprarProducto("Sandwich", [1,0.5]));
    console.log("[0.2,0.2,0.05]" + maquina.comprarProducto("Agua",[0.2,0.2,0.05]));
    console.log("[0.2,0.2,0.1]" + maquina.comprarProducto("Agua",[0.2,0.2,0.1]));
    console.log("[1]" + maquina.comprarProducto("Agua",[1]));
    console.log("[1,0.2,0.2,0.1,0.5]" + maquina.comprarProducto("Agua",[1,0.2,0.2,0.1,0.5]));
    console.log("[0.5]" + maquina.comprarProducto("Agua",[0.5]));
    // console.log(maquina._cajetines);
    // console.log(maquina.leerAvisos());
}, 1000);