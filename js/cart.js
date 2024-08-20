export let localCart = [];

// Cargar el carrito desde localStorage al inicializar
export function loadCart() {
    const storedCart = localStorage.getItem("localCart");
    if (storedCart) {
        localCart = JSON.parse(storedCart);
        console.log("Carrito cargado desde localStorage:", localCart);
    } else {
        localCart = [];
    }
    updateCartUI();
}

// Guardar el carrito en localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("localCart", JSON.stringify(localCart));
}

// Añadir producto al carrito
export function addToCart(product) {
    if (!product || !product.id) {
        console.error("Producto inválido: ", product);
        return;
    }

    const existingProduct = localCart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        localCart.push(product);
    }

    saveCartToLocalStorage();
    updateCartUI();
}

// Disminuir cantidad del producto en el carrito
export function lessToCart(productId) {
    if (!productId) {
        console.error("ID de producto inválido: ", productId);
        return;
    }

    const existingProduct = localCart.find(item => item.id === productId);

    if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
    } else if (existingProduct) {
        removeFromCart(productId);
    }

    saveCartToLocalStorage();
    updateCartUI();
}

// Eliminar producto del carrito
export function removeFromCart(productId) {
    if (!productId) {
        console.error("ID de producto inválido: ", productId);
        return;
    }

    const productIndex = localCart.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        localCart.splice(productIndex, 1);
        saveCartToLocalStorage();
        updateCartUI();
    } else {
        console.log("Producto no encontrado en el carrito.");
    }
}

// Actualizar la UI del carrito
export function updateCartUI() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartContainer || !totalPriceElement) {
        return;
    }

    cartContainer.innerHTML = "";

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
}

// Delegación de eventos para manejar botones del carrito
document.addEventListener('click', function(event) {
    const target = event.target;

    if (target.classList.contains('add-to-cart')) {
        const productId = target.getAttribute('data-id');
        const product = localCart.find(item => item.id == productId);
        if (product) {
            addToCart(product);
        }
        updateCartUI(); 
    } else if (target.classList.contains('less-to-cart')) {
        const productId = target.getAttribute('data-id');
        lessToCart(productId);
        updateCartUI(); 
    } else if (target.classList.contains('remove-from-cart')) {
        const productId = target.getAttribute('data-id');
        removeFromCart(productId);
    }
});
