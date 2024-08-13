let cart = [];

// Agregar productos al carrito
export function addToCart(product) {
    const productInCart = cart.find(item => item.id === product.id);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartDisplay();
    saveCart();
}

// Eliminar productos del carrito
export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

// Quitar 1 del carrito
export function lessToCart(productId) {
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        if (productInCart.quantity > 1) {
            productInCart.quantity -= 1;
        } else {
            removeFromCart(productId);
            return; // Salida temprana para evitar más procesamiento
        }
    }
    updateCartDisplay();
    saveCart();
}

// Actualizar la interfaz del carrito
function updateCartDisplay() {
    const cartItemContainer = document.getElementById('cart-item');
    if (!cartItemContainer) {
        console.error('Elemento con id "cart-item" no encontrado.');
        return;
    }

    let cartItemsHTML = '';
    cart.forEach(item => {
        cartItemsHTML += `
            <li>
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                ${item.name} - $${item.price} x ${item.quantity}
                <div class="quantity-controls">
                    <button class="add-to-cart" data-id="${item.id}">+</button>
                    <button class="less-to-cart" data-id="${item.id}">-</button>
                    <button class="remove-from-cart" data-id="${item.id}"><img class="icon" src="./assets/cart/trash-can-solid.svg" alt=""></button>
                </div>
            </li>
        `;
    });
    cartItemContainer.innerHTML = cartItemsHTML;

    const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalCostElement = document.getElementById('total-cost');
    if (totalCostElement) {
        totalCostElement.textContent = `Total: $${totalCost}`;
    }
}

// Guardar el carrito en el almacenamiento local
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar el carrito desde el almacenamiento local
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
}

// Definir la función switchSection
function switchSection(button, section) {
    document.querySelectorAll('.cart-header button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.cart-cont section').forEach(sec => sec.classList.remove('active'));
    section.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.querySelector('.btn-cart');
    const cartCont = document.querySelector('.cart-cont');
    const showCartBtn = document.getElementById('show-cart');
    const cartItemsSection = document.querySelector('.cart-items');

    // Controlar el estado del carrito
    function toggleCart() {
        cartCont.style.display = cartCont.style.display === 'flex' ? 'none' : 'flex';
    }

    // Mostrar/ocultar el carrito
    cartBtn.addEventListener('click', toggleCart);

    // Mostrar/ocultar secciones del carrito
    showCartBtn.addEventListener('click', () => {
        switchSection(showCartBtn, cartItemsSection);
    });

    loadCart();

    // Delegación de eventos para los botones dentro del carrito
    document.getElementById('cart-item').addEventListener('click', function(event) {
        const productId = event.target.getAttribute('data-id');
        
        if (productId) {
            if (event.target.classList.contains('add-to-cart')) {
                const product = cart.find(item => item.id === productId);
                if (product) {
                    addToCart(product);
                }
            } else if (event.target.classList.contains('less-to-cart')) {
                lessToCart(productId);
            } else if (event.target.classList.contains('remove-from-cart')) {
                removeFromCart(productId);
            }
        } else {
            console.error('Error: ID de producto no válido.', event.target);
        }
    });
});
