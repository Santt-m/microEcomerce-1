import { initializeShop } from './shop.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [productResponse, clientResponse] = await Promise.all([
            fetch("../db/productData.json"),
            fetch("../db/clientData.json")
        ]);

        const products = await productResponse.json();
        const clientData = await clientResponse.json();

        console.log("Productos cargados:", products);
        console.log("Datos del cliente cargados:", clientData);

        // Inicializar la tienda con los productos cargados
        initializeShop(products);

    } catch (error) {
        console.error("Error al cargar los datos: ", error);
    }
});
