let localCart = [];

// Cargar el carrito desde localStorage al inicializar
export function loadCart() {
    const storedCart = localStorage.getItem("localCart");
    if (storedCart) {
        localCart = JSON.parse(storedCart);
        console.log("Carrito cargado desde localStorage:", localCart);
    }
    updateCartUI(); // Actualiza la visualización del carrito al cargar
}

// Guardar el carrito en localStorage
function saveCartToLocalStorage() {
    console.log("Guardando carrito en localStorage:", localCart);
    localStorage.setItem("localCart", JSON.stringify(localCart));
}

// Añadir producto al carrito
export function addToCart(product) {
    console.log("Añadiendo producto al carrito:", product);
    const existingProduct = localCart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1; // Incrementar cantidad si el producto ya está en el carrito
        console.log("Producto existente, incrementando cantidad:", existingProduct);
    } else {
        product.quantity = 1; // Agregar nuevo producto con cantidad 1
        localCart.push(product);
        console.log("Producto nuevo añadido al carrito:", product);
    }

    saveCartToLocalStorage();
    updateCartUI();
}

// Eliminar producto del carrito
export function removeFromCart(productId) {
    console.log("Eliminando producto del carrito, ID:", productId);
    const productIndex = localCart.findIndex(item => item.id == productId);
    
    if (productIndex !== -1) {
        console.log("Producto encontrado, eliminando:", localCart[productIndex]);
        localCart.splice(productIndex, 1); // Eliminar producto del carrito
        saveCartToLocalStorage();
        updateCartUI();
    } else {
        console.log("Producto no encontrado en el carrito.");
    }
}

// Disminuir cantidad del producto en el carrito
export function lessToCart(productId) {
    console.log("Disminuyendo cantidad del producto, ID:", productId);
    const existingProduct = localCart.find(item => item.id === productId);

    if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        console.log("Cantidad disminuida, producto actualizado:", existingProduct);
    } else if (existingProduct) {
        removeFromCart(productId); // Si la cantidad es 1, eliminar el producto del carrito
    }

    saveCartToLocalStorage();
    updateCartUI();
}

// Actualizar la UI del carrito
export function updateCartUI() {
    console.log("Actualizando la UI del carrito con los datos:", localCart);
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartContainer || !totalPriceElement) {
        console.error("No se encontró el contenedor del carrito o del precio total en el DOM.");
        return;
    }

    cartContainer.innerHTML = ""; // Limpiar contenido

    if (localCart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío</p>";
        totalPriceElement.textContent = "$0";
        return;
    }

    let totalPrice = 0;

    localCart.forEach(item => {
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
            ${item.name} - $${item.price} x ${item.quantity}
            <div class="quantity-controls">
                <button class="less-to-cart" data-id="${item.id}">-</button>
                <button class="add-to-cart" data-id="${item.id}">+</button>
                <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
            </div>
        `;

        totalPrice += item.price * item.quantity;
        cartContainer.appendChild(cartItem);
    });

    totalPriceElement.textContent = `$${totalPrice}`;
    console.log("UI del carrito actualizada, precio total:", totalPrice);
}

// Delegación de eventos para manejar botones del carrito
document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('add-to-cart')) {
        const productId = target.getAttribute('data-id');
        console.log(`Botón '+' clicado, ID del producto: ${productId}`);
        const product = localCart.find(item => item.id == productId);
        if (product) {
            console.log(`Producto encontrado en el carrito: ${product.name}`);
            addToCart(product);
        }
        updateCartUI(); 
    } else if (target.classList.contains('less-to-cart')) {
        const productId = target.getAttribute('data-id');
        console.log(`Botón '-' clicado, ID del producto: ${productId}`);
        lessToCart(productId);
        updateCartUI(); 
    } else if (target.classList.contains('remove-from-cart')) {
        const productId = target.getAttribute('data-id');
        console.log(`Botón 'Eliminar' clicado, ID del producto: ${productId}`);
        removeFromCart(productId);
    }
});
