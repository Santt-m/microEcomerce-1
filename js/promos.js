import { addToCart, lessToCart } from './cart.js';

export function renderPromos(data) {
    console.log("Iniciando renderPromos con datos:", data);

    // Filtrar los productos en promoción
    const promoProducts = data.filter(product => product.promo === true);
    if (promoProducts.length > 0) {
        createPromoSection(promoProducts);
        startAutoScroll();
    } else {
        console.log("No hay productos en promoción.");
    }
}

// Función para crear la sección de promociones
function createPromoSection(promoProducts) {
    const appElement = document.getElementById("app");

    // Crear la sección de promociones
    const promoSection = document.createElement("section");
    promoSection.id = "promos";

    // Título de la sección
    const title = document.createElement("h2");
    title.textContent = "Promociones Especiales";
    promoSection.appendChild(title);

    // Contenedor de productos en promoción
    const promosContainer = document.createElement("ol");
    promosContainer.id = "promos-container";
    promoSection.appendChild(promosContainer);

    // Renderizar los productos en promoción
    promoProducts.forEach(product => {
        const productItem = createPromoProductItem(product);
        promosContainer.appendChild(productItem);
    });

    // Agregar la sección al DOM
    appElement.appendChild(promoSection);
}

// Función para crear un producto de promoción
function createPromoProductItem(product) {
    console.log(`Creando producto en promoción: ${product.name}`);

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
        <div class="quantity-controls" style="display: none;">
            <button class="less-to-cart" data-id="${product.id}">-</button>
            <span class="product-quantity" data-id="${product.id}">0</span>
            <button class="add-to-cart" data-product='${JSON.stringify(product)}'>+</button>
        </div>
    `;

    // Mostrar controles de cantidad al pasar el ratón
    productInfo.addEventListener('mouseover', () => {
        productInfo.querySelector('.quantity-controls').style.display = 'flex';
    });

    productInfo.addEventListener('mouseout', () => {
        productInfo.querySelector('.quantity-controls').style.display = 'none';
    });

    li.appendChild(productInfo);
    return li;
}

// Función para configurar el auto-scroll de las promociones
function startAutoScroll() {
    const promosContainer = document.getElementById('promos-container');
    const scrollAmount = 200; // Cantidad de píxeles a desplazar
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

    // Inicia el auto-scroll con un intervalo
    setInterval(autoScroll, intervalTime);
}

// Delegación de eventos para los botones "+" y "-"
document.addEventListener('click', function(event) {
    const target = event.target;
    const productId = target.getAttribute('data-id');

    if (target.classList.contains('add-to-cart')) {
        const product = JSON.parse(target.getAttribute('data-product'));
        console.log(`Añadiendo al carrito producto en promoción con ID: ${productId}`);
        addToCart(product);
    } else if (target.classList.contains('less-to-cart')) {
        console.log(`Disminuyendo cantidad del producto en promoción con ID: ${productId}`);
        lessToCart(productId);
    }
});
