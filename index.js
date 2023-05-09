class Producto {
    constructor(producto, cantidad) {
        this.id = producto.id;
        this.precio = producto.precio;
        this.cantidad = cantidad;
        this.precioTotal = producto.precio;
        this.nombre = producto.nombre;
    }

    agregarUnidad() {
        this.cantidad++;
    }

    quitarUnidad() {
        this.cantidad--;
    }

    actualizarPrecioTotal() {
        this.precioTotal = this.precio * this.cantidad;
    }
}


const productos = [
    {
        id: 0,
        precio: 4000,
        img: "./media/remera1.jpeg",
        nombre: "Remera Nike",
    },
    {
        id: 1,
        precio: 4500,
        img: "./media/remera2.jpeg",
        nombre: "Remera Nike Air",
    },
    {
        id: 2,
        precio: 3000,
        img: "./media/remera4.jpeg",
        nombre: "Remera Nike X",
    },
    {
        id: 3,
        precio: 4200,
        img: "./media/remera3.jpg",
        nombre: "Remera Adidas",
    },
    {
        id: 4,
        precio: 3000,
        img: "./media/remera5.jpg",
        nombre: "Remera Puma",
    },
    {
        id: 5,
        precio: 2900,
        img: "./media/remera6.jpg",
        nombre: "Remera Reebok",
    },
    {
        id: 6,
        precio: 2000,
        img: "./media/gorra3.jpg",
        nombre: "Gorra Nike",
    },
    {
        id: 7,
        precio: 2500,
        img: "./media/gorra2.jpg",
        nombre: "Gorra Nike SB",
    },
    {
        id: 8,
        precio: 2400,
        img: "./media/gorra1.jpg",
        nombre: "Gorra Adidas",
    },

];

let carrito;


function chequearCarritoEnStorage() {
    let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));


    if (contenidoEnStorage) {
        let array = [];
        for (const objeto of contenidoEnStorage) {
            let producto = new Producto(objeto, objeto.cantidad);
            producto.actualizarPrecioTotal();
            array.push(producto);
        }

        imprimirTabla(array);
        return array;
    }
    return [];
}

function imprimirProductosEnHTML(array) {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = "";
    for (const producto of array) {
        let card = document.createElement("div");
        card.innerHTML = `
        <div class="container">
        <div class= "row">
        <div class="card text-center" style="width: 18rem;">
            <div class="card-body">
                <img src="${producto.img}" id="" class="card-img-top img-fluid" alt="">
                <h2 class="card-title">${producto.nombre}</h2>
                <p class="card-text">$${producto.precio}</p>
                <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button id="agregar${producto.id}" type="button" class="btn btn-dark"> Agregar </button>
                </div>
            </div>
        </div>   
        </div>  
        </div>  
        `;

        contenedor.appendChild(card);

        let boton = document.getElementById(`agregar${producto.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(producto.id));
    }
}

function agregarAlCarrito(idProducto) {
    let productoEnCarrito = carrito.find((elemento) => elemento.id === idProducto);

    if (productoEnCarrito) {
        let index = carrito.findIndex((elemento) => elemento.id === productoEnCarrito.id);
        carrito[index].agregarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        carrito.push(new Producto(productos[idProducto], 1));
    }
    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarDelCarrito(id) {
    let producto = carrito.find((producto) => producto.id === id);

    let index = carrito.findIndex((element) => element.id === producto.id);

    if (producto.cantidad > 1) {
        carrito[index].quitarUnidad();
        carrito[index].actualizarPrecioTotal();
    } else {
        carrito.splice(index, 1);
    }

    swal("Producto eliminado del carrito", "", "success");

    localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
    imprimirTabla(carrito);
}

function eliminarCarrito() {
    carrito = [];
    localStorage.removeItem("carritoEnStorage");

    document.getElementById("carrito").innerHTML = "";
    document.getElementById("acciones-carrito").innerHTML = "";
}

function obtenerPrecioTotal(array) {
    return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}


function imprimirTabla(array) {
    let precioTotal = obtenerPrecioTotal(array);
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";
    let tabla = document.createElement("div");

    tabla.innerHTML = `
        <table id="tablaCarrito" class="table table-striped">
            <thead>         
                <tr>
                    <th>Cantidad</th> 
                    <th>Precio</th>                                                    
                    <th>Producto</th>
                </tr>
            </thead>
            <tbody id="bodyTabla">
            </tbody>
        </table>
    `;

    contenedor.appendChild(tabla);

    let bodyTabla = document.getElementById("bodyTabla");

    for (let producto of array) {
        let datos = document.createElement("tr");
        datos.innerHTML = `
                <td>${producto.cantidad}</td>
                <td>$${producto.precioTotal}</td>
                <td>${producto.nombre}</td>
                <td><button id="eliminar${producto.id}" class="btn btn-dark">Eliminar</button></td>
      `;

        bodyTabla.appendChild(datos);

        let botonEliminar = document.getElementById(`eliminar${producto.id}`);
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(producto.id));
    }

    let accionesCarrito = document.getElementById("acciones-carrito");
    accionesCarrito.innerHTML = `
		<h5>PrecioTotal: $${precioTotal}</h5></br>
		<button id="vaciarCarrito" onclick="eliminarCarrito()" class="btn btn-dark">Vaciar Carrito</button>
	`;
}

function filtrarBusqueda(e) {
    e.preventDefault();
    let ingreso = document.getElementById("busqueda").value.toLowerCase();
    let arrayFiltrado = productos.filter((elemento) => elemento.nombre.toLowerCase().includes(ingreso));

    imprimirProductosEnHTML(arrayFiltrado);
}

let btnFiltrar = document.getElementById("btnFiltrar");

btnFiltrar.addEventListener("click", filtrarBusqueda);


imprimirProductosEnHTML(productos);

carrito = chequearCarritoEnStorage();