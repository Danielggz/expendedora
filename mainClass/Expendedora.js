var fs = require('fs');

class Expendedora
{
    static MONEDAS(){return [0.05,0.1,0.2,0.5,1,2];}

    constructor(nombre, ranuras, profundidad, fichero)
    {
        this._nombre = nombre;
        this._ranuras = [];
        for(var i=0; i<ranuras; i++)
        {
            this._ranuras.push([]);
        }
        this._profundidad = profundidad;
        if(fichero!=undefined)
        {
            fs.readFile(fichero, 'utf8', (err, data) => {
                if (err){
                    console.log("Archivo vacío o dañado");
                };
                var datos = JSON.parse(data);
                if(datos[0].nombre!=undefined)
                {
                    for (let i = 0; i < datos.length; i++) {
                        const element = datos[i];
                        this.cargarProductos(element);
                    }
                    
                }else{
                    this.cargarMonedas(datos);
                }
              });
        }
    }
    cargarProductosFich(fichero)
    {
        if(fichero!=undefined)
        {
            fs.readFile(fichero, 'utf8', (err, data) => 
            {
                if (err)
                {
                    console.log("Archivo vacío o dañado");
                }
                var datos = JSON.parse(data);
                for (let i = 0; i < datos.length; i++) 
                {
                    const element = datos[i];
                    this.cargarProductos(element);
                }
            });
        }
    }
    cargarMonedasFich(fichero)
    {
        if(fichero!=undefined)
        {
            fs.readFile(fichero, 'utf8', (err, data) => 
            {
                if (err)
                {
                    console.log("Archivo vacío o dañado");
                }
                var datos = JSON.parse(data);
                this.cargarMonedas(datos);
            });
        }
    }
    cargarProductos(producto)
    {
        var seguir = this._ranuras.some(ranura => {
            if(ranura.length>0)
            {
                if(ranura[0].nombre==producto.nombre){
                    while(ranura.length<this._profundidad && producto.cantidad>0)
                    {
                        ranura.push({"nombre": producto.nombre, "id": producto.id, "precio": producto.precio});
                        producto.cantidad--;
                    }
                    return true;
                }
            }
        });

        if(!seguir)
        {
            this._ranuras.some(ranura => {
                if(ranura.length == 0)
                {
                    while(ranura.length<this._profundidad  && producto.cantidad>0)
                    {
                        ranura.push({"nombre": producto.nombre, "id": producto.id, "precio": producto.precio});
                        producto.cantidad--;
                    }
                    return true;
                }
            });
        }
    }

    cargarMonedas(monedas_fich)
    {
        this._cajetines = {};
        Expendedora.MONEDAS().forEach(moneda => {
            this._cajetines[moneda]={
                "capacidad":50,
                "cantidad":0
            }
        });

        monedas_fich.forEach(moneda => {
            if(this._cajetines[moneda.valor]!=undefined)
            {
                this._cajetines[moneda.valor].cantidad += moneda.cantidad;
                if(this._cajetines[moneda.valor].cantidad > this._cajetines[moneda.valor].capacidad)
                {
                    this._cajetines[moneda.valor].cantidad = this._cajetines[moneda.valor].capacidad;
                }
            }
        });
    }

    addMonedas(arrayMonedas)
    {
        arrayMonedas.forEach(moneda => {
            if(this._cajetines[moneda.valor]!=undefined)
            {
                this._cajetines[moneda.valor].cantidad += moneda.cantidad;
                if(this._cajetines[moneda.valor].cantidad > this._cajetines[moneda.valor].capacidad)
                {
                    this._cajetines[moneda.valor].cantidad = this._cajetines[moneda.valor].capacidad;
                }
            }
        });
    }

    seleccionarProd(nombre_prod)
    {
        for(let i=0; i<this._ranuras.length; i++)
        {
            var element = this._ranuras[i];
            for (let j = 0; j < element.length; j++) {
                const element2 = element[j];
                if(element2.nombre == nombre_prod)
                {
                    return element2.precio;
                }
            }
        }
        return null;
    }

    monedasDisponibles()
    {
        let monedas = [];
        for (const moneda in this._cajetines) {
            if (this._cajetines.hasOwnProperty(moneda)) {
                const element = this._cajetines[moneda];
                if(element.cantidad>0)
                {
                    monedas.push(parseFloat(moneda));
                }
            }
        }
        return monedas.sort((a,b)=>{return a-b;}).reverse();
    }

    comprarProducto(nombre_prod, monedas)
    {
        var mensajes = [];
        var devuelto = [];
        var dinero=0;
        var precio_prod = 0;
        for (let i = 0; i < monedas.length; i++) {
            const element = monedas[i];
            if(this.meterMoneda(element))
            {
                dinero += parseFloat(element);
            }
        }
        if(this.seleccionarProd(nombre_prod) != null)
        {
            precio_prod = this.seleccionarProd(nombre_prod).toFixed(2);
        }else{
            return null;
        }

        var cambio = (dinero - precio_prod).toFixed(2);
        cambio = cambio;
        var cambio2 = cambio;

        if(cambio<0)
        {
            return cambio;
        }
        else
        {
            while(cambio>0 && cambio>=this.monedasDisponibles()[this.monedasDisponibles().length-1])
            {
                this.monedasDisponibles().some(moneda => {
                    if(cambio>=moneda)
                    {
                        devuelto.push(moneda.toFixed(2));
                        if(this.sacarMoneda(moneda))
                        {
                            cambio = cambio - moneda;
                            cambio = cambio.toFixed(2);
                        }
                        return true;
                    }
                })
            }
            if(cambio<=0)
            {
                mensajes.push("Producto " + nombre_prod + " comprado");
                this.quitarProducto(nombre_prod);
            }else{
                mensajes.push("No hay cambio suficiente para " + nombre_prod); 
            }
        }
        return [devuelto, mensajes];
    }

    meterMoneda(moneda)
    {
        if(this._cajetines[moneda]!=undefined)
        {
            if(this._cajetines[moneda].cantidad<this._cajetines[moneda].capacidad)
            {
                this._cajetines[moneda].cantidad++;
                return true
            }
        }
        return false;
    }
    sacarMoneda(moneda)
    {
        if(this._cajetines[moneda]!=undefined)
        {
            if(this._cajetines[moneda].cantidad>0)
            {
                this._cajetines[moneda].cantidad--;
                return true
            }
        }
        return false;
    }

    quitarProducto(nombre_prod)
    {
        this._ranuras.some(ranura => {
            if(ranura.length>0)
            {
                if(ranura[0].nombre == nombre_prod)
                {
                    return ranura.pop();
                    // console.log(this._ranuras);
                }
            }
        });
    }

    vaciarCajetines()
    {
        let importe=0
        for (const moneda in this._cajetines) {
            if (this._cajetines.hasOwnProperty(moneda)) {
                const element = this._cajetines[moneda];
                importe+=(element.cantidad * moneda);
                element.cantidad=0;
            }
        }
        return importe;
    }

    leerAvisos()
    {
        let avisos = 
        {
            "total_cambio":0,
            "cajetines_llenos": [],
            "cajetines_vacios": [],
            "productos": {},
            "ranuras_vacias": 0
        }

        this._ranuras.forEach(ranura => 
        {
            if(ranura.length>0)
            {
                if(avisos.productos[ranura[0].nombre]==undefined)
                {
                    avisos.productos[ranura[0].nombre]=ranura.length;
                }
                
            }else{
                avisos.ranuras_vacias++;
            }
        });

        for (const moneda in this._cajetines) 
        {
            if (this._cajetines.hasOwnProperty(moneda)) {
                const element = this._cajetines[moneda];
                avisos.total_cambio+=(element.cantidad*moneda);
                if(element.cantidad==element.capacidad)
                {
                    avisos.cajetines_llenos.push(moneda);
                }
                else if(element.cantidad==0)
                {
                    avisos.cajetines_vacios.push(moneda);
                }
            }
        }
        return avisos;
    }

    
}

module.exports=Expendedora;

// var maquina = new Expendedora("prueba",7,20);
// maquina.cargarProductosFich("productos.json");
// maquina.cargarMonedasFich("monedas.json");

// // maquina.cargarProductosFich("productos.json");

// setTimeout(()=> {
//     // console.log(maquina._ranuras);
    
//     // console.log(maquina.comprarProducto("Sandwich", [1,0.5]));
//     console.log(maquina.comprarProducto("Agua",[0.1]));
//     // console.log(maquina._cajetines);
//     console.log(maquina.leerAvisos());
// }, 1000);