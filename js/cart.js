export let localCart = [];

// Cargar el carrito desde localStorage y actualizar la UI
export function loadCart(productsArray) {
    const storedCart = localStorage.getItem("localCart");
    if (storedCart) {
        localCart = JSON.parse(storedCart);
        console.log("Carrito cargado desde localStorage:", localCart);
    }
    updateCartUI(productsArray); // Actualizar la UI del carrito
    updateAllProductQuantitiesInView(); // Actualizar las cantidades de productos en las tarjetas
}

// Guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("localCart", JSON.stringify(localCart));
    console.log("Carrito guardado en localStorage:", localCart);
}

// Agregar producto al carrito
export function addToCart(productId, productsData) {
    console.log(`Producto agregado al carrito: ${productId}`);
    const cartItem = localCart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
        console.log(`Cantidad incrementada para producto ID: ${productId}`);
    } else {
        const product = productsData.find(p => p.id === productId);
        localCart.push({ id: productId, quantity: 1, name: product.name });
        console.log(`Producto añadido al carrito: ${product.name}`);
    }

    saveCartToLocalStorage();
    updateProductQuantityInView(productId);
    updateCartUI(productsData);
}

// Quitar producto del carrito
export function lessToCart(productId, productsData) {
    console.log(`Botón - clickeado para producto ID: ${productId}`);
    const cartItem = localCart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            localCart = localCart.filter(item => item.id !== productId);
            console.log(`Producto con ID ${productId} eliminado del carrito.`);
        } else {
            console.log(`Cantidad reducida para producto ID: ${productId}`);
        }

        saveCartToLocalStorage();
        updateProductQuantityInView(productId);
        updateCartUI(productsData);
    }
}

// Eliminar producto completamente del carrito
export function removeFromCart(productId, productsData) {
    console.log(`Botón Eliminar clickeado para producto ID: ${productId}`);
    localCart = localCart.filter(item => item.id !== productId);

    saveCartToLocalStorage();
    updateProductQuantityInView(productId);
    updateCartUI(productsData);
}

// Actualizar cantidad en la vista de productos
export function updateProductQuantityInView(productId) {
    const cartItem = localCart.find(item => item.id === productId);
    const quantitySpans = document.querySelectorAll(`.product-quantity[data-id="${productId}"]`);

    quantitySpans.forEach(span => {
        span.textContent = cartItem ? cartItem.quantity : 0;
    });
}

// Actualizar todas las cantidades en la vista de los productos
export function updateAllProductQuantitiesInView() {
    localCart.forEach(cartItem => {
        updateProductQuantityInView(cartItem.id);
    });
}

// Actualizar la UI del carrito
export function updateCartUI(productsData) {
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
        const product = productsData.find(p => p.id == cartItem.id);
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
    attachCartEventListeners(productsData);  // Delegación de eventos
}

// Delegación de eventos en el carrito
function attachCartEventListeners(productsData) {
    const cartContainer = document.getElementById("cart-items");

    // Eliminar los eventos anteriores antes de agregar nuevos
    cartContainer.replaceWith(cartContainer.cloneNode(true));
    const newCartContainer = document.getElementById("cart-items");

    newCartContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.getAttribute('data-id');

        if (target.classList.contains('add-to-cart')) {
            console.log(`Botón + clickeado en carrito para producto ID: ${productId}`);
            addToCart(productId, productsData);
        } else if (target.classList.contains('less-to-cart')) {
            console.log(`Botón - clickeado en carrito para producto ID: ${productId}`);
            lessToCart(productId, productsData);
        } else if (target.classList.contains('remove-from-cart')) {
            console.log(`Botón Eliminar clickeado en carrito para producto ID: ${productId}`);
            removeFromCart(productId, productsData);
        }
    });
}
