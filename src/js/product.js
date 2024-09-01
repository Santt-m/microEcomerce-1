import { agregarProductoAlCarrito, restarProductoDelCarrito, obtenerCantidadEnCarrito } from './cart.js';


// Función para generar las secciones y filtros dinámicos
export function generarSecciones(productos) {
    const appContainer = document.getElementById('app');
    const productosPorTipo = agruparPor(productos, 'type');

    crearModalFiltroPrecios();

    for (const [tipo, productosDeTipo] of Object.entries(productosPorTipo)) {
        const section = document.createElement('section');
        section.classList.add('product-section');
        section.id = `section-${tipo}`;

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);

        const filterContainer = document.createElement('div');
        filterContainer.classList.add('filter-container');

        const showAllButton = document.createElement('button');
        showAllButton.textContent = 'Mostrar todos';
        showAllButton.onclick = () => mostrarProductos(section, productosDeTipo);

        filterContainer.appendChild(showAllButton);

        const tagsUnicos = [...new Set(productosDeTipo.flatMap(producto => producto.tag))];
        tagsUnicos.forEach(tag => {
            const filterButton = document.createElement('button');
            filterButton.textContent = tag;
            filterButton.onclick = () => filtrarPorTag(section, productosDeTipo, tag);
            filterContainer.appendChild(filterButton);
        });

        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Buscar producto...');
        searchInput.oninput = () => buscarProducto(section, productosDeTipo, searchInput.value);

        filterContainer.appendChild(searchInput);

        const priceFilterButton = document.createElement('button');
        priceFilterButton.textContent = 'Filtrar por precio';
        priceFilterButton.onclick = () => abrirVentanaModal(section, productosDeTipo);
        filterContainer.appendChild(priceFilterButton);

        section.appendChild(sectionTitle);
        section.appendChild(filterContainer);

        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');
        section.appendChild(productContainer);

        mostrarProductos(section, productosDeTipo);
        appContainer.appendChild(section);
    }
}

// Función para crear la ventana modal de filtro de precios
function crearModalFiltroPrecios() {
    const modal = document.createElement('div');
    modal.id = 'modal-filtro-precio';
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.id = 'cerrar-modal';
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Filtrar por precio';

    const minLabel = document.createElement('label');
    minLabel.setAttribute('for', 'min-precio');
    minLabel.textContent = 'Precio mínimo:';

    const minInput = document.createElement('input');
    minInput.setAttribute('type', 'number');
    minInput.id = 'min-precio';
    minInput.placeholder = 'Mínimo';

    const maxLabel = document.createElement('label');
    maxLabel.setAttribute('for', 'max-precio');
    maxLabel.textContent = 'Precio máximo:';

    const maxInput = document.createElement('input');
    maxInput.setAttribute('type', 'number');
    maxInput.id = 'max-precio';
    maxInput.placeholder = 'Máximo';

    const aplicarFiltroBtn = document.createElement('button');
    aplicarFiltroBtn.id = 'aplicar-filtro-precio';
    aplicarFiltroBtn.textContent = 'Aplicar filtro';

    modalContent.append(closeButton, modalTitle, minLabel, minInput, maxLabel, maxInput, aplicarFiltroBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Lógica para cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Función para abrir la ventana modal de filtro de precios
function abrirVentanaModal(section, productosDeTipo) {
    const modal = document.getElementById('modal-filtro-precio');
    modal.style.display = 'block';

    const aplicarFiltroBtn = document.getElementById('aplicar-filtro-precio');
    aplicarFiltroBtn.onclick = () => {
        const minPrecio = parseFloat(document.getElementById('min-precio').value) || 0;
        const maxPrecio = parseFloat(document.getElementById('max-precio').value) || Infinity;
        filtrarPorPrecio(section, productosDeTipo, minPrecio, maxPrecio);
        modal.style.display = 'none'; // Cerrar modal
    };
}

// Función para agrupar productos por una propiedad (en este caso 'type')
function agruparPor(array, propiedad) {
    return array.reduce((acc, obj) => {
        const key = obj[propiedad];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

// Función para mostrar todos los productos
function mostrarProductos(section, productos) {
    const productContainer = section.querySelector('.product-container');
    productContainer.innerHTML = ''; // Limpiar productos actuales
    productos.forEach(producto => {
        const productCard = crearProductCard(producto);
        productContainer.appendChild(productCard);
    });
}

// Función para filtrar productos por tag
function filtrarPorTag(section, productos, tag) {
    const productosFiltrados = productos.filter(producto => producto.tag.includes(tag));
    mostrarProductos(section, productosFiltrados);
}

// Función para buscar productos por nombre
function buscarProducto(section, productos, query) {
    const productosFiltrados = productos.filter(producto =>
        producto.name.toLowerCase().includes(query.toLowerCase())
    );
    mostrarProductos(section, productosFiltrados);
}

// Función para filtrar productos por precio
function filtrarPorPrecio(section, productos, minPrecio, maxPrecio) {
    const productosFiltrados = productos.filter(producto =>
        producto.price >= minPrecio && producto.price <= maxPrecio
    );
    mostrarProductos(section, productosFiltrados);
}

// Función para crear las tarjetas de productos
function crearProductCard(producto) {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}">
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <p>Precio: $${producto.price}</p>
        <div class="product-controls">
            <button class="btn-restar" data-id="${producto.id}">-</button>
            <span id="cantidad-producto-${producto.id}">${obtenerCantidadEnCarrito(producto.id)}</span>
            <button class="btn-sumar" data-id="${producto.id}">+</button>
        </div>
    `;

    // Añadir eventos a los botones de incrementar y restar
    card.querySelector('.btn-sumar').addEventListener('click', () => {
        agregarProductoAlCarrito(producto);
        actualizarCantidadUI(producto.id);
    });

    card.querySelector('.btn-restar').addEventListener('click', () => {
        restarProductoDelCarrito(producto.id);
        actualizarCantidadUI(producto.id);
    });

    return card;
}

// Función para actualizar el span con la cantidad de productos
export function actualizarCantidadUI(idProducto) {
    const cantidad = obtenerCantidadEnCarrito(idProducto);
    document.getElementById(`cantidad-producto-${idProducto}`).textContent = cantidad;
}
