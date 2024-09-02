import "./src/js/header.js";
import { createHeroSection } from "./src/js/hero.js";
import { initCarrito } from "./src/js/cart.js";
import { generarSecciones } from "./src/js/product.js";
import { renderPromos } from "./src/js/promos.js";

// Función para cargar un archivo JSON desde una ruta específica
async function cargarJSON(url) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(
        `Error al cargar el archivo ${url}: ${respuesta.statusText}`
      );
    }
    const data = await respuesta.json();
    console.log(`Datos cargados desde ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`Error al cargar el archivo ${url}:`, error);
  }
}

async function initApp() {
  console.log("Inicializando la aplicación...");

  const datosEmpresa = await cargarJSON("./db/clientData.json");
  const productos = await cargarJSON("./db/productData.json");

  if (datosEmpresa) {
    const appContainer = document.getElementById("app");

    if (appContainer) {
      // Crear contenedor para el hero y renderizarlo primero
      const heroContainer = document.createElement("section");
      heroContainer.id = "hero";
      appContainer.appendChild(heroContainer);

      createHeroSection(datosEmpresa, heroContainer);
      console.log("Hero renderizado");

      renderPromos(productos);
      console.log("Promos renderizadas");

      generarSecciones(productos);
      console.log("Secciones renderizadas");
    
        
    initCarrito();
    console.log("Carrito inicializado");
      
      console.log("Aplicación lista");
    }
  }else{
    console.error("Error en appContainer");
  }
}

initApp();
