import { actualizarCantidadUI } from './product.js';

// Estado del carrito
let carrito = [];
let clienteData;

// Inicialización
export function initCarrito(datosCliente) {
    clienteData = datosCliente; // Guardar los datos del cliente
    cargarCarritoDesdeStorage();
    actualizarCarritoUI();
    asignarEventosCarrito();
    actualizarGloboCarrito();
}

// Función para actualizar el globo del carrito
function actualizarGloboCarrito() {
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const globoCarrito = document.getElementById('cart-bubble');

    if (totalProductos > 0) {
        globoCarrito.style.display = 'flex';
        globoCarrito.textContent = totalProductos;
    } else {
        globoCarrito.style.display = 'none';
    }
}

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) carrito = JSON.parse(carritoGuardado);
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

export function agregarProductoAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarritoUI();
    guardarCarritoEnStorage();
    actualizarCantidadUI(producto.id);
    actualizarGloboCarrito();
    actualizarTodosLosSpan();
}

export function restarProductoDelCarrito(idProducto) {
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad -= 1;
    } else {
        eliminarProductoDelCarrito(idProducto);
    }

    actualizarCarritoUI();
    guardarCarritoEnStorage();
    actualizarCantidadUI(idProducto);
    actualizarGloboCarrito();
    actualizarTodosLosSpan();
}

export function obtenerCantidadEnCarrito(idProducto) {
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    return productoEnCarrito ? productoEnCarrito.cantidad : 0;
}

function eliminarProductoDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarritoUI();
    guardarCarritoEnStorage();
    actualizarCantidadUI(idProducto);
    actualizarGloboCarrito();
    actualizarTodosLosSpan();
}

function actualizarCarritoUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    carrito.forEach(item => {
        totalItems += item.cantidad;
        totalPrice += item.cantidad * item.price;

        const itemElement = document.createElement('li');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <div class="cart-controls">
                    <button class="btn-restar" data-id="${item.id}">-</button>
                    <span id="cantidad-carrito-${item.id}">${item.cantidad}</span>
                    <button class="btn-sumar" data-id="${item.id}">+</button>
                </div>
                <p class="cart-item-total">Total: $${item.price * item.cantidad}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(itemElement);

        itemElement.querySelector('.btn-sumar').addEventListener('click', () => {
            agregarProductoAlCarrito(item);
            actualizarCantidadCarritoUI(item.id);
        });

        itemElement.querySelector('.btn-restar').addEventListener('click', () => {
            restarProductoDelCarrito(item.id);
            actualizarCantidadCarritoUI(item.id);
        });

        itemElement.querySelector('.remove-item').addEventListener('click', () => {
            eliminarProductoDelCarrito(item.id);
        });
    });

    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = totalPrice;
}

function actualizarCantidadCarritoUI(idProducto) {
    const cantidad = obtenerCantidadEnCarrito(idProducto);
    document.getElementById(`cantidad-carrito-${idProducto}`).textContent = cantidad;
}

function asignarEventosCarrito() {
    document.getElementById('clear-cart').addEventListener('click', vaciarCarrito);

    document.getElementById('show-cart').addEventListener('click', () => mostrarSeccion('cart-content'));
    document.getElementById('show-direccion').addEventListener('click', () => mostrarSeccion('direccion-form'));
    document.getElementById('show-pago').addEventListener('click', () => {
        generarResumen();
        mostrarSeccion('pago-form');
    });

    // Mostrar u ocultar el formulario de dirección según la opción seleccionada
    document.getElementsByName('tipo-entrega').forEach(radio => {
        radio.addEventListener('change', () => {
            const direccionEnvio = document.getElementById('direccion-envio');
            if (document.getElementById('delivery').checked) {
                direccionEnvio.style.display = 'flex';
            } else {
                direccionEnvio.style.display = 'none';
            }
        });
    });
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarritoUI();
    guardarCarritoEnStorage();
    actualizarGloboCarrito();
}

// Función para generar el resumen de pago
function generarResumen() {
    const resumenPedido = document.getElementById('resumen-pedido');
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;

    const tipoEntregaInput = document.querySelector('input[name="tipo-entrega"]:checked');
    if (!tipoEntregaInput) {
        alert("Por favor, seleccione un tipo de entrega.");
        return;
    }
    const tipoEntrega = tipoEntregaInput.value;

    let resumenHTML = `
        <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Tipo de entrega:</strong> ${tipoEntrega === 'take-away' ? 'Take Away' : 'Delivery'}</p>
    `;

    let mensajeWhatsApp = `*Resumen del Pedido:*\n`;
    mensajeWhatsApp += `Nombre: ${nombre} ${apellido}\n`;
    mensajeWhatsApp += `Teléfono: ${telefono}\n`;
    mensajeWhatsApp += `Tipo de entrega: ${tipoEntrega === 'take-away' ? 'Take Away' : 'Delivery'}\n`;

    if (tipoEntrega === 'delivery') {
        const direccion = document.getElementById('direccion').value || 'No especificada';
        const numero = document.getElementById('numero').value || 'No especificado';
        const piso = document.getElementById('piso').value || 'No especificado';
        const departamento = document.getElementById('departamento').value || 'No especificado';
        const notas = document.getElementById('notas').value || 'No especificadas';

        resumenHTML += `
            <p><strong>Dirección:</strong> ${direccion}, ${numero}, Piso: ${piso}, Departamento: ${departamento}</p>
            <p><strong>Notas:</strong> ${notas}</p>
        `;

        mensajeWhatsApp += `Dirección: ${direccion}, ${numero}, Piso: ${piso}, Departamento: ${departamento}\n`;
        mensajeWhatsApp += `Notas: ${notas}\n`;
    }

    resumenHTML += `<h4>Resumen del Carrito:</h4>`;
    carrito.forEach(item => {
        resumenHTML += `<p>${item.name} (x${item.cantidad}) - $${item.price * item.cantidad}</p>`;
        mensajeWhatsApp += `${item.name} (x${item.cantidad}) - $${item.price * item.cantidad}\n`;
    });

    // Utilizar el número de WhatsApp del cliente
    const numeroWhatsApp = clienteData.whatsapp; // Cambiamos aquí
    const mensajeEncoded = encodeURIComponent(mensajeWhatsApp);
    const enlaceWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeEncoded}`;

    resumenHTML += `
        <a href="${enlaceWhatsApp}" target="_blank" class="pedido-whatsapp">Enviar por WhatsApp</a>
    `;

    resumenPedido.innerHTML = resumenHTML;
}


// Función para mostrar u ocultar secciones
function mostrarSeccion(seccionID) {
    const secciones = ['cart-content', 'direccion-form', 'pago-form'];
    secciones.forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(seccionID).style.display = 'flex';
}

// Función para cargar los datos de dirección desde localStorage
function cargarDatosDesdeLocalStorage() {
    const campos = ['nombre', 'apellido', 'telefono', 'direccion', 'numero', 'piso', 'departamento', 'notas'];
    campos.forEach(campo => {
        const valor = localStorage.getItem(campo);
        if (valor) {
            document.getElementById(campo).value = valor;
        }

        // Guardar en localStorage cuando el campo cambia
        document.getElementById(campo).addEventListener('input', () => {
            localStorage.setItem(campo, document.getElementById(campo).value);
        });
    });
}

export function actualizarTodosLosSpan() {
    carrito.forEach(item => {
        const productQuantitySpan = document.getElementById(`cantidad-producto-${item.id}`);
        if (productQuantitySpan) {
            productQuantitySpan.textContent = item.cantidad;
        }

        const cartQuantitySpan = document.getElementById(`cantidad-carrito-${item.id}`);
        if (cartQuantitySpan) {
            cartQuantitySpan.textContent = item.cantidad;
        }
    });
}
