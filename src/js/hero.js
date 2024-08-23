export function createHeroSection(data, container) {
    const { nombreEmpresa, descripcion, logo, direccion, telefono, imagenFondo } = data;

    // Crear la sección hero
    const heroSection = document.createElement("section");
    heroSection.id = "hero";
    heroSection.style.backgroundImage = `url(${imagenFondo})`;

    heroSection.innerHTML = `
        <div class="hero-desc">
            <h1>${nombreEmpresa}</h1>
            <p>${descripcion}</p>
            <div class="hero-cont">
                <div class="hero-cont-img">
                    <img src="${logo}" alt="Logo local">
                </div>
                <div class="hero-cont-info">
                    <p id="direccion">Dirección: ${direccion}</p>
                    <p id="telefono">Teléfono: ${telefono}</p>
                </div>
                <div id="horarios-container">
                    <div class="horario-block">
                        <label for="horarios-local">Horario del Local:</label>
                        <select id="horarios-local"></select>
                        <p id="estado-local" class="estado"></p>
                    </div>
                    <div class="horario-block">
                        <label for="horarios-envio">Horario de Envíos:</label>
                        <select id="horarios-envio"></select>
                        <p id="estado-envio" class="estado"></p>
                    </div>
                    <div class="btn-container"></div>
                </div>
            </div>
        </div>
    `;

    // Insertar la sección hero dentro del contenedor <main id="app">
    container.appendChild(heroSection);

    populateHeroSection(data);
}
function populateHeroSection(data) {
    const { redesSociales, horarios } = data;
    const btnContainer = document.querySelector(".btn-container");

    // Crear los botones de redes sociales usando DocumentFragment
    const fragment = document.createDocumentFragment();
    redesSociales.forEach(redSocial => {
        if (redSocial.url) {
            const button = document.createElement("button");
            button.className = `btn-contact btn-${redSocial.name.toLowerCase()}`;
            button.textContent = redSocial.name;
            button.onclick = () => window.open(redSocial.url, "_blank");
            fragment.appendChild(button);
        }
    });
    btnContainer.appendChild(fragment);

    const horariosLocalSelect = document.getElementById("horarios-local");
    const horariosEnvioSelect = document.getElementById("horarios-envio");

    // Llenar los selectores de horarios
    fillHorariosSelect(horarios, horariosLocalSelect, horariosEnvioSelect);

    // Verificar los estados actuales de local y envíos
    const estadoLocal = document.getElementById("estado-local");
    const estadoEnvio = document.getElementById("estado-envio");
    verificarEstado(horariosLocalSelect.value, horarios, "local", estadoLocal);
    verificarEstado(horariosEnvioSelect.value, horarios, "envio", estadoEnvio);

    // Manejar los cambios en los selectores
    horariosLocalSelect.addEventListener("change", () => verificarEstado(horariosLocalSelect.value, horarios, "local", estadoLocal));
    horariosEnvioSelect.addEventListener("change", () => verificarEstado(horariosEnvioSelect.value, horarios, "envio", estadoEnvio));
}

function fillHorariosSelect(horarios, horariosLocalSelect, horariosEnvioSelect) {
    const fragmentLocal = document.createDocumentFragment();
    const fragmentEnvio = document.createDocumentFragment();
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaActual = diasSemana[new Date().getDay()];

    horarios.forEach(horario => {
        const { dia, horarioLocal, horarioEnvio } = horario;

        // Local
        const optionLocal = document.createElement("option");
        optionLocal.value = dia;
        optionLocal.textContent = `${dia}: ${formatearHorario(horarioLocal)}`;
        if (dia === diaActual) optionLocal.selected = true;
        fragmentLocal.appendChild(optionLocal);

        // Envío
        const optionEnvio = document.createElement("option");
        optionEnvio.value = dia;
        optionEnvio.textContent = horarioEnvio ? `${dia}: ${formatearHorario(horarioEnvio)}` : `${dia}: No disponible`;
        if (dia === diaActual) optionEnvio.selected = true;
        fragmentEnvio.appendChild(optionEnvio);
    });

    horariosLocalSelect.appendChild(fragmentLocal);
    horariosEnvioSelect.appendChild(fragmentEnvio);
}

function formatearHorario(horario) {
    return `${horario.apertura} - ${horario.cierre}`;
}

function verificarEstado(dia, horarios, tipo, estadoElement) {
    const horarioHoy = horarios.find(horario => horario.dia === dia);
    if (!horarioHoy) return;

    const horario = tipo === "local" ? horarioHoy.horarioLocal : horarioHoy.horarioEnvio;
    if (!horario) {
        estadoElement.textContent = tipo === "local" ? "Local cerrado" : "Envíos no disponibles";
        estadoElement.className = "estado estado-cerrado";
        return;
    }

    const ahora = new Date();
    const apertura = parseTime(horario.apertura);
    const cierre = parseTime(horario.cierre);

    estadoElement.className = "";
    if (ahora >= apertura && ahora <= cierre) {
        const minutosRestantes = (cierre - ahora) / (1000 * 60);

        if (minutosRestantes <= 30) {
            estadoElement.textContent = tipo === "local"
                ? `Abierto, cerrará pronto (${Math.ceil(minutosRestantes)} minutos restantes)`
                : `Envíos disponibles, finalizarán pronto (${Math.ceil(minutosRestantes)} minutos restantes)`;
            estadoElement.classList.add("estado-pronto-cerrar");
        } else {
            estadoElement.textContent = tipo === "local" ? "Abierto" : "Envíos disponibles";
            estadoElement.classList.add("estado-abierto");
        }
    } else {
        estadoElement.textContent = tipo === "local" ? "Local cerrado" : "No se realizan envíos";
        estadoElement.classList.add("estado-cerrado");
    }
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}
