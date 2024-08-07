const BEBIDAS_PER_PAGE = 6; // Número de bebidas a cargar por clic
let currentBebidaPage = 1;

// Cargar los datos de bebidas desde el archivo JSON
fetch('../db/bebidasData.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo de bebidas');
        }
        return response.json();
    })
    .then(data => {
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

        // Recopilar todos los tags únicos
        bebidas.forEach(bebida => {
            bebida.tag.forEach(tag => tags.add(tag));
        });

        // Crear botones de filtro para cada tag único
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

        // Evento para mostrar todas las bebidas
        verTodosButton.addEventListener('click', () => {
            setActiveButton(verTodosButton);
            currentBebidaPage = 1;
            mostrarTodasBebidas(bebidas, bebidasContainer);
        });

        // Evento para buscar bebidas por nombre
        searchInput.addEventListener('input', () => {
            const sanitizedValue = sanitizeInput(searchInput.value);
            currentBebidaPage = 1;
            filtrarBebidasPorNombre(sanitizedValue, bebidas, bebidasContainer);
        });

        // Evento para mostrar/ocultar filtros de precio
        btnfilterprice.addEventListener('click', () => {
            togglePriceFilters();
        });

        // Evento para filtrar bebidas por precio
        filterPriceButton.addEventListener('click', () => {
            const minPrice = parseFloat(minPriceInput.value) || 0;
            const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
            currentBebidaPage = 1;
            filtrarBebidasPorPrecio(minPrice, maxPrice, bebidas, bebidasContainer);
        });

        // Evento para cargar más bebidas
        verMasButton.addEventListener('click', () => {
            currentBebidaPage++;
            mostrarMasBebidas(bebidas, bebidasContainer);
        });

        // Mostrar las primeras bebidas inicialmente
        mostrarTodasBebidas(bebidas, bebidasContainer);
    })
    .catch(error => {
        console.log('Error al cargar bebidas:', error);
    });

// Función para mostrar todas las bebidas
function mostrarTodasBebidas(bebidas, container) {
    container.innerHTML = '';
    mostrarMasBebidas(bebidas, container);
}

// Función para mostrar más bebidas
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

// Función para filtrar bebidas por tag
function filtrarBebidasPorTag(tag, bebidas, container) {
    container.innerHTML = '';
    const bebidasFiltradas = bebidas.filter(bebida => bebida.tag.includes(tag));
    mostrarMasBebidas(bebidasFiltradas, container);
}

// Función para filtrar bebidas por nombre
function filtrarBebidasPorNombre(nombre, bebidas, container) {
    container.innerHTML = '';
    const bebidasFiltradas = bebidas.filter(bebida => bebida.name.toLowerCase().includes(nombre.toLowerCase()));
    mostrarMasBebidas(bebidasFiltradas, container);
}

// Función para filtrar bebidas por precio
function filtrarBebidasPorPrecio(minPrice, maxPrice, bebidas, container) {
    container.innerHTML = '';
    const bebidasFiltradas = bebidas.filter(bebida => bebida.price >= minPrice && bebida.price <= maxPrice);
    mostrarMasBebidas(bebidasFiltradas, container);
}

// Función para crear un elemento de bebida
function crearBebidaItem(bebida) {
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${bebida.image}" alt="${bebida.name}">
        <h3>${bebida.name}</h3>
        <p>${bebida.description}</p>
        <span>$${bebida.price}</span>
    `;
    return li;
}

// Función para establecer el botón activo
function setActiveButton(button) {
    const buttons = document.querySelectorAll('#filtros-bebidas button');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Función para mostrar/ocultar filtros de precio
function togglePriceFilters() {
    const divfilterPrice = document.getElementById('price-filters-bebidas');
    divfilterPrice.classList.toggle('show');
}

// Función para sanitizar la entrada del usuario
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
}
