import { renderSections } from './type.js';
import { loadCart } from './cart.js';
import { renderPromos } from './promos.js';
import { createHeroSection } from './hero.js';

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById("app");

    if (!appElement) {
        console.error("No se encontró el contenedor 'app' en el DOM.");
        return;
    }

    // Cargar carrito desde localStorage
    loadCart();

    // Cargar datos de productos desde el archivo JSON
    fetch("../db/productData.json")
        .then(response => response.json())
        .then(data => {
            console.log("Datos de productos cargados:", data);
            renderSections(data);
            renderPromos(data);
        })
        .catch(error => {
            console.error("Error al cargar los productos: ", error);
        });

    // Cargar datos del cliente y renderizar la sección hero
    fetch("../db/clientData.json")
        .then(response => response.json())
        .then(clientData => {
            console.log("Datos del cliente cargados:", clientData);
            createHeroSection(clientData); // Crear la sección hero con los datos del cliente
        })
        .catch(error => {
            console.error("Error al cargar los datos del cliente: ", error);
        });
});
