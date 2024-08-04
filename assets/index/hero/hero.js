document.addEventListener("DOMContentLoaded", () => {
  fetch("../db/clientData.json")
    .then((response) => response.json())
    .then((data) => {
      const heroTitle = document.querySelector("#hero .hero-desc h1");
      const heroDescription = document.querySelector("#hero .hero-desc p");
      const direccion = document.getElementById("direccion");
      const telefono = document.getElementById("telefono");
      const whatsapp = document.getElementById("whatsapp");
      const googleMaps = document.getElementById("google-maps");

      heroTitle.textContent = data.nombreEmpresa;
      heroDescription.textContent = data.descripcion;
      direccion.textContent = `Dirección: ${data.direccion}`;
      telefono.textContent = `Teléfono: ${data.telefono}`;
      whatsapp.textContent = `WhatsApp: ${data.whatsapp}`;
      googleMaps.href = data.urlGoogleMaps;
      googleMaps.textContent = "Ver en Google Maps";
    })
    .catch((error) =>
      console.error("Error al cargar los datos de la empresa:", error)
    );
});
