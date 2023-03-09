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

//CREAMOS PRODUCTOS

const snackPalitosPanceta = new Producto (8858223012377, "./images/palitosPanceta.jpg", "Snack palitos sabor panceta ahumada 60 gr", "2023-03-13", 20);
const snackPalitosPicante = new Producto (8858283008479, "./images/palitosPicantes.jpg", "Snack palitos sabor picante 60 gr", "2025-03-13", 20);
const caramelosBerry = new Producto (4710035230230, "./images/caramelosBerries.jpg", "Caramelos masticables Hi-Chew sabor frutos rojos 110 gr", "2025-04-01", 20);
const lataCaramelos = new Producto (4901630002531, "./images/lataCaramelos.jpg", "Lata de caramelos Tumba de Luciérnagas Sakura Drops", "2025-03-24", 20);

// CREAMOS UN ARRAY PARA LOS PRODUCTOS 

let arrayProductos = [snackPalitosPanceta, snackPalitosPicante, caramelosBerry, lataCaramelos];


let tabla = document.getElementById("miTabla");

//TRABAJAMOS CON EL LOCAL STORAGE.

if(localStorage.getItem("productosAgregados")){
  arrayProductos = JSON.parse(localStorage.getItem("productosAgregados"));
  tabla.innerHTML = "";
  console.log(arrayProductos)
  arrayProductos.forEach((producto) => {
    crearFila(producto);
});
}else{
  arrayProductos = [snackPalitosPanceta, snackPalitosPicante, caramelosBerry, lataCaramelos];
  tabla.innerHTML = "";
  arrayProductos.forEach((producto) => {
    crearFila(producto);
});
};



//FUNCIÓN  PARA AGREGAR UN PRODUCTO NUEVO AL ARRAY E IMPRIMIR LA TABLA EN EL HTML.
function agregarProductoNuevo(){
  let sku = document.getElementById("skuProducto").value;
  let imagen = document.getElementById("imagenProducto").files[0];
  let nombre = document.getElementById("nombreProducto").value;
  let fecha = document.getElementById("fechaProducto").value;
  let cantidad = document.getElementById("cantidadProducto").value;

  const productoNuevo = new Producto (sku, URL.createObjectURL(imagen), nombre, fecha, cantidad);

  arrayProductos.push(productoNuevo);
  
  localStorage.setItem("productosAgregados", JSON.stringify(arrayProductos));

  document.getElementById("skuProducto").value = "";
  document.getElementById("imagenProducto").value = "";
  document.getElementById("nombreProducto").value = "";
  document.getElementById("fechaProducto").value = "";
  document.getElementById("cantidadProducto").value = "";

  let tabla = document.getElementById("miTabla");
  tabla.innerHTML = "";

  arrayProductos.forEach((producto) => {
      crearFila(producto);
    });
};



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
  })
    


  // Crear un botón "Eliminar" y agregarlo a la celda correspondiente
  let botonEliminar = document.createElement("button");
  botonEliminar.innerHTML = "Eliminar";
  botonEliminar.classList.add("btn");
  botonEliminar.id = `boton-eliminar-${productoId}`; // Agregar el ID único como parte del ID del botón "Eliminar"
  console.log(botonEliminar.id)
  eliminarCell.appendChild(botonEliminar);

  //Agregamos evento al botón de eliminar unidades
  const botonParaEliminar = document.getElementById(`boton-eliminar-${productoId}`);
  botonParaEliminar.addEventListener("click", function() {
    eliminarDeLaLista(productoId);
   });
};
    


//FUNCIÓN PARA ELIMINAR PRODUCTOS.
let eliminarDeLaLista = (sku) => {
  const producto = arrayProductos.find(producto => producto.sku === sku);
  const indice = arrayProductos.indexOf(producto);
  arrayProductos.splice(indice,1);
  tabla.innerHTML = ""; 
  arrayProductos.forEach((producto) => {
    crearFila(producto);
  });

  localStorage.setItem("productosAgregados", JSON.stringify(arrayProductos));
};



//FUNCIÓN PARA SUMAR UNIDADES
let sumarUnidades = (sku) => {
  const producto = arrayProductos.find(producto => producto.sku === sku);
  let cantidadActual = parseInt(producto.cantidad);
  console.log(cantidadActual);
  cantidadNueva = cantidadActual + 1;
  producto.cantidad = cantidadNueva;
  tabla.innerHTML = ""; 
  arrayProductos.forEach((producto) => {
    crearFila(producto);
  });

  localStorage.setItem("productosAgregados", JSON.stringify(arrayProductos));
};


//FUNCIÓN PARA RESTAR UNIDADES
let restarUnidades = (sku) => {
  const producto = arrayProductos.find(producto => producto.sku === sku);
  let cantidadActual = parseInt(producto.cantidad);
  
  cantidadNueva = cantidadActual - 1;
  producto.cantidad = cantidadNueva;
  tabla.innerHTML = ""; 
  arrayProductos.forEach((producto) => {
    crearFila(producto);
  });

  localStorage.setItem("productosAgregados", JSON.stringify(arrayProductos));
};



//BUSCADOR

const inputBusqueda = document.getElementById("busqueda");
const listaResultados = document.getElementById("resultados");

inputBusqueda.addEventListener("input", () => {
  const busqueda = inputBusqueda.value.toLowerCase();
  const productosFiltrados = arrayProductos.filter(producto => producto.nombre.toLowerCase().includes(busqueda));
  mostrarResultados(productosFiltrados); 
});



//FUNCION PARA FILTRAR POR VENCIMIENTO
 const boton = document.getElementById('botonVencimiento');

function vencimiento(){
  const hoy = new Date();
  const dosMesesDespues = new Date(hoy.getFullYear(), hoy.getMonth()+2, hoy.getDate());
  const vencimientosCercanos = arrayProductos.filter(producto =>{
   const fechaVencimiento = new Date(producto.fecha);
   return fechaVencimiento > hoy && fechaVencimiento <= dosMesesDespues;
  })

  if(vencimientosCercanos.length !== 0){
    mostrarResultados(vencimientosCercanos);
  }else{
    tabla.innerHTML = "";
    let mensaje = document.createElement("p");
    mensaje.innerHTML = "No tienes productos próximos a vencer";
    let mensajeVencimientos = document.getElementById("mensaje");
    mensajeVencimientos.appendChild(mensaje);
    };
 };

 boton.addEventListener('click', vencimiento);



//Función para mostrar resultados cuando aplico algún filtro al array.
function mostrarResultados(productosFiltrados) {
 if(productosFiltrados.length !== 0){
   tabla.innerHTML = "";
   productosFiltrados.forEach((producto) => {
     crearFila(producto);
   });
 }else{
   tabla.innerHTML = "Producto no encontrado"; 
 };
};