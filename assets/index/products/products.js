import { addToCart, lessToCart } from '../../cart/cart.js';

const PRODUCTS_PER_PAGE = 6; 
let currentProductPage = 1;

fetch("../db/productData.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(product => {
      product.id = `prod-${product.id}`;
    });

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

    productos.forEach(producto => {
      producto.tag.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
      const button = document.createElement("button");
      button.textContent = tag;
      button.addEventListener("click", () => {
        setActiveButton(button);
        currentProductPage = 1;
        filtrarProductosPorTag(tag, productos, productosContainer);
      });
      filtersContainer.appendChild(button);
    });

    verTodosButton.addEventListener("click", () => {
      setActiveButton(verTodosButton);
      currentProductPage = 1;
      mostrarTodos(productos, productosContainer);
    });

    searchInput.addEventListener("input", () => {
      const sanitizedValue = sanitizeInput(searchInput.value);
      currentProductPage = 1;
      filtrarProductosPorNombre(sanitizedValue, productos, productosContainer);
    });

    btnfilterprice.addEventListener("click", () => {
      togglePriceFilters();
    });

    filterPriceButton.addEventListener("click", () => {
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
      currentProductPage = 1;
      filtrarProductosPorPrecio(minPrice, maxPrice, productos, productosContainer);
    });

    verMasButton.addEventListener("click", () => {
      currentProductPage++;
      mostrarMasProductos(productos, productosContainer);
    });

    mostrarTodos(productos, productosContainer);
  })
  .catch(error => {
    console.log("Error al cargar productos:", error);
  });

function mostrarTodos(productos, container) {
  container.innerHTML = "";
  mostrarMasProductos(productos, container);
}

function mostrarMasProductos(productos, container) {
  const start = (currentProductPage - 1) * PRODUCTS_PER_PAGE;
  const end = currentProductPage * PRODUCTS_PER_PAGE;
  const productosFiltrados = productos.slice(start, end);

  productosFiltrados.forEach(producto => {
    container.appendChild(crearProductoItem(producto));
  });

  const verMasButton = document.getElementById("ver-mas-productos");
  if (end >= productos.length) {
    verMasButton.style.display = "none";
  } else {
    verMasButton.style.display = "block";
  }
}

function filtrarProductosPorTag(tag, productos, container) {
  container.innerHTML = "";
  const productosFiltrados = productos.filter(producto => producto.tag.includes(tag));
  mostrarMasProductos(productosFiltrados, container);
}

function filtrarProductosPorNombre(nombre, productos, container) {
  container.innerHTML = "";
  const productosFiltrados = productos.filter(producto => producto.name.toLowerCase().includes(nombre.toLowerCase()));
  mostrarMasProductos(productosFiltrados, container);
}

function filtrarProductosPorPrecio(minPrice, maxPrice, productos, container) {
  container.innerHTML = "";
  const productosFiltrados = productos.filter(producto => producto.price >= minPrice && producto.price <= maxPrice);
  mostrarMasProductos(productosFiltrados, container);
}

function crearProductoItem(producto) {
  const li = document.createElement("li");
  li.innerHTML = `
    <h3>${producto.name}</h3>
    <img src="${producto.image}" alt="${producto.name}">
    <p>${producto.description}</p>
    <span>$${producto.price}</span>
    <div class="quantity-controls">
      <button class="less-to-cart" data-id="${producto.id}">-</button>
      <button class="add-to-cart" data-product='${JSON.stringify(producto)}'>+</button>
    </div>
  `;
  return li;
}

function setActiveButton(button) {
  const buttons = document.querySelectorAll("#filtros button");
  buttons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

function togglePriceFilters() {
  const divfilterPrice = document.getElementById("price-filters");
  divfilterPrice.classList.toggle("show");
}

function sanitizeInput(input) {
  const element = document.createElement("div");
  element.innerText = input;
  return element.innerHTML;
}

document.getElementById('productos-container').addEventListener('click', function(event) {
  if (event.target.classList.contains('add-to-cart')) {
    const product = JSON.parse(event.target.getAttribute('data-product'));
    addToCart(product);
  } else if (event.target.classList.contains('less-to-cart')) {
    const productId = event.target.getAttribute('data-id');
    lessToCart(productId);
  }
});
