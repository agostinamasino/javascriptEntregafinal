let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("carrito-lista");
const totalTexto = document.getElementById("total-texto");
const contadorCarrito = document.getElementById("contador-carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const btnComprar = document.getElementById("btn-comprar");
const loaderTexto = document.getElementById("loader-texto");

const cargarProductos = async () => {
    try {
        const response = await fetch("./js/productos.json");
        const data = await response.json();
        productos = data;
        loaderTexto.style.display = "none"; 
        renderizarProductos(productos);
    } catch (error) {
        loaderTexto.innerText = "Error al cargar productos.";
    }
};

function renderizarProductos(arr) {
    contenedorProductos.innerHTML = "";
    arr.forEach((prod) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" class="card-img">
            <h3>${prod.nombre}</h3>
            <p>$${prod.precio}</p>
            <button id="agregar-${prod.id}" class="boton-agregar">Agregar</button>
        `;
        contenedorProductos.appendChild(div);
        
        document.getElementById(`agregar-${prod.id}`).addEventListener("click", () => {
            agregarAlCarrito(prod.id);
        });
    });
}

const actualizarCarrito = () => {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p class='carrito-vacio'>El carrito está vacío.</p>";
    } else {
        carrito.forEach((prod, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${prod.nombre}</span>
                <div class="controles-carrito">
                    <span>$${prod.precio}</span>
                    <button onclick="eliminarProducto(${index})" class="boton-eliminar" title="Eliminar">&times;</button>
                </div>
            `;
            listaCarrito.appendChild(li);
        });
    }

    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    totalTexto.innerText = `$${total}`;
    contadorCarrito.innerText = carrito.length;
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const agregarAlCarrito = (id) => {
    const prod = productos.find((p) => p.id === id);
    carrito.push(prod);
    actualizarCarrito();
    
    Toastify({
        text: `Agregaste ${prod.nombre}`,
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: { background: "linear-gradient(to right, #9F7AEA, #805AD5)" }
    }).showToast();
};

const eliminarProducto = (index) => {
    carrito.splice(index, 1);
    actualizarCarrito();
};


btnVaciar.addEventListener("click", () => {
    if (carrito.length === 0) return;
    Swal.fire({
        title: '¿Vaciar carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#9F7AEA',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            actualizarCarrito();
            Swal.fire('Listo', 'El carrito está vacío.', 'success');
        }
    });
});

btnComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El carrito está vacío', confirmButtonColor: '#9F7AEA' });
        return;
    }

    Swal.fire({
        title: 'Procesando compra...',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => { Swal.showLoading(); }
    }).then(() => {
        carrito = []; 
        actualizarCarrito(); 
        
        Swal.fire({
            icon: 'success',
            title: '¡Compra Exitosa!',
            text: 'Gracias por tu compra.',
            confirmButtonColor: '#9F7AEA'
        });
    });
});

window.eliminarProducto = eliminarProducto;


cargarProductos();
actualizarCarrito();

