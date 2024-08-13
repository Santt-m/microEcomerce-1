import { addToCart, lessToCart } from '../../cart/cart.js';

// Cargar los datos de productos desde el archivo JSON
fetch('../db/productData.json')
    .then(response => response.json())
    .then(data => {
        // Asignar IDs únicos con prefijo 'prod-' a cada producto
        data.forEach(producto => {
            producto.id = `prod-${producto.id}`;
        });

        const productos = data;
        const promosContainer = document.getElementById('promos-container');

        // Mostrar productos en promoción
        mostrarPromos(productos, promosContainer);
        
        // Configurar auto-scroll
        autoScrollPromos();
    });

// Función para mostrar productos en promoción
function mostrarPromos(productos, container) {
    container.innerHTML = '';
    const productosEnPromo = productos.filter(producto => producto.promo);
    productosEnPromo.forEach(producto => {
        container.appendChild(crearProductoItem(producto));
    });
}

// Función para crear un elemento de producto con imagen de fondo y botones
function crearProductoItem(producto) {
    const li = document.createElement('li');
    li.style.backgroundImage = `url(${producto.image})`;
    li.style.backgroundSize = 'cover';
    li.style.backgroundPosition = 'center';
    li.style.color = 'white';

    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';
    productInfo.innerHTML = `
        <h3>${producto.name}</h3>
        <span>$${producto.price}</span>
        <div class="quantity-controls" style="display: none;">
            <button class="less-to-cart" data-id="${producto.id}">-</button>
            <button class="add-to-cart" data-product='${JSON.stringify(producto)}'>+</button>
        </div>
    `;

    // Agregar eventos de mouseover y mouseout
    productInfo.addEventListener('mouseover', () => {
        productInfo.querySelector('div').style.display = 'flex';
    });

    productInfo.addEventListener('mouseout', () => {
        productInfo.querySelector('div').style.display = 'none';
    });

    li.appendChild(productInfo);
    return li;
}

// Función para auto-scroll en promociones
function autoScrollPromos() {
    const promosContainer = document.getElementById('promos-container');
    const scrollAmount = 200; // Cantidad de píxeles a desplazar cada vez
    const intervalTime = 3000; // Intervalo de tiempo en milisegundos (3 segundos)

    function autoScroll() {
        if (promosContainer.scrollLeft + promosContainer.clientWidth >= promosContainer.scrollWidth) {
            // Si llega al final, vuelve al inicio
            promosContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Desplaza hacia la derecha
            promosContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    // Configura el intervalo para el auto-scroll
    setInterval(autoScroll, intervalTime);
}

// Delegación de eventos para los botones "+" y "-"
document.getElementById('promos-container').addEventListener('click', function(event) {
    const productId = event.target.getAttribute('data-id');
    if (event.target.classList.contains('add-to-cart')) {
        const product = JSON.parse(event.target.getAttribute('data-product'));
        addToCart(product);
    } else if (event.target.classList.contains('less-to-cart')) {
        lessToCart(productId);
    }
});
