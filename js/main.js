import { renderSections } from './type.js';
import { loadCart } from './cart.js';
import { renderPromos } from './promos.js';
import { createHeroSection } from './hero.js';

document.addEventListener('DOMContentLoaded', async () => {
    const appElement = document.getElementById("app");

    if (!appElement) {
        console.error("No se encontró el contenedor 'app' en el DOM.");
        return;
    }

    try {
        const [productResponse, clientResponse] = await Promise.all([
            fetch("../db/productData.json"),
            fetch("../db/clientData.json")
        ]);

        const products = await productResponse.json();
        const clientData = await clientResponse.json();

        loadCart(products); // Cargar el carrito desde localStorage
        renderPromos(products);
        renderSections(products);
        createHeroSection(clientData);

    } catch (error) {
        console.error("Error al cargar los datos: ", error);
    }
});
