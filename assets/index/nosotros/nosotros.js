document.addEventListener("DOMContentLoaded", () => {
    fetch("../db/clientData.json")
      .then((response) => response.json())
      .then((data) => {
        // Título y contenido
        document.getElementById("nosotros-title").textContent = data.aboutUs.title;
        document.getElementById("nosotros-content").textContent = data.aboutUs.content;
  
        // Carousel de imágenes
        const carouselImagesContainer = document.querySelector(".carousel-images");
        data.aboutUs.carouselImages.forEach((imageSrc) => {
          const img = document.createElement("img");
          img.src = imageSrc;
          carouselImagesContainer.appendChild(img);
        });
  
        // Funcionalidad del carousel
        const images = document.querySelectorAll(".carousel-images img");
        let currentIndex = 0;
  
        function updateCarousel() {
            carouselImagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        document.querySelector(".carousel-control.next").addEventListener("click", () => {
          currentIndex = (currentIndex + 1) % images.length;
          updateCarousel();
        });
  
        document.querySelector(".carousel-control.prev").addEventListener("click", () => {
          currentIndex = (currentIndex - 1 + images.length) % images.length;
          updateCarousel();
        });
  
        // Swipe para dispositivos móviles
        let startX = 0;
        let isDragging = false;

        carouselImagesContainer.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        carouselImagesContainer.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const diffX = e.touches[0].clientX - startX;
            const moveX = (diffX / carouselImagesContainer.clientWidth) * 100;
            carouselImagesContainer.style.transform = `translateX(calc(-${currentIndex * 100}% + ${moveX}px))`;
        });

        carouselImagesContainer.addEventListener("touchend", (e) => {
            isDragging = false;
            const diffX = e.changedTouches[0].clientX - startX;
            if (Math.abs(diffX) > carouselImagesContainer.clientWidth / 3) {
                if (diffX > 0) {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                } else {
                    currentIndex = (currentIndex + 1) % images.length;
                }
            }
            updateCarousel();
        });
  
        // Iframe de Google Maps
        document.getElementById("location-iframe").src = data.aboutUs.locationIframe;
  
        // Información adicional
        document.getElementById("years-in-business").textContent = `Años en el mercado: ${data.aboutUs.additionalInfo.yearsInBusiness}`;
        document.getElementById("core-values").textContent = `Valores principales: ${data.aboutUs.additionalInfo.coreValues}`;
        document.getElementById("mission").textContent = `Misión: ${data.aboutUs.additionalInfo.mission}`;
      })
      .catch((error) => console.error("Error al cargar los datos de la empresa:", error));
  });
