import { createHeroSection } from './src/js/hero.js';
import './src/js/header.js';


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
    const datosEmpresa = await cargarJSON('./db/clientData.json');
    
    if (datosEmpresa) {
        const appContainer = document.getElementById('app'); // Nos aseguramos de que todo se genere aquí
        if (appContainer) {
            createHeroSection(datosEmpresa, appContainer);
        } else {
            console.error("No se encontró el elemento 'app' en el DOM.");
        }
    } else {
        console.error("No se pudieron cargar los datos de la empresa.");
    }
}

// Inicializar la aplicación cuando el contenido del DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
