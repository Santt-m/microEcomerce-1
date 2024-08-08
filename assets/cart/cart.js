let cart = [];

// Agregar productos al carrito
export function addToCart(product) {
    console.log('Agregando producto al carrito:', product);
    const productInCart = cart.find(item => item.id === product.id);
    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    console.log('Carrito después de agregar producto:', cart);
    updateCartDisplay();
    saveCart();
}

// Eliminar productos del carrito
export function removeFromCart(productId) {
    console.log('Eliminando producto del carrito:', productId);
    cart = cart.filter(item => item.id !== productId);
    console.log('Carrito después de eliminación:', cart);
    updateCartDisplay();
    saveCart();
}

// Quitar 1 del carrito
export function lessToCart(productId) {
    console.log('Reduciendo cantidad de producto en el carrito:', productId);
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        if (productInCart.quantity > 1) {
            productInCart.quantity -= 1;
            console.log('Cantidad de producto reducida:', productInCart);
        } else {
            console.log('Eliminando producto del carrito porque la cantidad es 1:', productId);
            cart = cart.filter(item => item.id !== productId); // Filtra directamente el producto
        }
    }
    console.log('Carrito después de reducir cantidad:', cart);
    updateCartDisplay();
    saveCart();
}

// Actualizar la interfaz del carrito
function updateCartDisplay() {
    console.log('Actualizando la visualización del carrito con:', cart);
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
                    <button class="add-to-cart" data-id="${item.id}">+1</button>
                    <button class="less-to-cart" data-id="${item.id}">-1</button>
                    <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
                </div>
            </li>
        `;
    });
    cartItemContainer.innerHTML = cartItemsHTML;
    console.log('HTML del carrito actualizado:', cartItemsHTML);

    const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalCostElement = document.getElementById('total-cost');
    if (totalCostElement) {
        totalCostElement.textContent = `Total: $${totalCost}`;
    }
}

// Guardar el carrito en el almacenamiento local
function saveCart() {
    console.log('Guardando carrito en localStorage:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar el carrito desde el almacenamiento local
function loadCart() {
    console.log('Cargando carrito desde localStorage');
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        console.log('Carrito cargado desde localStorage:', cart);
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
        const productId = parseInt(event.target.getAttribute('data-id'));
        if (event.target.classList.contains('add-to-cart')) {
            console.log('Botón + clicado para el producto con id:', productId);
            const product = cart.find(item => item.id === productId);
            if (product) {
                addToCart(product);
            }
        } else if (event.target.classList.contains('less-to-cart')) {
            console.log('Botón - clicado para el producto con id:', productId);
            lessToCart(productId);
        } else if (event.target.classList.contains('remove-from-cart')) {
            console.log('Botón eliminar clicado para el producto con id:', productId);
            removeFromCart(productId);
        }
    });
});
