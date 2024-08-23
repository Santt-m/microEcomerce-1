document.addEventListener('DOMContentLoaded', () => {
    let carrito = [];

    const cartContent = document.getElementById('cart-content');
    const direccionForm = document.getElementById('direccion-form');
    const pagoForm = document.getElementById('pago-form');
    const tipoEntrega = document.getElementById('tipo-entrega');
    const direccionEnvio = document.getElementById('direccion-envio');
    const resumenPedido = document.getElementById('resumen-pedido');

    // Mostrar carrito al inicio
    cartContent.style.display = 'block';

    // Botón para mostrar el carrito
    document.getElementById('show-cart').addEventListener('click', () => {
        mostrarSeccion(cartContent);
    });

    // Botón para mostrar el formulario de dirección
    document.getElementById('show-direccion').addEventListener('click', () => {
        mostrarSeccion(direccionForm);
    });

    // Botón para mostrar el resumen de pago
    document.getElementById('show-pago').addEventListener('click', () => {
        generarResumen();
        mostrarSeccion(pagoForm);
    });

    // Evento para mostrar los campos de dirección según el tipo de entrega
    tipoEntrega.addEventListener('change', () => {
        if (tipoEntrega.value === 'envio') {
            direccionEnvio.classList.remove('hidden');
        } else {
            direccionEnvio.classList.add('hidden');
        }
    });

    // Función para mostrar una sección y ocultar las demás
    function mostrarSeccion(seccion) {
        cartContent.style.display = 'none';
        direccionForm.style.display = 'none';
        pagoForm.style.display = 'none';

        seccion.style.display = 'block';
    }

    // Función para generar el resumen de pedido en el formulario de pago
    function generarResumen() {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const telefono = document.getElementById('telefono').value;
        const tipoEntregaSeleccionado = tipoEntrega.value;
        const direccion = document.getElementById('direccion').value;
        const numero = document.getElementById('numero').value;
        const piso = document.getElementById('piso').value;
        const departamento = document.getElementById('departamento').value;
        const notas = document.getElementById('notas').value;

        resumenPedido.innerHTML = `
            <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Tipo de entrega:</strong> ${tipoEntregaSeleccionado === 'local' ? 'Pasar a buscar' : 'Envío a domicilio'}</p>
        `;

        if (tipoEntregaSeleccionado === 'envio') {
            resumenPedido.innerHTML += `
                <p><strong>Dirección:</strong> ${direccion}, ${numero}, Piso: ${piso}, Departamento: ${departamento}</p>
                <p><strong>Notas:</strong> ${notas}</p>
            `;
        }

        // Resumen del carrito
        resumenPedido.innerHTML += `<h4>Resumen del Carrito:</h4>`;
        carrito.forEach(item => {
            resumenPedido.innerHTML += `<p>${item.name} (x${item.cantidad}) - $${item.price * item.cantidad}</p>`;
        });
    }
});
