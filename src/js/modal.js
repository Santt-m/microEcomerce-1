class Modal {
  constructor(options) {
    this.options = options;
    this.alertContainer =
      document.querySelector(".alert-container") || this.createAlertContainer();
  }

  createModal() {
    // Crear el overlay del modal
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    // Crear el contenido del modal
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    modalContent.innerHTML = `
        <div class="modal-header">
          <h2>${this.options.title}</h2>
          <span class="modal-close-icon">&times;</span>
        </div>
        <div class="modal-body">
          ${this.options.content}
        </div>
        <div class="modal-footer">
          <button class="modal-close-btn">${this.options.buttonText}</button>
        </div>
      `;

    // Añadir el contenido del modal al overlay
    overlay.appendChild(modalContent);
    document.body.appendChild(overlay);

    // Cerrar el modal al hacer clic en los botones de cierre
    overlay.querySelector(".modal-close-icon").addEventListener("click", () => {
      this.closeModal(overlay);
    });
    overlay.querySelector(".modal-close-btn").addEventListener("click", () => {
      this.closeModal(overlay);
    });
  }

  closeModal(overlay) {
    // Remover el modal del DOM
    document.body.removeChild(overlay);
  }

  createAlertContainer() {
    const container = document.createElement("div");
    container.classList.add("alert-container");
    document.body.appendChild(container);
    return container;
  }

  createAlert() {
    // Crear la alerta
    const alert = document.createElement("div");
    alert.classList.add("alert-overlay");

    // Aplicar el tipo de alerta según la opción
    if (this.options.type) {
      alert.classList.add(`alert-${this.options.type}`);
    }

    // Definir el contenido de la alerta
    alert.innerHTML = `
        <p>${this.options.message}</p>
        <button class="alert-close-btn">${this.options.buttonText}</button>
      `;

    // Añadir la alerta al contenedor de alertas
    this.alertContainer.appendChild(alert);

    // Cerrar la alerta al hacer clic en el botón
    alert.querySelector(".alert-close-btn").addEventListener("click", () => {
      this.closeAlert(alert);
    });

    // Desaparecer automáticamente después de 5 segundos
    setTimeout(() => {
      this.closeAlert(alert);
    }, 5000);
  }

  closeAlert(alert) {
    // Remover la alerta del DOM
    if (alert && alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }
}

export default Modal;
