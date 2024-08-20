import { addToCart, lessToCart, removeFromCart, loadCart, localCart } from './cart.js';

const PRODUCTS_PER_PAGE = 6;

export function renderSections(data) {
    const uniqueTypes = [...new Set(data.map(product => product.type))];

    uniqueTypes.forEach(type => {
        const section = createSection(type);
        document.getElementById("app").appendChild(section);

        const productsByType = data.filter(product => product.type === type);
        renderSection(section, productsByType, type);
    });

    updateAllProductQuantities();  // Inicializa los spans con las cantidades
}

function createSection(type) {
    const section = document.createElement("section");
    section.classList.add("type_product");
    section.id = type;
    return section;
}

function renderSection(section, products, sectionType) {
    const filtrosContainer = createFilters(products);
    const productsContainer = document.createElement("ol");
    productsContainer.classList.add("productos-container");

    section.appendChild(filtrosContainer);
    section.appendChild(productsContainer);

    const verMasButton = createVerMasButton(productsContainer, products);
    section.appendChild(verMasButton);

    displayAllProducts(products, productsContainer, verMasButton, 1);
}

function createVerMasButton(productsContainer, products) {
    const verMasButton = document.createElement("button");
    verMasButton.textContent = "Ver Más";
    verMasButton.classList.add("ver-mas-productos");

    let currentPage = 1;

    verMasButton.addEventListener("click", () => {
        currentPage++;
        displayMoreProducts(products, productsContainer, verMasButton, currentPage);
    });

    return verMasButton;
}

function createFilters(products) {
    const filtrosContainer = document.createElement("div");
    filtrosContainer.classList.add("filtros");

    const verTodosButton = document.createElement("button");
    verTodosButton.textContent = "Ver Todos";
    filtrosContainer.appendChild(verTodosButton);

    return filtrosContainer;
}

function displayAllProducts(products, container, verMasButton, currentPage) {
    container.innerHTML = "";
    displayMoreProducts(products, container, verMasButton, currentPage);
}

function displayMoreProducts(products, container, verMasButton, currentPage) {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = currentPage * PRODUCTS_PER_PAGE;
    const filteredProducts = products.slice(start, end);

    filteredProducts.forEach(product => {
        const productItem = createProductItem(product);
        container.appendChild(productItem);
    });

    if (end >= products.length) {
        verMasButton.style.display = "none";
    }
}

function createProductItem(product) {
    const li = document.createElement("li");
    const productInCart = localCart.find(item => item.id === product.id);
    const productQuantity = productInCart ? productInCart.quantity : 0;

    li.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <span>$${product.price}</span>
        <div class="quantity-controls">
          <button class="less-to-cart" data-id="${product.id}">-</button>
          <span class="product-quantity" data-id="${product.id}">${productQuantity}</span>
          <button class="add-to-cart" data-product='${JSON.stringify(product)}' data-id="${product.id}">+</button>
        </div>
    `;
    return li;
}

// Actualización de los spans de los productos
function updateProductQuantityInView(productId) {
    const productInCart = localCart.find(item => item.id === productId);
    const quantitySpan = document.querySelector(`.product-quantity[data-id="${productId}"]`);

    if (quantitySpan) {
        quantitySpan.textContent = productInCart ? productInCart.quantity : 0;
    }
}

function updateAllProductQuantities() {
    document.querySelectorAll('.product-quantity').forEach(span => {
        const productId = span.getAttribute('data-id');
        updateProductQuantityInView(productId);
    });
}

// Sincronización periódica con el carrito
setInterval(() => {
    loadCart();  
    updateAllProductQuantities();
}, 3000);

document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('add-to-cart')) {
        const productId = target.getAttribute('data-id');
        const product = JSON.parse(target.getAttribute('data-product'));
        addToCart(product);
        updateProductQuantityInView(productId);
    } else if (target.classList.contains('less-to-cart')) {
        const productId = target.getAttribute('data-id');
        lessToCart(productId);
        updateProductQuantityInView(productId);
    }
});
