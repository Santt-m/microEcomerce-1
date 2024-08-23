document.addEventListener('DOMContentLoaded', () => {
    const navButton = document.querySelector('.btn-nav');
    const cartButton = document.querySelector('.btn-cart');
    const navMenu = document.querySelector('nav');
    const cartMenu = document.getElementById('cart');

    // Toggle navigation menu
    navButton.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        cartMenu.style.display = 'none'; // Ocultar carrito si está abierto
    });

    // Toggle cart menu
    cartButton.addEventListener('click', () => {
        cartMenu.style.display = cartMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.display = 'none'; // Ocultar menú de navegación si está abierto
    });

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navButton.contains(e.target)) {
            navMenu.style.display = 'none';
        }
        if (!cartMenu.contains(e.target) && !cartButton.contains(e.target)) {
            cartMenu.style.display = 'none';
        }
    });

    document.querySelector('.btn-nav').addEventListener('click', function() {
        this.classList.toggle('active');
    });
    
});
