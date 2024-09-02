import { agregarProductoAlCarrito, restarProductoDelCarrito, obtenerCantidadEnCarrito } from './cart.js';

export function renderPromos(data) {
    const promoProducts = data.filter(product => product.promo === true);
    if (promoProducts.length > 0) {
        createPromoSection(promoProducts);
        startAutoScroll();
    }
}

function createPromoSection(promoProducts) {
    const appElement = document.getElementById("app");
    const promoSection = document.createElement("section");
    promoSection.id = "promos";

    const promosContainer = document.createElement("ol");
    promosContainer.id = "promos-container";
    promoSection.appendChild(promosContainer);

    promoProducts.forEach(product => {
        const productItem = createPromoProductItem(product);
        promosContainer.appendChild(productItem);
    });

    appElement.appendChild(promoSection);
}

function createPromoProductItem(product) {
    const li = document.createElement("li");
    li.style.backgroundImage = `url(${product.image})`;
    li.style.backgroundSize = 'cover';
    li.style.backgroundPosition = 'center';
    li.style.color = 'white';

    const productInfo = document.createElement("div");
    productInfo.className = 'product-info';
    productInfo.innerHTML = `
        <h3>${product.name}</h3>
        <span>$${product.price}</span>
        <div class="promos-product-controls" style="display: none;">
            <button class="btn-restar" data-id="${product.id}">-</button>
            <span id="cantidad-producto-${product.id}">${obtenerCantidadEnCarrito(product.id)}</span>
            <button class="btn-sumar" data-id="${product.id}">+</button>
        </div>
    `;

    const promosProductControls = productInfo.querySelector('.promos-product-controls');

    // Acción para mostrar y ocultar promos-product-controls
    productInfo.addEventListener('mouseover', () => {
        promosProductControls.style.display = 'flex';
    });

    productInfo.addEventListener('mouseout', () => {
        promosProductControls.style.display = 'none';
    });

    // Añadir eventos a los botones de incrementar y restar
    productInfo.querySelector('.btn-sumar').addEventListener('click', () => {
        agregarProductoAlCarrito(product);
    });

    productInfo.querySelector('.btn-restar').addEventListener('click', () => {
        restarProductoDelCarrito(product.id);
    });

    li.appendChild(productInfo);
    return li;
}

// Función para iniciar el scroll automático de la sección de promociones
function startAutoScroll() {
    const promosContainer = document.getElementById('promos-container');
    const scrollAmount = 200;
    const intervalTime = 3000;

    function autoScroll() {
        if (promosContainer.scrollLeft + promosContainer.clientWidth >= promosContainer.scrollWidth) {
            promosContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            promosContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    setInterval(autoScroll, intervalTime);
}
