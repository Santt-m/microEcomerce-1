    const navButton = document.querySelector('.btn-nav');
    const cartButton = document.querySelector('.btn-cart');
    const navMenu = document.querySelector('nav');
    const cartMenu = document.getElementById('cart');

    // Toggle navigation menu and animate the bars
    navButton.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.add('closing');
            setTimeout(() => {
                navMenu.classList.remove('active', 'closing');
            }, 500); // El tiempo debe coincidir con la duración de la animación
        } else {
            navMenu.classList.add('active');
            cartMenu.classList.remove('active', 'closing'); // Asegura que el carrito esté cerrado
        }
        navButton.classList.toggle('active');
    });

    // Toggle cart menu
    cartButton.addEventListener('click', () => {
        if (cartMenu.classList.contains('active')) {
            cartMenu.classList.add('closing');
            setTimeout(() => {
                cartMenu.classList.remove('active', 'closing');
            }, 500);
        } else {
            cartMenu.classList.add('active');
            navMenu.classList.remove('active', 'closing'); // Asegura que el nav esté cerrado
            navButton.classList.remove('active');
        }
    });