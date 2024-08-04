// Cargar los datos de productos desde el archivo JSON
fetch('../db/productData.json')
    .then(response => response.json())
    .then(data => {
        const productos = data;
        const tags = new Set();
        const productosContainer = document.getElementById('productos-container');
        const filtersContainer = document.getElementById('filters-container');

        // Recopilar todos los tags únicos
        productos.forEach(producto => {
            producto.tag.forEach(tag => tags.add(tag));
        });

        // Crear botones de filtro para cada tag único
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.textContent = tag;
            button.addEventListener('click', () => filtrarProductos(tag, productos, productosContainer));
            filtersContainer.appendChild(button);
        });

        // Evento para mostrar todos los productos
        document.getElementById('ver-todos').addEventListener('click', () => mostrarTodos(productos, productosContainer));

        // Mostrar todos los productos inicialmente
        mostrarTodos(productos, productosContainer);
    });

// Función para mostrar todos los productos
function mostrarTodos(productos, container) {
    container.innerHTML = '';
    productos.forEach(producto => {
        container.appendChild(crearProductoItem(producto));
    });
}

// Función para filtrar productos por tag
function filtrarProductos(tag, productos, container) {
    container.innerHTML = '';
    const productosFiltrados = productos.filter(producto => producto.tag.includes(tag));
    productosFiltrados.forEach(producto => {
        container.appendChild(crearProductoItem(producto));
    });
}

// Función para crear un elemento de producto
function crearProductoItem(producto) {
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}">
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <span>$${producto.price}</span>
    `;
    return li;
}
