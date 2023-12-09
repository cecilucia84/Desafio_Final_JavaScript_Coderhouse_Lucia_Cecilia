class ProductoDesayuno {
    constructor(id, titulo, imagen, descripcion, precio) {
        this.ID = id;
        this.TITULO = titulo;
        this.IMAGEN = imagen;
        this.DESCRIPCION = descripcion;
        this.PRECIO = precio;
    }
}

let arrayDesayunos = [];

fetch("../js/desayunos.json")
    .then(response => response.json())
    .then(data => {
        arrayDesayunos = data.map(desayuno => new ProductoDesayuno(desayuno.id, desayuno.titulo, desayuno.imagen, desayuno.descripcion, desayuno.precio));
        cargarDesayunos(arrayDesayunos);
    });

const containerDesayunos = document.querySelector(".container-desayunos");

function cargarDesayunos(desayunos) {
    desayunos.forEach((desayuno) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img src="${desayuno.IMAGEN}" class="card-img-top" alt="${desayuno.TITULO}">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${desayuno.TITULO}</h5>
                <p class="card-text">${desayuno.DESCRIPCION}</p>
                <p class="card-text">$${desayuno.PRECIO}</p>
                <div class="d-flex align-items-center">
                    <input type="number" min="1" max="10" value="1" class="form-control" style="width: 60px;" id="cantidad-${desayuno.ID}">
                    <button class="btn btn-secondary ml-2 agregar_desayuno" id="${desayuno.ID}">Agregar al carrito</button>
                </div>
            </div>
        `;

        containerDesayunos.append(div);
    });

    actualizarBotonesAgregarDesayuno();
}

function actualizarBotonesAgregarDesayuno() {
    let botonesAgregarDesayuno = document.querySelectorAll(".agregar_desayuno");

    botonesAgregarDesayuno.forEach((boton) => {
        boton.addEventListener("click", agregarAlCarritoDesayuno);
    });
}

function actualizarNumerito() {
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos_en_carrito")) || [];
    const numerito = document.querySelector("#numerito");
    numerito.textContent = productosEnCarrito.length;
}

function agregarAlCarritoDesayuno(event) {
    const productId = parseInt(event.target.id);
    const cantidadInput = document.querySelector(`#cantidad-${productId}`);
    const cantidad = parseInt(cantidadInput.value);

    const productoAgregado = arrayDesayunos.find((desayuno) => desayuno.ID === productId);

    if (productoAgregado && cantidad >= 1) {
        const productoConCantidad = { ...productoAgregado, cantidad };
        let productosEnCarrito = JSON.parse(localStorage.getItem("productos_en_carrito")) || [];
        productosEnCarrito.push(productoConCantidad);
        localStorage.setItem("productos_en_carrito", JSON.stringify(productosEnCarrito));

        actualizarNumerito();

        Toastify({
            text: "Producto de desayuno agregado al Carrito 🤗",
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
                fontFamily: "Marcellus"
            },
            onClick: function () { } // Callback after click
        }).showToast();
    }
}

cargarDesayunos(arrayDesayunos);