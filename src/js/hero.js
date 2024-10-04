// Importar la clase Modal
import Modal from './modal.js';

export function createHeroSection(data, container) {
    const { nombreEmpresa, descripcion, logo, direccion, telefono, imagenFondo } = data;

    // Crear la sección hero
    const heroSection = container;
    heroSection.id = "hero";
    heroSection.style.backgroundImage = `url(${imagenFondo})`;

    heroSection.innerHTML = `
        <div class="hero-desc">
            <div class="btn-container"></div> <!-- Botones de redes sociales -->
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
                        <label>Estado del Local:</label>
                        <p id="estado-local" class="estado"></p>
                    </div>
                    <div class="horario-block">
                        <label>Estado de Envíos:</label>
                        <p id="estado-envio" class="estado"></p>
                    </div>
                    <button id="btn-horarios" class="btn-horarios">Ver horarios</button>
                </div>
            </div>
        </div>
    `;

    populateHeroSection(data);

    // Asignar evento al botón de ver horarios
    const btnHorarios = document.getElementById("btn-horarios");
    btnHorarios.addEventListener("click", () => {
        mostrarModalHorarios(data.horarios);  // Mostrar el modal con la tabla de horarios
    });
}

function populateHeroSection(data) {
    const { redesSociales, horarios } = data;

    // Crear los botones de redes sociales
    const btnContainer = document.querySelector(".btn-container");

    redesSociales.forEach(redSocial => {
        if (redSocial.url) {
            const button = document.createElement("button");
            button.className = `btn-contact btn-${redSocial.name.toLowerCase()}`;

            // Crear imagen para el icono
            const img = document.createElement("img");
            img.src = redSocial.icon;
            img.alt = redSocial.name;

            // Manejar el caso donde la imagen no se carga (archivo no encontrado o URL incorrecta)
            img.onerror = () => {
                img.remove();
                button.textContent = redSocial.name;
            };

            // Añadir la imagen (icono) al botón
            button.appendChild(img);

            // Establecer el comportamiento del botón al hacer clic
            button.onclick = () => window.open(redSocial.url, "_blank");

            // Añadir el botón al contenedor
            btnContainer.appendChild(button);
        }
    });

    // Verificar los estados actuales de local y envíos
    const estadoLocal = document.getElementById("estado-local");
    const estadoEnvio = document.getElementById("estado-envio");
    verificarEstado(horarios, "local", estadoLocal);
    verificarEstado(horarios, "envio", estadoEnvio);
}

function verificarEstado(horarios, tipo, estadoElement) {
    const diaActual = obtenerDiaActual();
    const horarioHoy = horarios.find(horario => horario.dia === diaActual);
    if (!horarioHoy) return;

    const horario = tipo === "local" ? horarioHoy.horarioLocal : horarioHoy.horarioEnvio;

    // Si el horario de local está cerrado
    if (!horario) {
        if (tipo === "local") {
            estadoElement.textContent = "Local cerrado";
            estadoElement.className = "estado estado-cerrado";
            mostrarModalCierre(horarios); // Mostrar modal de aviso de cierre
        } else {
            estadoElement.textContent = "Envíos no disponibles"; // Asegurarse de mostrar este texto
            estadoElement.className = "estado estado-cerrado";
        }
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
        if (tipo === "local") {
            mostrarModalCierre(horarios); // Mostrar modal de aviso de cierre para el local
        }
    }
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

function obtenerDiaActual() {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return diasSemana[new Date().getDay()];
}

// Función para mostrar el modal con los horarios
function mostrarModalHorarios(horarios) {
    const tableRows = horarios.map(horario => `
        <tr>
            <td>${horario.dia}</td>
            <td>${horario.horarioLocal ? `${horario.horarioLocal.apertura} - ${horario.horarioLocal.cierre}` : "Cerrado"}</td>
            <td>${horario.horarioEnvio ? `${horario.horarioEnvio.apertura} - ${horario.horarioEnvio.cierre}` : "No disponible"}</td>
        </tr>
    `).join('');

    const content = `
        <table class="tabla-horarios">
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Horario del Local</th>
                    <th>Horario de Envíos</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;

    const modalOptions = {
        title: 'Horarios de Atención y Envíos',
        content: content,
        buttonText: 'Cerrar'
    };

    const modal = new Modal(modalOptions);
    modal.createModal();
}

// Función para mostrar el modal de aviso de cierre
function mostrarModalCierre(horarios) {
    const content = `
        <p>El local está cerrado y no se tomará el pedido en este momento.</p>
        <p>Consulte los horarios de atención en la tabla de horarios.</p>
        <button id="btn-consultar-horarios" class="btn-consultar-horarios">Consultar Horarios</button>
    `;

    const modalOptions = {
        title: 'Local Cerrado',
        content: content,
        buttonText: 'Cerrar'
    };

    const modal = new Modal(modalOptions);
    modal.createModal();

    // Añadir evento al botón de consultar horarios
    document.getElementById("btn-consultar-horarios").addEventListener("click", () => {
        mostrarModalHorarios(horarios); // Mostrar la tabla de horarios
    });
}
