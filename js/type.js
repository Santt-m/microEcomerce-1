import { addToCart, lessToCart, updateProductQuantityInView, localCart } from './cart.js';

// Renderizar las secciones de productos por tipo
export function renderSections(data) {
    const uniqueTypes = [...new Set(data.map(product => product.type))];
    console.log("Tipos de productos encontrados:", uniqueTypes);

    uniqueTypes.forEach(type => {
        const section = createSection(type);
        document.getElementById("app").appendChild(section);

        const productsByType = data.filter(product => product.type === type);
        renderSection(section, productsByType, data);
    });
}

// Crear una sección para cada tipo de producto
function createSection(type) {
    const section = document.createElement("section");
    section.classList.add("type_product");
    section.id = type;
    section.innerHTML = `<h2>${type}</h2>`;
    console.log(`Sección creada para tipo: ${type}`);
    return section;
}

// Renderizar la sección de productos
function renderSection(section, products, productsData) {
    const filtrosContainer = createFiltersContainer(products, section, productsData);
    section.appendChild(filtrosContainer);

    const productsContainer = document.createElement("ol");
    productsContainer.classList.add("productos-container");
    section.appendChild(productsContainer);

    displayProducts(products, productsContainer, productsData);

    // Delegación de eventos para manejar los clics en botones de productos
    productsContainer.addEventListener('click', (event) => handleProductActions(event, productsData));
}

// Crear contenedor de filtros y buscadores
function createFiltersContainer(products, section, productsData) {
    const filtrosContainer = document.createElement("div");
    filtrosContainer.classList.add("filtros");

    const verTodosButton = document.createElement("button");
    verTodosButton.textContent = "Ver Todos";
    filtrosContainer.appendChild(verTodosButton);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar productos...";
    filtrosContainer.appendChild(searchInput);

    // Filtros por Tags
    const tags = new Set();
    products.forEach(product => product.tag.forEach(tag => tags.add(tag)));

    tags.forEach(tag => {
        const tagButton = document.createElement("button");
        tagButton.textContent = tag;
        filtrosContainer.appendChild(tagButton);

        tagButton.addEventListener("click", () => {
            const filteredProducts = products.filter(product => product.tag.includes(tag));
            displayProducts(filteredProducts, section.querySelector('.productos-container'), productsData);
            console.log(`Productos filtrados por tag: ${tag}`, filteredProducts);
        });
    });

    // Filtro de precio
    const btnfilterprice = document.createElement("button");
    btnfilterprice.textContent = "Filtros de Precio";
    filtrosContainer.appendChild(btnfilterprice);

    const priceFilters = createPriceFilters(products, section, productsData);
    filtrosContainer.appendChild(priceFilters);

    btnfilterprice.addEventListener("click", () => {
        priceFilters.style.display = priceFilters.style.display === "none" ? "block" : "none";
    });

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts, section.querySelector('.productos-container'), productsData);
        console.log(`Productos filtrados por búsqueda: ${searchTerm}`, filteredProducts);
    });

    verTodosButton.addEventListener("click", () => {
        displayProducts(products, section.querySelector('.productos-container'), productsData);
        console.log("Todos los productos mostrados.");
    });

    return filtrosContainer;
}

// Crear filtros de precio
function createPriceFilters(products, section, productsData) {
    const priceFilters = document.createElement("div");
    priceFilters.classList.add("price-filters");
    priceFilters.style.display = "none";

    const minPriceInput = document.createElement("input");
    minPriceInput.type = "number";
    minPriceInput.placeholder = "Mínimo";
    priceFilters.appendChild(minPriceInput);

    const maxPriceInput = document.createElement("input");
    maxPriceInput.type = "number";
    maxPriceInput.placeholder = "Máximo";
    priceFilters.appendChild(maxPriceInput);

    const filterPriceButton = document.createElement("button");
    filterPriceButton.textContent = "Aplicar Filtro";
    priceFilters.appendChild(filterPriceButton);

    filterPriceButton.addEventListener("click", () => {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        const filteredProducts = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
        displayProducts(filteredProducts, section.querySelector('.productos-container'), productsData);
        console.log(`Productos filtrados por precio: ${minPrice} - ${maxPrice}`, filteredProducts);
    });

    return priceFilters;
}

// Mostrar productos en la sección correspondiente
function displayProducts(products, container, productsData) {
    container.innerHTML = "";

    products.forEach(product => {
        const productItem = createProductItem(product);
        container.appendChild(productItem);
    });
    console.log("Productos mostrados:", products.map(p => p.name));
}

// Crear el HTML para cada producto
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
            <button class="less-to-cart" data-id="${product.id}" data-action="less">-</button>
            <span class="product-quantity" data-id="${product.id}">${productQuantity}</span>
            <button class="add-to-cart" data-id="${product.id}" data-action="add">+</button>
        </div>
    `;
    return li;
}

// Manejar las acciones de agregar y quitar productos
function handleProductActions(event, productsData) {
    const target = event.target;
    const action = target.getAttribute('data-action');
    const productId = target.getAttribute('data-id');

    if (action === 'add') {
        console.log(`Botón + clickeado para producto ID: ${productId}`);
        addToCart(productId, productsData);
    } else if (action === 'less') {
        console.log(`Botón - clickeado para producto ID: ${productId}`);
        lessToCart(productId, productsData);
    }

    // Actualizar las vistas después de la acción
    updateProductQuantityInView(productId); 
    console.log(`Cantidad actualizada en la vista para producto ID: ${productId}`);
}
