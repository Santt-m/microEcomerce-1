import { addToCart, lessToCart } from '../../cart/cart.js';

const BEBIDAS_PER_PAGE = 6;
let currentBebidaPage = 1;

fetch('../db/bebidasData.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(bebida => {
      bebida.id = `beb-${bebida.id}`;
    });

    const bebidas = data;
    const tags = new Set();
    const bebidasContainer = document.getElementById('bebidas-container');
    const filtersContainer = document.getElementById('filters-container-bebidas');
    const verTodosButton = document.getElementById('ver-todos-bebidas');
    const searchInput = document.getElementById('search-bebidas');
    const btnfilterprice = document.getElementById('ver-price-filters-bebidas');
    const minPriceInput = document.getElementById('min-price-bebidas');
    const maxPriceInput = document.getElementById('max-price-bebidas');
    const filterPriceButton = document.getElementById('filter-price-bebidas');
    const verMasButton = document.getElementById('ver-mas-bebidas');

    bebidas.forEach(bebida => {
      bebida.tag.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
      const button = document.createElement('button');
      button.className = 'bebidas-button';
      button.textContent = tag;
      button.addEventListener('click', () => {
        setActiveButton(button);
        currentBebidaPage = 1;
        filtrarBebidasPorTag(tag, bebidas, bebidasContainer);
      });
      filtersContainer.appendChild(button);
    });

    verTodosButton.addEventListener('click', () => {
      setActiveButton(verTodosButton);
      currentBebidaPage = 1;
      mostrarTodasBebidas(bebidas, bebidasContainer);
    });

    searchInput.addEventListener('input', () => {
      const sanitizedValue = sanitizeInput(searchInput.value);
      currentBebidaPage = 1;
      filtrarBebidasPorNombre(sanitizedValue, bebidas, bebidasContainer);
    });

    btnfilterprice.addEventListener('click', () => {
      togglePriceFilters();
    });

    filterPriceButton.addEventListener('click', () => {
      const minPrice = parseFloat(minPriceInput.value) || 0;
      const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
      currentBebidaPage = 1;
      filtrarBebidasPorPrecio(minPrice, maxPrice, bebidas, bebidasContainer);
    });

    verMasButton.addEventListener('click', () => {
      currentBebidaPage++;
      mostrarMasBebidas(bebidas, bebidasContainer);
    });

    mostrarTodasBebidas(bebidas, bebidasContainer);
  })
  .catch(error => {
    console.log('Error al cargar bebidas:', error);
  });

function mostrarTodasBebidas(bebidas, container) {
  container.innerHTML = '';
  mostrarMasBebidas(bebidas, container);
}

function mostrarMasBebidas(bebidas, container) {
  const start = (currentBebidaPage - 1) * BEBIDAS_PER_PAGE;
  const end = currentBebidaPage * BEBIDAS_PER_PAGE;
  const bebidasFiltradas = bebidas.slice(start, end);

  bebidasFiltradas.forEach(bebida => {
    container.appendChild(crearBebidaItem(bebida));
  });

  const verMasButton = document.getElementById('ver-mas-bebidas');
  if (end >= bebidas.length) {
    verMasButton.style.display = 'none';
  } else {
    verMasButton.style.display = 'block';
  }
}

function filtrarBebidasPorTag(tag, bebidas, container) {
  container.innerHTML = '';
  const bebidasFiltradas = bebidas.filter(bebida => bebida.tag.includes(tag));
  mostrarMasBebidas(bebidasFiltradas, container);
}

function filtrarBebidasPorNombre(nombre, bebidas, container) {
  container.innerHTML = '';
  const bebidasFiltradas = bebidas.filter(bebida => bebida.name.toLowerCase().includes(nombre.toLowerCase()));
  mostrarMasBebidas(bebidasFiltradas, container);
}

function filtrarBebidasPorPrecio(minPrice, maxPrice, bebidas, container) {
  container.innerHTML = '';
  const bebidasFiltradas = bebidas.filter(bebida => bebida.price >= minPrice && bebida.price <= maxPrice);
  mostrarMasBebidas(bebidasFiltradas, container);
}

function crearBebidaItem(bebida) {
  const li = document.createElement('li');
  li.innerHTML = `
    <img src="${bebida.image}" alt="${bebida.name}">
    <h3>${bebida.name}</h3>
    <p>${bebida.description}</p>
    <span>$${bebida.price}</span>
    <div class="quantity-controls">
      <button class="less-to-cart" data-id="${bebida.id}">-</button>
      <button class="add-to-cart" data-product='${JSON.stringify(bebida)}'>+</button>
    </div>
  `;
  return li;
}

function setActiveButton(button) {
  const buttons = document.querySelectorAll('#filtros-bebidas button');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function togglePriceFilters() {
  const divfilterPrice = document.getElementById('price-filters-bebidas');
  divfilterPrice.classList.toggle('show');
}

function sanitizeInput(input) {
  const element = document.createElement('div');
  element.innerText = input;
  return element.innerHTML;
}

document.getElementById('bebidas-container').addEventListener('click', function(event) {
  if (event.target.classList.contains('add-to-cart')) {
    const bebida = JSON.parse(event.target.getAttribute('data-product'));
    addToCart(bebida);
  } else if (event.target.classList.contains('less-to-cart')) {
    const bebidaId = event.target.getAttribute('data-id');
    lessToCart(bebidaId);
  }
});
