import { addToCart, lessToCart } from '../../cart/cart.js';

const PRODUCTS_PER_PAGE = 6; // Número de productos a cargar por clic
let currentProductPage = 1;

// Cargar los datos de productos desde el archivo JSON
fetch("../db/productData.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo de productos");
    }
    return response.json();
  })
  .then((data) => {
    const productos = data;
    const tags = new Set();
    const productosContainer = document.getElementById("productos-container");
    const filtersContainer = document.getElementById("filters-container");
    const verTodosButton = document.getElementById("ver-todos");
    const searchInput = document.getElementById("search");
    const btnfilterprice = document.getElementById("ver-price-filters");
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    const filterPriceButton = document.getElementById("filter-price");
    const verMasButton = document.getElementById("ver-mas-productos");

    // Recopilar todos los tags únicos
    productos.forEach((producto) => {
      producto.tag.forEach((tag) => tags.add(tag));
    });

    // Crear botones de filtro para cada tag único
    tags.forEach((tag) => {
      const button = document.createElement("button");
      button.textContent = tag;
      button.addEventListener("click", () => {
        setActiveButton(button);
        currentProductPage = 1;
        filtrarProductosPorTag(tag, productos, productosContainer);
      });
      filtersContainer.appendChild(button);
    });

    // Evento para mostrar todos los productos
    verTodosButton.addEventListener("click", () => {
      setActiveButton(verTodosButton);
      currentProductPage = 1;
      mostrarTodos(productos, productosContainer);
    });

    // Evento para buscar productos por nombre
    searchInput.addEventListener("input", () => {
      const sanitizedValue = sanitizeInput(searchInput.value);
      currentProductPage = 1;
      filtrarProductosPorNombre(sanitizedValue, productos, productosContainer);
    });

    // Evento para mostrar/ocultar filtros de precio
    btnfilterprice.addEventListener("click", () => {
      togglePriceFilters();
    });

    // Evento para filtrar productos por precio
    filterPriceButton.addEventListener("click", () => {
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
      currentProductPage = 1;
      filtrarProductosPorPrecio(minPrice, maxPrice, productos, productosContainer);
    });

    // Evento para cargar más productos
    verMasButton.addEventListener("click", () => {
      currentProductPage++;
      mostrarMasProductos(productos, productosContainer);
    });

    // Mostrar los primeros productos inicialmente
    mostrarTodos(productos, productosContainer);
  })
  .catch((error) => {
    console.log("Error al cargar productos:", error);
  });

// Función para mostrar todos los productos
function mostrarTodos(productos, container) {
  container.innerHTML = "";
  mostrarMasProductos(productos, container);
}

// Función para mostrar más productos
function mostrarMasProductos(productos, container) {
  const start = (currentProductPage - 1) * PRODUCTS_PER_PAGE;
  const end = currentProductPage * PRODUCTS_PER_PAGE;
  const productosFiltrados = productos.slice(start, end);

  productosFiltrados.forEach((producto) => {
    container.appendChild(crearProductoItem(producto));
  });

  const verMasButton = document.getElementById("ver-mas-productos");
  if (end >= productos.length) {
    verMasButton.style.display = "none";
  } else {
    verMasButton.style.display = "block";
  }
}

// Función para filtrar productos por tag
function filtrarProductosPorTag(tag, productos, container) {
  container.innerHTML = "";
  const productosFiltrados = productos.filter((producto) => producto.tag.includes(tag));
  mostrarMasProductos(productosFiltrados, container);
}

// Función para filtrar productos por nombre
function filtrarProductosPorNombre(nombre, productos, container) {
  container.innerHTML = "";
  const productosFiltrados = productos.filter((producto) => producto.name.toLowerCase().includes(nombre.toLowerCase()));
  mostrarMasProductos(productosFiltrados, container);
}

// Función para filtrar productos por precio
function filtrarProductosPorPrecio(minPrice, maxPrice, productos, container) {
  container.innerHTML = "";
  const productosFiltrados = productos.filter((producto) => producto.price >= minPrice && producto.price <= maxPrice);
  mostrarMasProductos(productosFiltrados, container);
}

// Función para crear un elemento de producto
function crearProductoItem(producto) {
  const li = document.createElement("li");
  li.innerHTML = `
    <img src="${producto.image}" alt="${producto.name}">
    <h3>${producto.name}</h3>
    <p>${producto.description}</p>
    <span>$${producto.price}</span>
    <div class="quantity-controls">
      <button class="less-to-cart" data-id="${producto.id}">-</button>
      <button class="add-to-cart" data-product='${JSON.stringify(producto)}' data-id="${producto.id}">+</button>
    </div>
  `;
  return li;
}

// Función para establecer el botón activo
function setActiveButton(button) {
  const buttons = document.querySelectorAll("#filtros button");
  buttons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
}

// Función para mostrar/ocultar filtros de precio
function togglePriceFilters() {
  const divfilterPrice = document.getElementById("price-filters");
  divfilterPrice.classList.toggle("show");
}

// Función para sanitizar la entrada del usuario
function sanitizeInput(input) {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerHTML;
}

// Delegación de eventos para los botones "+" y "-"
document.getElementById('productos-container').addEventListener('click', function(event) {
  const productId = event.target.getAttribute('data-id');
  console.log('Button clicked with product id:', productId);
  if (event.target.classList.contains('add-to-cart')) {
    const product = JSON.parse(event.target.getAttribute('data-product'));
    console.log('Add to cart product:', product);
    addToCart(product);
  } else if (event.target.classList.contains('less-to-cart')) {
    console.log('Less to cart product id:', productId);
    lessToCart(productId);
  }
});
