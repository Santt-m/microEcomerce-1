export let localCart = [];

// Inicializa la tienda con productos
export function initializeShop(products) {
    loadCart(); // Cargar el carrito desde localStorage
    renderSections(products); // Crear y renderizar las secciones de productos
    updateCartUI(products); // Actualizar la UI del carrito con los productos
}

// Cargar el carrito desde localStorage
function loadCart() {
    const storedCart = localStorage.getItem("localCart");
    if (storedCart) {
        localCart = JSON.parse(storedCart);
    }
    console.log("Carrito cargado desde localStorage:", localCart);
}

// Guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("localCart", JSON.stringify(localCart));
    console.log("Carrito guardado en localStorage:", localCart);
}

// Renderizar las secciones de productos por tipo (esto solo ocurre una vez al cargar la página)
function renderSections(products) {
    const uniqueTypes = [...new Set(products.map(product => product.type))];
    console.log("Tipos de productos encontrados:", uniqueTypes);

    document.getElementById("app").innerHTML = ""; // Limpiar las secciones antes de volver a renderizar

    uniqueTypes.forEach(type => {
        const section = createSection(type);
        document.getElementById("app").appendChild(section);

        const productsByType = products.filter(product => product.type === type);
        renderSection(section, productsByType, products);
    });
}

// Crear una sección para cada tipo de producto
function createSection(type) {
    const section = document.createElement("section");
    section.classList.add("type_product");
    section.id = type;
    section.innerHTML = `<h2>${type}</h2>`;
    return section;
}

// Renderizar una sección específica de productos
function renderSection(section, products, allProducts) {
    const filtrosContainer = createFiltersContainer(products, section, allProducts);
    section.appendChild(filtrosContainer);

    const productsContainer = document.createElement("ol");
    productsContainer.classList.add("productos-container");
    section.appendChild(productsContainer);

    displayProducts(products, productsContainer);

    // Delegación de eventos para manejar los clics en botones de productos
    productsContainer.addEventListener('click', (event) => handleProductActions(event, allProducts));
}

// Crear contenedor de filtros, buscador y botones de filtrado
function createFiltersContainer(products, section, allProducts) {
    const filtrosContainer = document.createElement("div");
    filtrosContainer.classList.add("filtros");

    // Botón "Mostrar Todos"
    const verTodosButton = document.createElement("button");
    verTodosButton.textContent = "Mostrar Todos";
    filtrosContainer.appendChild(verTodosButton);

    verTodosButton.addEventListener("click", () => {
        displayProducts(products, section.querySelector('.productos-container'));
        console.log("Todos los productos mostrados en la sección.");
    });

    // Buscador
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar productos...";
    filtrosContainer.appendChild(searchInput);

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts, section.querySelector('.productos-container'));
        console.log(`Productos filtrados por búsqueda: ${searchTerm}`, filteredProducts);
    });

    // Filtros por Tags
    const tags = new Set();
    products.forEach(product => product.tag.forEach(tag => tags.add(tag)));

    tags.forEach(tag => {
        const tagButton = document.createElement("button");
        tagButton.textContent = tag;
        filtrosContainer.appendChild(tagButton);

        tagButton.addEventListener("click", () => {
            const filteredProducts = products.filter(product => product.tag.includes(tag));
            displayProducts(filteredProducts, section.querySelector('.productos-container'));
            console.log(`Productos filtrados por tag: ${tag}`, filteredProducts);
        });
    });

    // Filtro de precio
    const priceFilterContainer = document.createElement("div");
    priceFilterContainer.classList.add("price-filters");

    const minPriceInput = document.createElement("input");
    minPriceInput.type = "number";
    minPriceInput.placeholder = "Mínimo";
    priceFilterContainer.appendChild(minPriceInput);

    const maxPriceInput = document.createElement("input");
    maxPriceInput.type = "number";
    maxPriceInput.placeholder = "Máximo";
    priceFilterContainer.appendChild(maxPriceInput);

    const filterPriceButton = document.createElement("button");
    filterPriceButton.textContent = "Aplicar Filtro de Precio";
    priceFilterContainer.appendChild(filterPriceButton);

    filterPriceButton.addEventListener("click", () => {
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        const filteredProducts = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
        displayProducts(filteredProducts, section.querySelector('.productos-container'));
        console.log(`Productos filtrados por precio: ${minPrice} - ${maxPrice}`, filteredProducts);
    });

    filtrosContainer.appendChild(priceFilterContainer);

    return filtrosContainer;
}

// Mostrar productos en la sección
function displayProducts(products, container) {
    container.innerHTML = "";

    products.forEach(product => {
        const productItem = createProductItem(product);
        container.appendChild(productItem);
    });
}

// Crear el HTML para cada producto
function createProductItem(product) {
    const li = document.createElement("li");
    const productInCart = localCart.find(item => item.id === product.id.toString());
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

// Actualizar solo las cantidades en las tarjetas de productos, no recargar todo
function updateProductQuantitiesInView() {
    localCart.forEach(cartItem => {
        const quantitySpans = document.querySelectorAll(`.product-quantity[data-id="${cartItem.id}"]`);
        quantitySpans.forEach(span => {
            span.textContent = cartItem.quantity;
        });
    });
}

// Manejar las acciones de agregar y quitar productos
function handleProductActions(event, products) {
    const target = event.target;
    const action = target.getAttribute('data-action');
    const productId = target.getAttribute('data-id');

    console.log(`Botón ${action} clickeado para producto ID: ${productId}`);

    if (action === 'add') {
        addToCart(productId, products);
    } else if (action === 'less') {
        lessToCart(productId, products);
    }
}

// Agregar producto al carrito
function addToCart(productId, products) {
    console.log(`Botón + clickeado para producto ID: ${productId}`);

    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) {
        console.error(`Producto con ID: ${productId} no encontrado.`);
        return;
    }

    const cartItem = localCart.find(item => item.id === productId.toString());

    if (cartItem) {
        cartItem.quantity += 1;
        console.log(`Cantidad incrementada para producto ID: ${productId}`);
    } else {
        localCart.push({ id: productId.toString(), quantity: 1, name: product.name });
        console.log(`Producto añadido al carrito: ${product.name}`);
    }

    saveCartToLocalStorage();
    updateCartUI(products); // Actualizar la UI del carrito
    updateProductQuantitiesInView(); // Actualizar solo las cantidades en las tarjetas de productos
}

// Quitar producto del carrito
function lessToCart(productId, products) {
    console.log(`Botón - clickeado para producto ID: ${productId}`);

    const cartItem = localCart.find(item => item.id === productId.toString());

    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            localCart = localCart.filter(item => item.id !== productId.toString());
            console.log(`Producto con ID ${productId} eliminado del carrito.`);
        }

        saveCartToLocalStorage();
        updateCartUI(products); // Actualizar la UI del carrito
        updateProductQuantitiesInView(); // Actualizar solo las cantidades en las tarjetas de productos
    }
}

// Actualizar la UI del carrito
function updateCartUI(products) {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    cartContainer.innerHTML = ""; // Limpiar el contenedor del carrito
    if (localCart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío</p>";
        totalPriceElement.textContent = "$0";
        return;
    }

    let totalPrice = 0;
    localCart.forEach(cartItem => {
        const product = findProductById(cartItem.id, products);
        if (product) {
            const cartItemElement = document.createElement("li");
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
                ${product.name} - $${product.price} x ${cartItem.quantity}
                <div class="quantity-controls">
                    <button class="less-to-cart" data-id="${product.id}" data-action="less">-</button>
                    <span class="product-quantity" data-id="${product.id}">${cartItem.quantity}</span>
                    <button class="add-to-cart" data-id="${product.id}" data-action="add">+</button>
                    <button class="remove-from-cart" data-id="${product.id}" data-action="remove">Eliminar</button>
                </div>
            `;
            totalPrice += product.price * cartItem.quantity;
            cartContainer.appendChild(cartItemElement);
        }
    });

    totalPriceElement.textContent = `$${totalPrice}`;
    attachCartEventListeners(products); // Agregar eventos de nuevo
}

// Encontrar el producto por ID en los productos pasados
function findProductById(productId, products) {
    return products.find(product => product.id.toString() === productId.toString()); // Convertimos a string para comparación segura
}

// Delegación de eventos para el carrito
function attachCartEventListeners(products) {
    const cartContainer = document.getElementById("cart-items");

    cartContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.getAttribute('data-id');

        if (target.classList.contains('add-to-cart')) {
            addToCart(productId, products);
        } else if (target.classList.contains('less-to-cart')) {
            lessToCart(productId, products);
        } else if (target.classList.contains('remove-from-cart')) {
            removeFromCart(productId, products);
        }
    });
}

// Eliminar un producto completamente del carrito
function removeFromCart(productId, products) {
    console.log(`Producto eliminado completamente del carrito con ID: ${productId}`);
    localCart = localCart.filter(item => item.id !== productId.toString());

    saveCartToLocalStorage();
    updateCartUI(products); // Actualizar la UI del carrito
    updateProductQuantitiesInView(); // Actualizar solo las cantidades en las tarjetas de productos
}
