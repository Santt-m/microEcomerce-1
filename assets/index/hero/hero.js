document.addEventListener("DOMContentLoaded", () => {
  fetch("../db/clientData.json")
    .then((response) => response.json())
    .then((data) => {
      const heroTitle = document.querySelector("#hero .hero-desc h1");
      const heroDescription = document.querySelector("#hero .hero-desc p");
      const direccion = document.getElementById("direccion");
      const telefono = document.getElementById("telefono");
      const btnContainer = document.querySelector(".btn-container");

      heroTitle.textContent = data.nombreEmpresa;
      heroDescription.textContent = data.descripcion;
      direccion.textContent = `Dirección: ${data.direccion}`;
      telefono.textContent = `Teléfono: ${data.telefono}`;

      // Crear botones solo si los datos existen en el JSON
      if (data.whatsapp) {
        const whatsappButton = document.createElement("button");
        whatsappButton.id = "whatsapp";
        whatsappButton.className = "btn-contact btn-whatsapp";
        whatsappButton.textContent = "WhatsApp";
        whatsappButton.onclick = () => {
          window.open(`https://wa.me/${data.whatsapp}`, "_blank");
        };
        btnContainer.appendChild(whatsappButton);
      }

      if (data.urlGoogleMaps) {
        const googleMapsButton = document.createElement("button");
        googleMapsButton.id = "google-maps";
        googleMapsButton.className = "btn-contact btn-google-maps";
        googleMapsButton.textContent = "Google Maps";
        googleMapsButton.onclick = () => {
          window.open(data.urlGoogleMaps, "_blank");
        };
        btnContainer.appendChild(googleMapsButton);
      }

      if (data.urlInstagram) {
        const instagramButton = document.createElement("button");
        instagramButton.id = "instagram";
        instagramButton.className = "btn-contact btn-instagram";
        instagramButton.textContent = "Instagram";
        instagramButton.onclick = () => {
          window.open(data.urlInstagram, "_blank");
        };
        btnContainer.appendChild(instagramButton);
      }

      if (data.urlFacebook) {
        const facebookButton = document.createElement("button");
        facebookButton.id = "facebook";
        facebookButton.className = "btn-contact btn-facebook";
        facebookButton.textContent = "Facebook";
        facebookButton.onclick = () => {
          window.open(data.urlFacebook, "_blank");
        };
        btnContainer.appendChild(facebookButton);
      }

      if (data.urlTwitter) {
        const twitterButton = document.createElement("button");
        twitterButton.id = "twitter";
        twitterButton.className = "btn-contact btn-twitter";
        twitterButton.textContent = "Twitter";
        twitterButton.onclick = () => {
          window.open(data.urlTwitter, "_blank");
        };
        btnContainer.appendChild(twitterButton);
      }

      // Mostrar horarios en el select
      const horariosLocalSelect = document.getElementById("horarios-local");
      const horariosEnvioSelect = document.getElementById("horarios-envio");
      const estadoLocal = document.getElementById("estado-local");
      const estadoEnvio = document.getElementById("estado-envio");

      const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const hoy = new Date().getDay();
      const diaActual = diasSemana[hoy];

      // Rellenar horarios del local
      data.horariosLocal.forEach(horario => {
        const option = document.createElement("option");
        option.value = horario.dia;
        option.textContent = `${horario.dia}: ${horario.horario}`;
        if (horario.dia === diaActual) {
          option.selected = true;
        }
        horariosLocalSelect.appendChild(option);
      });

      // Rellenar horarios de envío
      data.horariosEnvio.forEach(horario => {
        const option = document.createElement("option");
        option.value = horario.dia;
        option.textContent = `${horario.dia}: ${horario.horario}`;
        if (horario.dia === diaActual) {
          option.selected = true;
        }
        horariosEnvioSelect.appendChild(option);
      });

      // Verificar estado del local y envíos
      verificarEstadoLocal(horariosLocalSelect.value, data.horariosLocal, estadoLocal);
      verificarEstadoEnvio(horariosEnvioSelect.value, data.horariosEnvio, estadoEnvio);
    })
    .catch((error) =>
      console.error("Error al cargar los datos de la empresa:", error)
    );
});

function verificarEstadoLocal(dia, horariosLocal, estadoElement) {
  const horarioHoy = horariosLocal.find(horario => horario.dia === dia);
  if (!horarioHoy) return;

  const [horaApertura, horaCierre] = horarioHoy.horario.split(" - ").map(hora => new Date().setHours(...hora.split(":")));
  const ahora = new Date();

  estadoElement.classList.remove("estado-abierto", "estado-cerrado", "estado-pronto-cerrar");

  if (ahora >= horaApertura && ahora <= horaCierre) {
    const minutosRestantes = (horaCierre - ahora) / (1000 * 60);

    if (minutosRestantes <= 30) {
      estadoElement.textContent = `El local está abierto, pero cerrará pronto (${Math.ceil(minutosRestantes)} minutos restantes)`;
      estadoElement.classList.add("estado-pronto-cerrar");
    } else {
      estadoElement.textContent = "El local está abierto";
      estadoElement.classList.add("estado-abierto");
    }
  } else {
    estadoElement.textContent = "El local está cerrado";
    estadoElement.classList.add("estado-cerrado");
  }
}

function verificarEstadoEnvio(dia, horariosEnvio, estadoElement) {
  const horarioHoy = horariosEnvio.find(horario => horario.dia === dia);
  if (!horarioHoy) return;

  const [horaApertura, horaCierre] = horarioHoy.horario.split(" - ").map(hora => new Date().setHours(...hora.split(":")));
  const ahora = new Date();

  estadoElement.classList.remove("estado-abierto", "estado-cerrado", "estado-pronto-cerrar");

  if (ahora >= horaApertura && ahora <= horaCierre) {
    const minutosRestantes = (horaCierre - ahora) / (1000 * 60);

    if (minutosRestantes <= 30) {
      estadoElement.textContent = `Envios disponible, pero finalizará pronto (${Math.ceil(minutosRestantes)} minutos restantes)`;
      estadoElement.classList.add("estado-pronto-cerrar");
    } else {
      estadoElement.textContent = "Envios disponible";
      estadoElement.classList.add("estado-abierto");
    }
  } else {
    estadoElement.textContent = "Envios no disponible";
    estadoElement.classList.add("estado-cerrado");
  }
}
