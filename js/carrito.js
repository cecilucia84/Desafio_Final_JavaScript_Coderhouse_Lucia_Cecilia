const CakeEnCarrito = JSON.parse(localStorage.getItem("productos_en_carrito")) || [];

const contenedorCarritoVacio = document.querySelector("#carrito_vacio");
const contenedorCarritoProductos = document.querySelector("#carrito_productos");
const contenedorCarritoAcciones = document.querySelector("#carrito_acciones");
const contenedorCarritoComprado = document.querySelector("#carrito_comprado");
const botonVaciar = document.querySelector("#carrito_acciones_vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito_acciones_comprar");

function resetearCarrito() {
    let totalProductos = CakeEnCarrito.reduce((acc, torta) => acc + torta.cantidad, 0);

    Swal.fire({
        title: "¿Estás Seguro? 😯",
        icon: "question",
        html: `Se van a eliminar ${totalProductos} productos del carrito 😩`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `Si`,
        cancelButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorTotal.classList.add("disabled");
            contenedorCarritoVacio.classList.remove("disabled");

            Swal.fire("Carrito vaciado!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Tu carrito está intacto", "", "info");
        }
    });
}

if (CakeEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");
    contenedorCarritoProductos.innerHTML = "";
    CakeEnCarrito.forEach((torta) => {
        const div = document.createElement("div");
        div.classList.add("carrito_producto");
        div.innerHTML = `
            <img class="carrito_producto_imagen" src="${torta.IMAGEN}" alt="">
            <div class="carrito_producto_titulo">
                <small>Titulo</small>
                <h3>${torta.TITULO}</h3>
            </div>
            <div class="carrito_producto_cantidad">
                <small>Cantidad</small>
                <p>${torta.cantidad}</p>
            </div>
            <div class="carrito_producto_precio">
                <small>Precio</small>
                <p>$${torta.PRECIO}</p>
            </div>
            <div class="carrito_producto_subtotal">
                <small>Subtotal</small>
                <p>$${torta.PRECIO * torta.cantidad}</p>
            </div>
            <button class="carrito_producto_eliminar" id="eliminar-${torta.id}"><i class="bi bi-trash3-fill"></i></button>
        </div>`;
        contenedorCarritoProductos.appendChild(div);


        div.querySelector(".carrito_producto_eliminar").addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const uniqueID = e.currentTarget.id.replace("eliminar-", "");
    const index = CakeEnCarrito.findIndex(torta => String(torta.id) === uniqueID);
    if (index !== -1) {
        CakeEnCarrito.splice(index, 1);
    }
    localStorage.setItem("productos_en_carrito", JSON.stringify(CakeEnCarrito));

    e.currentTarget.parentElement.remove();

    Toastify({
        text: "Producto eliminado del carrito 😢",
        duration: 3000,
        destination: "./carrito.html",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, RGB(245 104 247), RGB(245 162 246))",
            borderRadius: "2rem",
            fontFamily: "Marcellus"
        },
        onClick: function () { }
    }).showToast();

    actualizarTotal();
}

function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito_producto_eliminar");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function actualizarTotal() {
    if (contenedorTotal) {
        let total = 0;
        CakeEnCarrito.forEach((torta) => {
            total += torta.PRECIO * torta.cantidad;
        });
        contenedorTotal.textContent = "$" + total;
    }
}
actualizarTotal();

if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        resetearCarrito();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    if (botonComprar) {
        botonComprar.addEventListener("click", comprarCarrito);
    }
});

function comprarCarrito() {
    Swal.fire({
        title: "Muchas Gracias por comprar en Tres Tartas! 😊❤️ ",
        text: "Te enviaremos un correo electrónico con la confirmación de tu compra",
        imageUrl: "../recursos/TRES TARTAS - BANNER (comprimido).png",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Imagen personalizada"
    });

    localStorage.setItem("productos_en_carrito", JSON.stringify([]));
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorTotal.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}