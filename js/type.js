import { addToCart, lessToCart, removeFromCart, updateCartUI, loadCart } from './cart.js';

const PRODUCTS_PER_PAGE = 6;

// Exportar renderSections
export function renderSections(data) {
    console.log("Iniciando renderSections con datos:", data);
    const uniqueTypes = [...new Set(data.map(product => product.type))];
    
    uniqueTypes.forEach(type => {
        const section = createSection(type);
        document.getElementById("app").appendChild(section);
        console.log(`Sección creada para tipo: ${type}`);

        const productsByType = data.filter(product => product.type === type);
        renderSection(section, productsByType, type);
    });
}

// Función para crear una sección
function createSection(type) {
    console.log(`Creando sección para el tipo: ${type}`);
    const section = document.createElement("section");
    section.id = type;
    return section;
}

// Función para renderizar cada sección con filtros y productos
function renderSection(section, products, sectionType) {
    console.log(`Renderizando sección para ${sectionType} con productos:`, products);
    
    const filtrosContainer = document.createElement("div");
    filtrosContainer.classList.add("filtros");
    
    const verTodosButton = document.createElement("button");
    verTodosButton.textContent = "Ver Todos";
    filtrosContainer.appendChild(verTodosButton);

    const tags = new Set();
    products.forEach(product => {
        product.tag.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
        const tagButton = document.createElement("button");
        tagButton.textContent = tag;
        tagButton.addEventListener("click", () => {
            console.log(`Filtrando por tag: ${tag}`);
            filterByTag(products, tag, section.querySelector(".productos-container"), section.querySelector(".ver-mas-productos"));
        });
        filtrosContainer.appendChild(tagButton);
    });

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar productos...";
    filtrosContainer.appendChild(searchInput);

    const btnfilterprice = document.createElement("button");
    btnfilterprice.textContent = "Filtros de Precio";
    btnfilterprice.classList.add("ver-price-filters");
    filtrosContainer.appendChild(btnfilterprice);

    const priceFilters = document.createElement("div");
    priceFilters.classList.add("price-filters");
    priceFilters.style.display = "none"; 

    const minPriceLabel = document.createElement("label");
    minPriceLabel.textContent = "Precio Mínimo: ";
    priceFilters.appendChild(minPriceLabel);

    const minPriceInput = document.createElement("input");
    minPriceInput.type = "number";
    minPriceInput.placeholder = "0";
    priceFilters.appendChild(minPriceInput);

    const maxPriceLabel = document.createElement("label");
    maxPriceLabel.textContent = "Precio Máximo: ";
    priceFilters.appendChild(maxPriceLabel);

    const maxPriceInput = document.createElement("input");
    maxPriceInput.type = "number";
    maxPriceInput.placeholder = "10000";
    priceFilters.appendChild(maxPriceInput);

    const filterPriceButton = document.createElement("button");
    filterPriceButton.textContent = "Filtrar por precio";
    priceFilters.appendChild(filterPriceButton);

    filtrosContainer.appendChild(priceFilters);
    section.appendChild(filtrosContainer);

    const productsContainer = document.createElement("ol");
    productsContainer.classList.add("productos-container");
    section.appendChild(productsContainer);

    const verMasButton = document.createElement("button");
    verMasButton.textContent = "Ver Más";
    verMasButton.classList.add("ver-mas-productos");
    section.appendChild(verMasButton);

    let currentPage = 1;
    console.log("Mostrando todos los productos en la primera carga...");
    displayAllProducts(products, productsContainer, verMasButton, currentPage);

    btnfilterprice.addEventListener("click", () => {
        console.log("Toggle filtros de precio");
        if (priceFilters.style.display === "none") {
            priceFilters.style.display = "flex";
        } else {
            priceFilters.style.display = "none";
        }
    });

    searchInput.addEventListener("input", () => {
        const searchTerm = sanitizeInput(searchInput.value);
        console.log(`Filtrando productos por búsqueda: ${searchTerm}`);
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        currentPage = 1;
        displayAllProducts(filteredProducts, productsContainer, verMasButton, currentPage);
    });

    filterPriceButton.addEventListener("click", () => {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        console.log(`Filtrando productos por precio: ${minPrice} - ${maxPrice}`);
        const filteredProducts = products.filter(product =>
            product.price >= minPrice && product.price <= maxPrice
        );
        currentPage = 1;
        displayAllProducts(filteredProducts, productsContainer, verMasButton, currentPage);
    });

    verTodosButton.addEventListener("click", () => {
        console.log("Mostrando todos los productos");
        currentPage = 1;
        displayAllProducts(products, productsContainer, verMasButton, currentPage);
    });

    verMasButton.addEventListener("click", () => {
        console.log("Cargando más productos...");
        currentPage++;
        displayMoreProducts(products, productsContainer, verMasButton, currentPage);
    });
}

function filterByTag(products, tag, container, verMasButton) {
    console.log(`Filtrando productos por tag: ${tag}`);
    const filteredProducts = products.filter(product => product.tag.includes(tag));
    displayAllProducts(filteredProducts, container, verMasButton, 1);
}

function displayAllProducts(products, container, verMasButton, currentPage) {
    console.log("Mostrando productos en página:", currentPage);
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
        console.log("No hay más productos que mostrar");
        verMasButton.style.display = "none";
    } else {
        console.log("Hay más productos que mostrar");
        verMasButton.style.display = "block";
    }
}

function createProductItem(product) {
    console.log(`Creando producto: ${product.name}`);
    const li = document.createElement("li");
    li.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <span>$${product.price}</span>
        <div class="quantity-controls">
          <button class="less-to-cart" data-id="${product.id}">-</button>
          <span class="product-quantity" data-id="${product.id}">0</span>
          <button class="add-to-cart" data-product='${JSON.stringify(product)}' data-id="${product.id}">+</button>
        </div>
    `;
    return li;
}

function sanitizeInput(input) {
    const element = document.createElement("div");
    element.innerText = input;
    return element.innerHTML;
}

// Eventos de agregar y quitar productos del carrito
document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('add-to-cart')) {
        const productId = target.getAttribute('data-id');
        const product = JSON.parse(target.getAttribute('data-product'));
        console.log(`Añadiendo al carrito producto con ID: ${productId}`);
        addToCart(product);
        updateCartUI(); 
    } else if (target.classList.contains('less-to-cart')) {
        const productId = target.getAttribute('data-id');
        console.log(`Quitando del carrito producto con ID: ${productId}`);
        lessToCart(productId);
        updateCartUI(); 
    } else if (target.classList.contains('remove-from-cart')) {
        const productId = target.getAttribute('data-id');
        console.log(`Eliminando del carrito producto con ID: ${productId}`);
        removeFromCart(productId);
        updateCartUI(); 
    }
});
