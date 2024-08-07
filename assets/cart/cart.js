document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.querySelector('.btn-cart');
    const cartCont = document.querySelector('.cart-cont');
    const showCartBtn = document.getElementById('show-cart');
    const cartItemsSection = document.querySelector('.cart-items');

    let carrito = [];

    cartBtn.addEventListener('click', () => {
        if (cartCont.style.display === 'flex') {
            cartCont.style.display = 'none';
        } else {
            cartCont.style.display = 'flex';
        }
    });

    showCartBtn.addEventListener('click', () => {
        switchSection(showCartBtn, cartItemsSection);
    });

    function addToCart(product) {
        const productInCart = carrito.find(item => item.id === product.id);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            carrito.push({ ...product, quantity: 1 });
        }
        updateCartDisplay();
        saveCart();
    }

    function removeFromCart(productId) {
        carrito = carrito.filter(item => item.id !== productId);
        updateCartDisplay();
        saveCart();
    }

    function updateCartDisplay() {
        const cartItemContainer = document.getElementById('cart-item');
        cartItemContainer.innerHTML = '';

        carrito.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Eliminar';
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
            li.appendChild(removeBtn);
            cartItemContainer.appendChild(li);
        });

        const totalCost = carrito.reduce((total, item) => total + item.price * item.quantity, 0);
        document.getElementById('total-cost').textContent = `Total: $${totalCost}`;
    }

    function saveCart() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function loadCart() {
        const storedCart = localStorage.getItem('carrito');
        if (storedCart) {
            carrito = JSON.parse(storedCart);
            updateCartDisplay();
        }
    }

    function switchSection(button, section) {
        document.querySelectorAll('.cart-header button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.querySelectorAll('.cart-cont section').forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
    }

    loadCart();
});
