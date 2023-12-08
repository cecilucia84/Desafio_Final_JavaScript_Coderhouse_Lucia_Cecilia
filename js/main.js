class TiendaTortas {
    constructor(id, titulo, precio, imagen) {
        this.ID = id;
        this.TITULO = titulo;
        this.PRECIO = precio;
        this.IMAGEN = imagen;
    }
}

let arrayTortas = [];

fetch("../js/tortas.json")
.then(response => response.json())
.then(data => {
    arrayTortas = data.map(torta => new TiendaTortas(torta.id, torta.titulo, torta.precio, torta.imagen));
    cargarProductos(arrayTortas)
})


const containerTortas = document.querySelector("#container-tortas");
let botonAgregar = document.querySelectorAll(".agregar_producto");
const numerito = document.querySelector("#numerito");

let productosEnCarrito = [];

let productosEnCarritoLS = localStorage.getItem("productos_en_carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function cargarProductos() {
    arrayTortas.forEach((torta) => {
        const div = document.createElement("div");
        div.classList.add("torta");
        div.innerHTML = `
          <img class="torta_imagen" src="${torta.IMAGEN}" alt="${torta.TITULO}">
          <div class="torta_detalles">
            <h3 class="torta_titulo">${torta.TITULO}</h3>
            <p class="torta_precio">$${torta.PRECIO}</p>
            <label for="cantidad-${torta.ID}">Cantidad:</label>
            <input type="number" id="cantidad-${torta.ID}" value="1" min="1">
            <button class="agregar_producto" id="${torta.ID}">Agregar</button>
          </div>
        `;

        containerTortas.append(div);
    });

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
    botonAgregar = document.querySelectorAll(".agregar_producto");

    botonAgregar.forEach((boton) => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function agregarAlCarrito(event) {
    Toastify({
        text: "Producto agregado al Carrito 🤗",
        duration: 3000,
        destination: "./carrito.html",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, RGB(245 104 247), RGB(245 162 246))",
          borderRadius: "2rem",
          fontFamily:"Marcellus"
        },
        onClick: function(agregarAlCarrito){} // Callback after click
      }).showToast();

    const productId = parseInt(event.target.id);
    const cantidadInput = document.getElementById(`cantidad-${productId}`);
    const cantidad = parseInt(cantidadInput.value);

    const productoAgregado = arrayTortas.find((torta) => torta.ID === productId);

    if (productoAgregado && cantidad >= 1) {
        const productoConCantidad = { ...productoAgregado, cantidad };
        productosEnCarrito.push(productoConCantidad);
    
        actualizarNumerito();
        
        localStorage.setItem("productos_en_carrito", JSON.stringify(productosEnCarrito));
    } 
}

function actualizarNumerito() {
    const numerito = document.getElementById("numerito");
    
    let totalCantidad = productosEnCarrito.reduce((acc, torta) => acc + torta.cantidad, 0);
    numerito.innerText = totalCantidad;
}
cargarProductos();
actualizarBotonesAgregar();