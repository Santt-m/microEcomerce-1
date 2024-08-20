export function renderSections(container, products) {
  // Obtenemos los tipos únicos de productos
  const uniqueTypes = [...new Set(products.map(product => product.type))];

  uniqueTypes.forEach(type => {
      // Filtrar productos por tipo
      const productsOfType = products.filter(product => product.type === type);
      
      // Crear la sección para cada tipo
      const section = document.createElement("section");
      section.id = type;
      
      // Crear el título de la sección
      const title = document.createElement("h2");
      title.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      section.appendChild(title);

      // Crear el contenedor de filtros
      const filterContainer = document.createElement("div");
      filterContainer.classList.add("filters");
      
      const showAllButton = document.createElement("button");
      showAllButton.textContent = "Ver Todos";
      filterContainer.appendChild(showAllButton);

      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "Buscar productos...";
      filterContainer.appendChild(searchInput);

      const priceFilterButton = document.createElement("button");
      priceFilterButton.textContent = "Filtros de Precio";
      priceFilterButton.classList.add("show-price-filters");
      filterContainer.appendChild(priceFilterButton);

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

      const filterByPriceButton = document.createElement("button");
      filterByPriceButton.textContent = "Filtrar por precio";
      priceFilters.appendChild(filterByPriceButton);

      filterContainer.appendChild(priceFilters);
      section.appendChild(filterContainer);

      // Crear el contenedor de productos
      const productsContainer = document.createElement("ol");
      productsContainer.classList.add("products-container");
      section.appendChild(productsContainer);

      const loadMoreButton = document.createElement("button");
      loadMoreButton.textContent = "Ver Más";
      loadMoreButton.classList.add("load-more-products");
      loadMoreButton.style.display = "none";
      section.appendChild(loadMoreButton);

      let currentProductPage = 1;  // Variable local para la página actual de productos
      displayAllProducts(productsOfType, productsContainer, loadMoreButton, currentProductPage);

      // Agregar la sección al contenedor principal
      container.appendChild(section);

      // Eventos para el filtro
      showAllButton.addEventListener("click", () => {
          currentProductPage = 1;
          displayAllProducts(productsOfType, productsContainer, loadMoreButton, currentProductPage);
      });

      searchInput.addEventListener("input", () => {
          const searchTerm = sanitizeInput(searchInput.value);
          const filteredProducts = productsOfType.filter(product => 
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          currentProductPage = 1;
          displayAllProducts(filteredProducts, productsContainer, loadMoreButton, currentProductPage);
      });

      filterByPriceButton.addEventListener("click", () => {
          const minPrice = parseFloat(minPriceInput.value) || 0;
          const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
          const filteredProducts = productsOfType.filter(product =>
              product.price >= minPrice && product.price <= maxPrice
          );
          currentProductPage = 1;
          displayAllProducts(filteredProducts, productsContainer, loadMoreButton, currentProductPage);
      });

      loadMoreButton.addEventListener("click", () => {
          currentProductPage++;
          displayMoreProducts(productsOfType, productsContainer, loadMoreButton, currentProductPage);
      });
  });

  setUpPriceFilterToggles(); // Activar funcionalidad de mostrar/ocultar filtros de precio
}

// Función para mostrar todos los productos
function displayAllProducts(products, container, loadMoreButton, currentProductPage) {
  container.innerHTML = "";
  displayMoreProducts(products, container, loadMoreButton, currentProductPage);
}

// Función para mostrar más productos
function displayMoreProducts(products, container, loadMoreButton, page) {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = page * PRODUCTS_PER_PAGE;
  const filteredProducts = products.slice(start, end);

  filteredProducts.forEach(product => {
      container.appendChild(createProductItem(product));
  });

  if (end >= products.length) {
      loadMoreButton.style.display = "none";
  } else {
      loadMoreButton.style.display = "block";
  }
}

// Función para crear un producto
function createProductItem(product) {
  const li = document.createElement("li");
  li.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.image}" alt="${product.name}">
      <p>${product.description}</p>
      <span>$${product.price}</span>
      <div class="quantity-controls">
          <button class="less-to-cart" data-id="${product.id}">-</button>
          <span class="product-quantity" data-id="${product.id}">0</span>
          <button class="add-to-cart" data-product='${JSON.stringify(product)}'>+</button>
      </div>
  `;
  return li;
}

// Función para configurar los toggles de los filtros de precio
function setUpPriceFilterToggles() {
  const priceFilterButtons = document.querySelectorAll('.show-price-filters');

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
