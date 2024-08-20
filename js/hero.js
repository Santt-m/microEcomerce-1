export function createHeroSection(data) {
    // Crear la sección hero y sus elementos internos
    const heroSection = document.createElement("section");
    heroSection.id = "hero";

    heroSection.innerHTML = `
        <div class="hero-desc">
            <h1>${data.nombreEmpresa}</h1>
            <p>${data.descripcion}</p>
            <div class="hero-cont">
                <div class="hero-cont-img">
                    <img src="./assets/index/hero/logo.jpeg" alt="Logo local">
                </div>
                <div class="hero-cont-info">
                    <p id="direccion">Dirección: ${data.direccion}</p>
                    <p id="telefono">Teléfono: ${data.telefono}</p>
                </div>
                <div id="horarios-container">
                    <select id="horarios-local"></select>
                    <p id="estado-local"></p>
                    <select id="horarios-envio"></select>
                    <p id="estado-envio"></p>
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

    // Crear botones de redes sociales si existen en los datos
    crearBotonRedes(btnContainer, "whatsapp", data.whatsapp, `https://wa.me/${data.whatsapp}`, "WhatsApp", "btn-whatsapp");
    crearBotonRedes(btnContainer, "google-maps", data.urlGoogleMaps, data.urlGoogleMaps, "Google Maps", "btn-google-maps");
    crearBotonRedes(btnContainer, "instagram", data.urlInstagram, data.urlInstagram, "Instagram", "btn-instagram");
    crearBotonRedes(btnContainer, "facebook", data.urlFacebook, data.urlFacebook, "Facebook", "btn-facebook");
    crearBotonRedes(btnContainer, "twitter", data.urlTwitter, data.urlTwitter, "Twitter", "btn-twitter");

    const horariosLocalSelect = document.getElementById("horarios-local");
    const horariosEnvioSelect = document.getElementById("horarios-envio");
    const estadoLocal = document.getElementById("estado-local");
    const estadoEnvio = document.getElementById("estado-envio");

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = new Date().getDay();
    const diaActual = diasSemana[hoy];

    // Rellenar los horarios en los selects
    data.horarios.forEach((horario) => {
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

// Crear botones de redes sociales
function crearBotonRedes(container, id, url, link, texto, clase) {
    if (url) {
        const button = document.createElement("button");
        button.id = id;
        button.className = `btn-contact ${clase}`;
        button.textContent = texto;
        button.onclick = () => window.open(link, "_blank");
        container.appendChild(button);
    }
}

// Formatear horario
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

    const apertura = new Date();
    const cierre = new Date();
    const ahora = new Date();

    const [aperturaHora, aperturaMin] = horario.apertura.split(":").map(Number);
    const [cierreHora, cierreMin] = horario.cierre.split(":").map(Number);

    apertura.setHours(aperturaHora, aperturaMin, 0, 0);
    cierre.setHours(cierreHora, cierreMin, 0, 0);

    estadoElement.classList.remove("estado-abierto", "estado-cerrado", "estado-pronto-cerrar");

    if (ahora >= apertura && ahora <= cierre) {
        const minutosRestantes = (cierre - ahora) / (1000 * 60);

        if (minutosRestantes <= 30) {
            estadoElement.textContent = `Abierto, cerrará pronto (${Math.ceil(minutosRestantes)} minutos restantes)`;
            estadoElement.classList.add("estado-pronto-cerrar");
        } else {
            estadoElement.textContent = "Abierto";
            estadoElement.classList.add("estado-abierto");
        }
    } else {
        estadoElement.textContent = "Cerrado";
        estadoElement.classList.add("estado-cerrado");
    }
}
