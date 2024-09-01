import { createHeroSection } from './src/js/hero.js';
import './src/js/header.js';
import { initCarrito } from './src/js/cart.js';
import { generarSecciones } from './src/js/product.js'; // Importamos la función para generar las secciones

// Función para cargar un archivo JSON desde una ruta específica
async function cargarJSON(url) {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error al cargar el archivo ${url}: ${respuesta.statusText}`);
        }
        const data = await respuesta.json();
        console.log(`Datos cargados desde ${url}:`, data);
        return data;
    } catch (error) {
        console.error(`Error al cargar el archivo ${url}:`, error);
    }
}

// Función principal que carga los datos de la empresa y los pasa al módulo hero.js
async function initApp() {
    console.log("Inicializando la aplicación...");

    const datosEmpresa = await cargarJSON('./db/clientData.json');
    const productos = await cargarJSON('./db/productData.json'); // Cargar también los productos

    if (datosEmpresa) {
        const appContainer = document.getElementById('app');

        if (appContainer) {
            // Crear contenedor para el hero y renderizarlo primero
            const heroContainer = document.createElement('div');
            heroContainer.id = 'hero-container';
            appContainer.appendChild(heroContainer);

            // Crear contenedor para los productos
            const productContainer = document.createElement('div');
            productContainer.id = 'product-container';
            appContainer.appendChild(productContainer);

            // Renderizar la sección hero
            createHeroSection(datosEmpresa, heroContainer);

            // Renderizar las secciones de productos debajo del hero
            if (productos) {
                console.log("Generando las secciones de productos...");
                generarSecciones(productos, productContainer); // Pasar el contenedor de productos
            } else {
                console.error("No se pudieron cargar los productos.");
            }
        } else {
            console.error("No se encontró el elemento 'app' en el DOM.");
        }
    } else {
        console.error("No se pudieron cargar los datos de la empresa.");
    }
}


initApp();
initCarrito();
