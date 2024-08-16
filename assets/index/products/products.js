import { addToCart, lessToCart } from '../../cart/cart.js';

const PRODUCTS_PER_PAGE = 6; 
let currentProductPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  fetch("../db/productData.json")
    .then(response => response.json())
    .then(data => {
      const secciones = document.querySelectorAll("section");
      
      secciones.forEach(seccion => {
        const sectionType = seccion.id;
        const productos = data.filter(product => product.type === sectionType);
        
        if (productos.length > 0) {
          renderSection(seccion, productos, sectionType);
        }
      });

      setUpPriceFilterToggles(); // Activar funcionalidad de mostrar/ocultar filtros de precio
    })
    .catch(error => {
      console.error("Error al cargar los productos:", error);
    });
});

// Función para renderizar las secciones
function renderSection(seccion, productos, sectionType) {
  const filtrosContainer = document.createElement("div");
  filtrosContainer.classList.add("filtros");
  
  const verTodosButton = document.createElement("button");
  verTodosButton.textContent = "Ver Todos";
  filtrosContainer.appendChild(verTodosButton);

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Buscar productos...";
  filtrosContainer.appendChild(searchInput);

  const btnfilterprice = document.createElement("button");
  btnfilterprice.textContent = "Filtros de Precio";
  btnfilterprice.classList.add("ver-price-filters");
  filtrosContainer.appendChild(btnfilterprice);

  const priceFilters = document.createElement("div");
  priceFilters.classList.add("price-filters");

  const minPriceLabel = document.createElement("label");
  minPriceLabel.textContent = "Precio Mínimo: ";
  priceFilters.appendChild(minPriceLabel);

  const minPriceInput = document.createElement("input");
  minPriceInput.type = "number";
  minPriceInput.placeholder = "0";
  priceFilters.appendChild(minPriceInput);

  const maxPriceLabel = document.createElement("label");
  maxPriceLabel.textContent = "Precio Máximo: ";
  priceFilters.appendChild(maxPriceLabel);

  const maxPriceInput = document.createElement("input");
  maxPriceInput.type = "number";
  maxPriceInput.placeholder = "10000";
  priceFilters.appendChild(maxPriceInput);

  const filterPriceButton = document.createElement("button");
  filterPriceButton.textContent = "Filtrar por precio";
  priceFilters.appendChild(filterPriceButton);

  filtrosContainer.appendChild(priceFilters);
  seccion.appendChild(filtrosContainer);

  const productosContainer = document.createElement("ol");
  productosContainer.classList.add("productos-container");
  seccion.appendChild(productosContainer);

  const verMasButton = document.createElement("button");
  verMasButton.textContent = "Ver Más";
  verMasButton.classList.add("ver-mas-productos");
  verMasButton.style.display = "none";
  seccion.appendChild(verMasButton);

  let currentPage = 1;
  mostrarTodos(productos, productosContainer, verMasButton);

  verTodosButton.addEventListener("click", () => {
    currentPage = 1;
    mostrarTodos(productos, productosContainer, verMasButton);
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = sanitizeInput(searchInput.value);
    const productosFiltrados = productos.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    mostrarTodos(productosFiltrados, productosContainer, verMasButton);
  });

  filterPriceButton.addEventListener("click", () => {
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    const productosFiltrados = productos.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );
    mostrarTodos(productosFiltrados, productosContainer, verMasButton);
  });

  verMasButton.addEventListener("click", () => {
    currentPage++;
    mostrarMasProductos(productos, productosContainer, verMasButton, currentPage);
  });
}

// Función para mostrar todos los productos
function mostrarTodos(productos, container, verMasButton) {
  container.innerHTML = "";
  currentProductPage = 1;
  mostrarMasProductos(productos, container, verMasButton, currentProductPage);
}

// Función para mostrar más productos
function mostrarMasProductos(productos, container, verMasButton, page) {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = page * PRODUCTS_PER_PAGE;
  const productosFiltrados = productos.slice(start, end);

  productosFiltrados.forEach(producto => {
    container.appendChild(crearProductoItem(producto));
  });

  if (end >= productos.length) {
    verMasButton.style.display = "none";
  } else {
    verMasButton.style.display = "block";
  }
}

// Función para crear un producto
function crearProductoItem(producto) {
  const li = document.createElement("li");
  li.innerHTML = `
    <h3>${producto.name}</h3>
    <img src="${producto.image}" alt="${producto.name}">
    <p>${producto.description}</p>
    <span>$${producto.price}</span>
    <div class="quantity-controls">
      <button class="less-to-cart" data-id="${producto.id}">-</button>
      <span class="product-quantity" data-id="${producto.id}">0</span>
      <button class="add-to-cart" data-product='${JSON.stringify(producto)}'>+</button>
    </div>
  `;
  return li;
}

// Función para configurar los toggles de los filtros de precio
function setUpPriceFilterToggles() {
  const priceFilterButtons = document.querySelectorAll('.ver-price-filters');

  priceFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const priceFilters = button.nextElementSibling;
      
      if (priceFilters.classList.contains('show')) {
        priceFilters.classList.remove('show');
      } else {
        priceFilters.classList.add('show');
      }
    });
  });
}

function sanitizeInput(input) {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerHTML;
}

// Eventos de agregar y quitar productos del carrito
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-to-cart')) {
    const product = JSON.parse(event.target.getAttribute('data-product'));
    addToCart(product);
  } else if (event.target.classList.contains('less-to-cart')) {
    const productId = event.target.getAttribute('data-id');
    lessToCart(productId);
  }
});
