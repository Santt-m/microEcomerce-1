// Array que contiene los productos agregados al carrito
export let localCart = [];

// Cargar el carrito desde localStorage y actualizar la UI
export function loadCart(productsArray) {
    const storedCart = localStorage.getItem("localCart");
    if (storedCart) {
        localCart = JSON.parse(storedCart);
    }
    updateCartUI(productsArray); 
    updateAllProductQuantitiesInView(); // Actualizar las cantidades en las tarjetas de producto
}

// Guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("localCart", JSON.stringify(localCart));
}

// Agregar producto al carrito
export function addToCart(productId, productsData) {
    if (!productsData || productsData.length === 0) {
        console.error("Los datos del producto no están disponibles.");
        return;
    }

    const cartItem = localCart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        localCart.push({ id: productId, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateProductQuantityInView(productId); // Actualizar la cantidad del producto en el catálogo
    updateCartUI(productsData); // Actualizar la UI del carrito
}

// Quitar producto del carrito
export function lessToCart(productId, productsData) {
    if (!productsData || productsData.length === 0) {
        console.error("Los datos del producto no están disponibles.");
        return;
    }

    const cartItem = localCart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            localCart = localCart.filter(item => item.id !== productId);
        }
    }

    saveCartToLocalStorage();
    updateProductQuantityInView(productId);
    updateCartUI(productsData);
}

// Actualizar cantidad en el catálogo y el carrito
export function updateProductQuantityInView(productId) {
    const cartItem = localCart.find(item => item.id === productId);
    const quantitySpans = document.querySelectorAll(`.product-quantity[data-id="${productId}"]`);

    quantitySpans.forEach(span => {
        span.textContent = cartItem ? cartItem.quantity : 0;
    });
}

// Actualizar todas las cantidades en la vista del catálogo
export function updateAllProductQuantitiesInView() {
    localCart.forEach(cartItem => {
        updateProductQuantityInView(cartItem.id);
    });
}

// Actualizar la UI del carrito
export function updateCartUI(productsData) {
    if (!productsData || productsData.length === 0) {
        console.error("Los datos del producto no están disponibles.");
        return;
    }

    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    cartContainer.innerHTML = "";
    if (localCart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío</p>";
        totalPriceElement.textContent = "$0";
        return;
    }

    let totalPrice = 0;
    localCart.forEach(cartItem => {
        const product = productsData.find(p => p.id === cartItem.id);
        if (product) {
            const cartItemElement = document.createElement("li");
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px;">
                ${product.name} - $${product.price} x ${cartItem.quantity}
                <div class="quantity-controls">
                    <button class="less-to-cart" data-id="${product.id}">-</button>
                    <span class="product-quantity" data-id="${product.id}">${cartItem.quantity}</span>
                    <button class="add-to-cart" data-id="${product.id}">+</button>
                    <button class="remove-from-cart" data-id="${product.id}">Eliminar</button>
                </div>
            `;
            totalPrice += product.price * cartItem.quantity;
            cartContainer.appendChild(cartItemElement);
        }
    });

    totalPriceElement.textContent = `$${totalPrice}`;

    attachCartEventListeners(productsData);
}

// Asignar eventos a los botones del carrito
function attachCartEventListeners(productsData) {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.removeEventListener('click', handleAddToCart); // Eliminar evento anterior
        button.addEventListener('click', handleAddToCart);
    });

    document.querySelectorAll('.less-to-cart').forEach(button => {
        button.removeEventListener('click', handleLessToCart); // Eliminar evento anterior
        button.addEventListener('click', handleLessToCart);
    });

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.removeEventListener('click', handleRemoveFromCart); // Eliminar evento anterior
        button.addEventListener('click', handleRemoveFromCart);
    });

    // Funciones de manejo de eventos para evitar duplicación
    function handleAddToCart(event) {
        const productId = event.target.getAttribute('data-id');
        addToCart(productId, productsData);
    }

    function handleLessToCart(event) {
        const productId = event.target.getAttribute('data-id');
        lessToCart(productId, productsData);
    }

    function handleRemoveFromCart(event) {
        const productId = event.target.getAttribute('data-id');
        localCart = localCart.filter(item => item.id !== productId);
        saveCartToLocalStorage();
        updateCartUI(productsData);
    }
}
