var arrayMonedas = [];
var cajetinesLlenos = [];
var credito=0;

$(document).ready(function(){
    $.ajax({
        type: "get",
        url: "/",
        dataType: "json",
        success: function (response) 
        {
            cajetinesLlenos = response.cajetines_llenos;
            
            actualizarMaquina(response.productos, response.ranuras_vacias);
            actualizarGestion();
        }
    });
});



function actualizarMaquina(productos, ranuras_vacias)
{
    $("#productos").html("");
    for (const producto in productos) {
        if (productos.hasOwnProperty(producto)) {
            var div = `<div id='${producto}' class='${producto} ranura'> </div>`;
            $("#productos").append(div);
        }
    }
    
    for (let i = 0; i < ranuras_vacias; i++) {
        $("#productos").append("<div class='slot ranura'></div>");
    }

    prodClick();
    monedaClick();
}

function prodClick()
{
    $('.ranura').click(ev =>{
        if(ev.currentTarget.id!="")
        {
            var el = `#${ev.currentTarget.id}`;

            if($(el).hasClass('ranuraSel'))
            {
                $('.ranura').removeClass('ranuraSel');
                $('#infoProd').html("Seleccione producto");
            }else{
                $('.ranura').removeClass('ranuraSel');
                $('.ranura').addClass('ranuraSel');

                $.ajax({
                    type: "post",
                    url: "/datos",
                    data: {"nombre_prod":ev.currentTarget.id},
                    dataType: "json",
                    success: function(response) 
                    {
                        $('#infoProd').html( ev.currentTarget.id + "<br/>" + "Precio: " + response);
                        if(response<=importe(arrayMonedas))
                        {
                            comprarProducto(ev.currentTarget.id);
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }

                });

                

            }
        }
    });
}

function monedaClick()
{
    $('.moneda').click(ev =>{
        if(ev.currentTarget.id!="")
        {
            var el = `#${ev.currentTarget.id}`;
            var precio;

            if($(el).hasClass('monedaSel'))
            {
                $('.moneda').removeClass('monedaSel');
            }else{
                $('.moneda').removeClass('monedaSel');
                $('.moneda').addClass('monedaSel');
                if(cajetinesLlenos.indexOf(ev.currentTarget.id)!=-1)
                {
                    $('#infoProd').html("Cajetín lleno");
                }else{
                    $('#infoProd').html("");
                    arrayMonedas.push(parseFloat(ev.currentTarget.id));
                }
                credito = importe(arrayMonedas);
                $('#infoImporte').html("Crédito: " + credito);
            }
        }
    });
}

function comprarProducto(producto)
{
    $.ajax({
        type: "post",
        url: "/comprar",
        data:{
            "producto": producto,
            "arrayMonedas": JSON.stringify(arrayMonedas)
        },
        dataType: "json",
        success: function (response) 
        {
            var arrayCambio = response.cambio_mensajes[0];
            var mensajes = response.cambio_mensajes[1];
            
            var objRes = {"arrayCambio": arrayCambio,
            "mensajes": mensajes};

            $('#infoImporte').html("Crédito: 0");
            credito=0;
            arrayMonedas = [];
            actualizarMaquina(response.productos, response.ranuras_vacias); 
        }
    });
}

function actualizarGestion()
{
    $('#btnAbrir').click(function(){
        if($('#gestion').hasClass('ocultar'))
        {
            $('#gestion').removeClass('ocultar');
            $('#gestion').addClass('mostrar');
            $('#monedas').removeClass('mostrar');
            $('#monedas').addClass('ocultar');
        }else{
            $('#gestion').removeClass('mostrar');
            $('#gestion').addClass('ocultar');
            $('#monedas').removeClass('ocultar');
            $('#monedas').addClass('mostrar');
        }
    });

    $('#btnCerrar').click(function(){
        $('#monedas').hasClass('ocultar')
        {
            $('#gestion').removeClass('mostrar');
            $('#gestion').addClass('ocultar');
            $('#monedas').removeClass('ocultar');
            $('#monedas').addClass('mostrar');
        }
    });

    $('#vaciarMonedas').click(function(){
        vaciarMonedas();
    });

    $('#llenarMonedas').click(function(){
        llenarMonedas();
    });
}

function vaciarMonedas()
{
    console.log("vaciando..");
    $.ajax({
        type: "get",
        url: "/vaciar",
        dataType: "json",
        success: function (response) {
            $('#infoGestion').html("Cajetines vacíos. Importe vaciado: " + response.toFixed(2))
        }
    });
}

function llenarMonedas()
{
    var datos = 
    {
        "2": $('#llenar2').val(),
        "1": $('#llenar1').val(),
        "0.5": $('#llenar05').val(),
        "0.2": $('#llenar02').val(),
        "0.1": $('#llenar01').val(),
        "0.05": $('#llenar005').val(),
    }
    console.log("llenando..");
    $.ajax({
        type: "post",
        url: "/llenar",
        data: {"datos": JSON.stringify(datos)},
        dataType: "json",
        success: function (response) {
            $('#infoGestion').html(
            "Cajetines llenos: " + response.avisos.cajetines_llenos + "<br/>" +
            "Cajetines vacíos: " + response.avisos.cajetines_vacios + "<br/>" +
            "Total de cambio: " + response.avisos.total_cambio.toFixed(2) + "<br/>")
        }
    });
}

function importe(monedas)
{
    var total=0;
    for (let i = 0; i < monedas.length; i++) {
        var element = monedas[i];
        if(typeof monedas[i]==='string')
        {
            element = parseInt(monedas[i]);
        }

        total+=element;
    }
    return total.toFixed(2);
}