export function createHeroSection(data) {
    // Crear la sección hero y sus elementos internos
    const heroSection = document.createElement("section");
    heroSection.id = "hero";
    heroSection.style.backgroundImage = `url(${data.imagenFondo})`;

    heroSection.innerHTML = `
        <div class="hero-desc">
            <h1>${data.nombreEmpresa}</h1>
            <p>${data.descripcion}</p>
            <div class="hero-cont">
                <div class="hero-cont-img">
                    <img src="${data.logo}" alt="Logo local">
                </div>
                <div class="hero-cont-info">
                    <p id="direccion">Dirección: ${data.direccion}</p>
                    <p id="telefono">Teléfono: ${data.telefono}</p>
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

    // Añadir la sección hero al body o a un contenedor específico
    document.body.insertBefore(heroSection, document.body.firstChild);

    // Llenar la información restante
    populateHeroSection(data);
}

function populateHeroSection(data) {
    const btnContainer = document.querySelector(".btn-container");

    // Crear botones dinámicamente para cada red social
    data.redesSociales.forEach(redSocial => {
        if (redSocial.url) {
            const button = document.createElement("button");
            button.className = `btn-contact btn-${redSocial.name.toLowerCase()}`;
            button.textContent = redSocial.name;
            button.onclick = () => window.open(redSocial.url, "_blank");
            btnContainer.appendChild(button);
        }
    });

    const horariosLocalSelect = document.getElementById("horarios-local");
    const horariosEnvioSelect = document.getElementById("horarios-envio");
    const estadoLocal = document.getElementById("estado-local");
    const estadoEnvio = document.getElementById("estado-envio");

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = new Date().getDay();
    const diaActual = diasSemana[hoy];

    // Rellenar horarios en los selects y establecer el día actual
    data.horarios.forEach(horario => {
        const optionLocal = document.createElement("option");
        optionLocal.value = horario.dia;
        optionLocal.textContent = `${horario.dia}: ${formatearHorario(horario.horarioLocal)}`;
        if (horario.dia === diaActual) optionLocal.selected = true;
        horariosLocalSelect.appendChild(optionLocal);

        const optionEnvio = document.createElement("option");
        optionEnvio.value = horario.dia;
        if (horario.horarioEnvio) {
            optionEnvio.textContent = `${horario.dia}: ${formatearHorario(horario.horarioEnvio)}`;
        } else {
            optionEnvio.textContent = `${horario.dia}: No disponible`;
        }
        if (horario.dia === diaActual) optionEnvio.selected = true;
        horariosEnvioSelect.appendChild(optionEnvio);
    });

    // Verificar estado del local y de los envíos
    verificarEstado(horariosLocalSelect.value, data.horarios, "local", estadoLocal);
    verificarEstado(horariosEnvioSelect.value, data.horarios, "envio", estadoEnvio);

    // Actualizar estado cuando se cambie el día
    horariosLocalSelect.addEventListener("change", () => {
        verificarEstado(horariosLocalSelect.value, data.horarios, "local", estadoLocal);
    });
    horariosEnvioSelect.addEventListener("change", () => {
        verificarEstado(horariosEnvioSelect.value, data.horarios, "envio", estadoEnvio);
    });
}

// Formatear horario (convertir apertura/cierre en un string legible)
function formatearHorario(horario) {
    return `${horario.apertura} - ${horario.cierre}`;
}

// Verificar estado del local o envío
function verificarEstado(dia, horarios, tipo, estadoElement) {
    const horarioHoy = horarios.find(horario => horario.dia === dia);
    if (!horarioHoy) return;

    const horario = tipo === "local" ? horarioHoy.horarioLocal : horarioHoy.horarioEnvio;
    if (!horario) {
        estadoElement.textContent = tipo === "local" ? "Local cerrado" : "Envíos no disponibles";
        estadoElement.classList.add("estado-cerrado");
        return;
    }

    const ahora = new Date();
    const apertura = new Date();
    const cierre = new Date();

    const [aperturaHora, aperturaMin] = horario.apertura.split(":").map(Number);
    const [cierreHora, cierreMin] = horario.cierre.split(":").map(Number);

    apertura.setHours(aperturaHora, aperturaMin, 0, 0);
    cierre.setHours(cierreHora, cierreMin, 0, 0);

    estadoElement.classList.remove("estado-abierto", "estado-cerrado", "estado-pronto-cerrar");

    if (ahora >= apertura && ahora <= cierre) {
        const minutosRestantes = (cierre - ahora) / (1000 * 60);

        if (minutosRestantes <= 30) {
            estadoElement.textContent = tipo === "local" ? `Abierto, cerrará pronto (${Math.ceil(minutosRestantes)} minutos restantes)` : `Envíos disponibles, finalizarán pronto (${Math.ceil(minutosRestantes)} minutos restantes)`;
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
