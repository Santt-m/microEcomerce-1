import { addToCart, lessToCart } from './cart.js';

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

    promosContainer.promoProducts = promoProducts;
    promosContainer.addEventListener('click', handlePromoActions);
}

function handlePromoActions(event) {
    const target = event.target;
    const productId = target.getAttribute('data-id');
    const promoProducts = event.currentTarget.promoProducts;

    if (!promoProducts) return;

    if (target.classList.contains('add-to-cart')) {
        addToCart(productId, promoProducts);
    } else if (target.classList.contains('less-to-cart')) {
        lessToCart(productId, promoProducts);
    }
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
        <div class="quantity-controls" style="display: none;">
            <button class="less-to-cart" data-id="${product.id}">-</button>
            <span class="product-quantity" data-id="${product.id}">0</span>
            <button class="add-to-cart" data-id="${product.id}">+</button>
        </div>
    `;

    productInfo.addEventListener('mouseover', () => {
        productInfo.querySelector('.quantity-controls').style.display = 'flex';
    });

    productInfo.addEventListener('mouseout', () => {
        productInfo.querySelector('.quantity-controls').style.display = 'none';
    });

    li.appendChild(productInfo);
    return li;
}

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
