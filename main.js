//CREAMOS LA CLASE PRODUCTO

class Producto{
    constructor(sku, imagen, nombre, fecha, cantidad){
        this.sku = sku;
        this.imagen = imagen;
        this.nombre = nombre;
        this.fecha = fecha;
        this.cantidad = cantidad;
    }
};

//CREAMOS LA CLASE HISTÓRICO (LA VAMOS A USAR PARA AGREGAR AL HISTÓRICO LOS PRODUCTOS CUANDO SE AGREGAN O RESTAN UNIDADES)

class Historico{
  constructor(sku, imagen, nombre, mensaje, fecha){
    this.sku = sku;
    this.imagen = imagen;
    this.nombre = nombre;
    this.mensaje = mensaje;
    this.fecha = fecha;
  }
}

//CREAMOS ESTAS VARIABLES PARA INDICAR CUANDO ESTÉ FILTRADO O NO EL ARRAY ORIGINAL.
let arrayFiltrado = false;
let arrayFiltradoVencimiento = false;

let tabla = document.getElementById("miTabla");
let tablaEncabezado = document.getElementById("encabezadoTabla");


const listadoProductos = "productos.json";

//FUNCION PARA OBTENER LOS PRODUCTOS DEL ARCHIVO JSON MEDIANTE FETCH


// Variable global para almacenar el array de productos
let listaProductos = [];
let historicoProductos = [];

function obtenerProductos() {
  return fetch(listadoProductos)
    .then(response => response.json())
    .then(data => data.productos);
}



//FUNCIÓN PARA MOSTRAR LOS PRODUCTOS

// Función para imprimir todos los productos en el DOM
function imprimirProductosEnDom() {
  let mensajeUsuario = document.getElementById("mensajeUsuario");
  let mensajeParaUsuarioDos = document.createElement("p");
  mensajeParaUsuarioDos.innerHTML = "HOLA... BIENVENIDO!!!";
  mensajeParaUsuarioDos.classList.add("mensajeDos");
  mensajeUsuario.appendChild(mensajeParaUsuarioDos);
  let mensajeParaUsuario = document.createElement("p");
  mensajeParaUsuario.innerHTML = "Por favor selecciona los productos que deseas agregar a tu Control de Stock, recuerda que si tienes productos que no encuentras en la lista, vas a poder agregarlos luego. Una vez que termines de elegir, presiona el boton Crear listado de Productos que se encuentra al final de la lista";
  mensajeParaUsuario.classList.add("mensaje");
  mensajeUsuario.appendChild(mensajeParaUsuario);
  

  obtenerProductos().then(productos => {
    mostrarProductosJSON(productos);
    });
    
    let crearListado = document.getElementById("crearListado");
    let botonCrearListado = document.createElement("button");
    botonCrearListado.innerHTML = "Crear Listado de Productos";
    botonCrearListado.classList.add("btn");
    botonCrearListado.classList.add("btnCrear");
    crearListado.appendChild(botonCrearListado);

    botonCrearListado.addEventListener("click", function() {
    
    mensajeCrearListado ();
  })
  }

  

let mostrarProductosJSON = (productos) => {
  productos.forEach((producto) => {
    crearFilaProductosJSON (producto);
});
};



let mostrarProductosConBotones = () => {
  let botonVencimiento = document.getElementById("botonVencimiento");
  botonVencimiento.style.display = "block";
  let buscador = document.getElementById("busqueda");
  buscador.style.display = "block";
  let agregar = document.getElementById("agregarProductoInicial");
  agregar.style.display = "block";
  let historico = document.getElementById("botonHistorico");
  historico.style.display = "block";
  mostrarProductos();
}



let historico = document.getElementById("botonHistorico");
historico.addEventListener("click", ()=> {
  tabla.innerHTML = "";
  mostrarProductosHistorico()
})



let mostrarProductos = () => {
  listaProductos.forEach((producto) => {
    crearFila(producto);
  })
}



let mostrarProductosHistorico = () => {
  historicoProductos.forEach((historico) => {
    crerFilaHistorico(historico);
  })
}



function crearFilaProductosJSON (producto){
  let row = tabla.insertRow();
  let skuCell = row.insertCell(0);
  let imagenCell = row.insertCell(1);
  let nombreCell = row.insertCell(2);
  let fechaCell = row.insertCell(3);
  let cantidadCell = row.insertCell(4);
  let agregarCell = row.insertCell(5);
  

  // Generar un ID único para el producto
  let productoId = producto.sku;

  skuCell.textContent = producto.sku;
  imagenCell.innerHTML = '<img src="' + producto.imagen + '" width="50" height="50">';
  nombreCell.textContent = producto.nombre;
  fechaCell.textContent = producto.fecha;
  cantidadCell.textContent = producto.cantidad;
  
  // Crear un botón "Agregar" y agregarlo a la celda correspondiente
  let botonAgregar = document.createElement("button");
  botonAgregar.innerHTML = "Agregar";
  botonAgregar.classList.add("btn");
  botonAgregar.id = `boton-agregar-${productoId}`; // Agregar el ID único como parte del ID del botón "agregar"
  agregarCell.appendChild(botonAgregar);

  //Agregamos evento al botón de agregar producto
  const botonParaAgregar = document.getElementById(`boton-agregar-${productoId}`);

  const productosSelecionados = {};
  botonParaAgregar.addEventListener("click", function() {
    obtenerProductos().then(productos => {
      const producto = productos.find(producto => producto.sku === productoId);
      if(!productosSelecionados[productoId]){
        listaProductos.push(producto);
        localStorage.setItem("productosAgregados", JSON.stringify(listaProductos));
        productosSelecionados[productoId] = true;
        mostrarMensajeToastify("Producto seleccionado");
      }else{
        mostrarMensajeToastify("Ya seleccionate este producto");
      }
    })
   });
}

  

//TRABAJAMOS CON EL LOCAL STORAGE.

if(localStorage.getItem("productosAgregados")){
  listaProductos = JSON.parse(localStorage.getItem("productosAgregados"));
  tabla.innerHTML = "";
  mostrarProductosConBotones();
}else{
  imprimirProductosEnDom();
};

if(localStorage.getItem("productosHistorico")){
  historicoProductos = JSON.parse(localStorage.getItem("productosHistorico"));
}


//FUNCIÓN  PARA AGREGAR UN PRODUCTO NUEVO AL ARRAY E IMPRIMIR LA TABLA EN EL HTML.

let formularioNuevoProducto = document.getElementById("formularioNuevoProducto");

formularioNuevoProducto.addEventListener("submit", (e) => {
  e.preventDefault();

  let sku = document.getElementById("skuProducto").value;
    let imagen = document.getElementById("imagenProducto").files[0];
    let nombre = document.getElementById("nombreProducto").value;
    let fecha = document.getElementById("fechaProducto").value;
    let cantidad = document.getElementById("cantidadProducto").value;

    const productoNuevo = new Producto(sku, URL.createObjectURL(imagen), nombre, fecha, cantidad);

    // Agregar el nuevo producto al array de productos existente
    listaProductos.push(productoNuevo);
    

    // Guardar el array actualizado en localStorage
    localStorage.setItem("productosAgregados", JSON.stringify(listaProductos));

    document.getElementById("skuProducto").value = "";
    document.getElementById("imagenProducto").value = "";
    document.getElementById("nombreProducto").value = "";
    document.getElementById("fechaProducto").value = "";
    document.getElementById("cantidadProducto").value = "";

    let tabla = document.getElementById("miTabla");
    tabla.innerHTML = "";
    
    // Llamar a la función mostrarProductos() con el array actualizado
    mostrarProductos();
    mostrarMensajeToastify("Agregaste un producto");
    
});



//FUNCION DE CREAR FILA PARA EL HISTORICO DE PRODUCTOS

function crerFilaHistorico(historico){
  tablaEncabezado.style.display = "none";
  let row = tabla.insertRow();
  let skuCell = row.insertCell(0);
  let nombreCell = row.insertCell(1);
  let mensajeCell = row.insertCell(2);
  let fechaCell = row.insertCell(3);

  skuCell.textContent = historico.sku;
  nombreCell.textContent = historico.nombre;
  mensajeCell.textContent = historico.mensaje;
  fechaCell.textContent = historico.fecha;
  
}



//FUNCION DE CREAR LAS FILAS EN LA TABLA
function crearFila(producto){
  let row = tabla.insertRow();
  let skuCell = row.insertCell(0);
  let imagenCell = row.insertCell(1);
  let nombreCell = row.insertCell(2);
  let fechaCell = row.insertCell(3);
  let cantidadCell = row.insertCell(4);
  let restarCell = row.insertCell(5);
  let sumarCell = row.insertCell(6);
  let eliminarCell = row.insertCell(7);

  // Generar un ID único para el producto
  let productoId = producto.sku;

  skuCell.textContent = producto.sku;
  imagenCell.innerHTML = '<img src="' + producto.imagen + '" width="50" height="50">';
  nombreCell.textContent = producto.nombre;
  fechaCell.textContent = producto.fecha;
  cantidadCell.textContent = producto.cantidad;
  cantidadCell.classList.add("cantidad");
  cantidadCell.id = `cantidad-${productoId}`;
  


  // Crear un botón "Suma" y agregarlo a la celda correspondiente
  let botonSumar = document.createElement("button");
  botonSumar.innerHTML = "Sumar";
  botonSumar.classList.add("btn");
  botonSumar.id = `boton-sumar-${productoId}`; // Agregar el ID único como parte del ID del botón "Sumar"
  sumarCell.appendChild(botonSumar);

  //Agregamos evento al botón de sumar unidades
  const botonParaSumarUnidades = document.getElementById(`boton-sumar-${productoId}`);
  botonParaSumarUnidades.addEventListener("click", function(){
    sumarUnidades(productoId);
    mostrarMensajeToastify("Sumaste una unidad");
    
  });

  

  // Crear un botón "Restar" y agregarlo a la celda correspondiente
  let botonRestar = document.createElement("button");
  botonRestar.innerHTML = "Restar";
  botonRestar.classList.add("btn");
  botonRestar.id = `boton-restar-${productoId}`;
  restarCell.appendChild(botonRestar);

  //Agregamos evento al botón de restar unidades
  const botonParaRestarUnidades = document.getElementById(`boton-restar-${productoId}`);
  botonParaRestarUnidades.addEventListener("click", function(){
    restarUnidades(productoId);
    
    if(producto.cantidad !== 0){
      mostrarMensajeToastify("Restaste una unidad");
    }else{
      mostrarMensajeToastify("No tienes más unidades");
    }
  })
    


  // Crear un botón "Eliminar" y agregarlo a la celda correspondiente
  let botonEliminar = document.createElement("button");
  botonEliminar.innerHTML = "Eliminar";
  botonEliminar.classList.add("btn");
  botonEliminar.id = `boton-eliminar-${productoId}`; // Agregar el ID único como parte del ID del botón "Eliminar"
  eliminarCell.appendChild(botonEliminar);

  //Agregamos evento al botón de eliminar unidades
  const botonParaEliminar = document.getElementById(`boton-eliminar-${productoId}`);
  botonParaEliminar.addEventListener("click", function() {
    mostrarMensajeSweet (productoId);
    
   });
};
    


//FUNCIÓN PARA ELIMINAR PRODUCTOS.
let eliminarDeLaLista = (sku) => {

  const producto = listaProductos.find(producto => producto.sku === sku);
  const indice = listaProductos.indexOf(producto);
  
  if (arrayFiltradoVencimiento) {
    const productoFiltrado = vencimientosCercanos.find(producto => producto.sku === sku);
    const indiceFiltrado = vencimientosCercanos.indexOf(productoFiltrado);
    vencimientosCercanos.splice(indiceFiltrado,1);
    listaProductos.splice(indice,1);
    tabla.innerHTML = ""; 
    mostrarResultados(vencimientosCercanos);
  } else if (arrayFiltrado) {
    const productoFiltrado = productosFiltrados.find(producto => producto.sku === sku);
    const indiceFiltrado = productosFiltrados.indexOf(productoFiltrado);
    productosFiltrados.splice(indiceFiltrado,1);

    listaProductos.splice(indice,1);
    tabla.innerHTML = ""; 
    mostrarResultados(productosFiltrados);
  } else {
    listaProductos.splice(indice,1);
    tabla.innerHTML = ""; 
    mostrarProductos();
  }
  
  localStorage.setItem("productosAgregados", JSON.stringify(listaProductos));
};



//SUMAR UNIDADES

let actualizarProducto = (producto, array) => {
  cantidadActual = parseInt(producto.cantidad);
  producto.cantidad = cantidadActual + 1;
  tabla.innerHTML = "";
  if (array === listaProductos) {
    mostrarProductos();
  } else {
    mostrarResultados(array);
  }
};

let guardarEnLocalStorage = () => {
  localStorage.setItem("productosAgregados", JSON.stringify(listaProductos));
  localStorage.setItem("productosHistorico", JSON.stringify(historicoProductos));
};

let sumarUnidades = (sku) => {
 
  let array = arrayFiltradoVencimiento ? vencimientosCercanos :
    arrayFiltrado ? productosFiltrados :
    listaProductos;
  let producto = array.find((producto) => producto.sku === sku);

  
  actualizarProducto(producto, array);

  const historicoNuevo = new Historico(producto.sku, producto.imagen, producto.nombre,"Sumaste una unidad", new Date());
  console.log(historicoNuevo); 
  historicoProductos.push(historicoNuevo);
  console.log(historicoProductos);

  
  guardarEnLocalStorage();
};




//RESTAR UNIDADES

let actualizarProductoRestar = (producto, array) => {
  cantidadActual = parseInt(producto.cantidad);
  producto.cantidad = cantidadActual - 1;
  tabla.innerHTML = "";
  if (array === listaProductos) {
    mostrarProductos();
  } else {
    mostrarResultados(array);
  }
};


const restarUnidades = (sku) => {
  let array = arrayFiltradoVencimiento ? vencimientosCercanos :
    arrayFiltrado ? productosFiltrados :
    listaProductos;
  let producto = array.find((producto) => producto.sku === sku);

  if (parseInt(producto.cantidad) > 0) {
    actualizarProductoRestar(producto, array);
  }

  const historicoNuevo = new Historico(producto.sku, producto.imagen, producto.nombre,"Restaste una unidad", new Date());
  console.log(historicoNuevo); 

  historicoProductos.push(historicoNuevo);
  console.log(historicoProductos)


  guardarEnLocalStorage();
};




//BUSCADOR
let productosFiltrados = [];
const busqueda = document.getElementById("busqueda");

function filtrarProductos(inputBusqueda, listaProductos) {
  return listaProductos.filter(producto => producto.nombre.toLowerCase().includes(inputBusqueda));
}

busqueda.addEventListener("keydown", (event) => {
 
  if(event.keyCode === 13){
    event.preventDefault()
    const inputBusqueda = document.getElementById("busqueda").value.toLowerCase();
    productosFiltrados = filtrarProductos(inputBusqueda, listaProductos);
    console.log(productosFiltrados);
    mostrarResultados(productosFiltrados);
    console.log(arrayFiltrado)
    arrayFiltrado = true
  }
});



//FUNCION PARA FILTRAR POR VENCIMIENTO

 const botonVencimiento = document.getElementById('botonVencimiento');
 const hoy = new Date();
 const dosMesesDespues = new Date(hoy.getFullYear(), hoy.getMonth()+2, hoy.getDate());
  vencimientosCercanos = listaProductos.filter(producto =>{
  let fechaVencimiento = new Date(producto.fecha);
  return fechaVencimiento > hoy && fechaVencimiento <= dosMesesDespues;
 });

function vencimiento(){
  mensaje.innerHTML ="";
  if(vencimientosCercanos.length !== 0){
    arrayFiltradoVencimiento = true;
    console.log(arrayFiltradoVencimiento)
    mostrarResultados(vencimientosCercanos);
    
  }else{
    tabla.innerHTML = "";
    let mensaje = document.createElement("p");
    mensaje.innerHTML = "No tienes productos próximos a vencer";
    let mensajeVencimientos = document.getElementById("mensaje");
    mensajeVencimientos.appendChild(mensaje);

    };
    let botonVolver = document.createElement("a");
    botonVolver.innerHTML = "Volver";
    botonVolver.setAttribute("href", "");
    botonVolver.classList.add("botonVolver");
    let mensajeVencimientos = document.getElementById("mensaje");
    mensajeVencimientos.appendChild(botonVolver);
 };

 

 botonVencimiento.addEventListener('click', () => {
  tabla.innerHTML = "";
  vencimiento(vencimientosCercanos);
 });

 

//Función para mostrar resultados cuando aplico algún filtro al array.
function mostrarResultados(productosFiltrados) {
 if(productosFiltrados.length !== 0){
   tabla.innerHTML = "";
   productosFiltrados.forEach((producto) => {
     crearFila(producto);
   });
   arrayFiltrado = true
 }else{
   tabla.innerHTML = "Producto no encontrado"; 
 };
};



//TOASTIFY

function mostrarMensajeToastify(mensaje){

 Toastify( {
  text: mensaje,
  duration: 2000,
  position: "right",
  gravity: "bottom",
  className: "info",
  style: {
    background: "linear-gradient(to right, #ffd44a, #ffff95)",
    color: "black",
  },
  
}).showToast();
}



//SWEET ALERT CUANDO PRESIONO ELIMINAR ALGÚN PRODUCTO DE LA LISTA

function mostrarMensajeSweet (productoId) {
  Swal.fire({
    title: 'Seguro que deseas eliminar este producto?',
    text: "No podrás recuperarlo nuevamente",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#508dff',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminar!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Eliminado',
        text: "Haz eliminado un producto",
        icon: 'warning',
        confirmButtonColor: '#508dff',
      })
      eliminarDeLaLista(productoId);
      mostrarMensajeToastify("Producto Eliminado");
    }
  })
};


//SWEET ALERT CUANDO CREO EL LISTADO DE PRODUCTOS

function mensajeCrearListado () {
  Swal.fire({
    title: 'Deseas crear el listado de productos?',
    text: "También puedes seguir agregando",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#508dff',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, crear listado!',
    cancelButtonText: 'Seguir agregando',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Listado de productos creado correctamente',
        text: "Ya puedes manejar tu stock",
        icon: 'success',
        confirmButtonColor: '#508dff',
      })
      let mensajeUsuario = document.getElementById("mensajeUsuario");
      let crearListado = document.getElementById("crearListado");
      mensajeUsuario.style.display = "none";
      crearListado.style.display = "none";
      tabla.innerHTML = "";
      mostrarProductosConBotones();
    }
  })
};


