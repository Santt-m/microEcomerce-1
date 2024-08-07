document.addEventListener('DOMContentLoaded', () => {
    const showPayBtn = document.getElementById('show-pay');
    const cartPaySection = document.querySelector('.cart-pay');

    showPayBtn.addEventListener('click', () => {
        switchSection(showPayBtn, cartPaySection);
        updatePayTicket();
    });

    function updatePayTicket() {
        const payTicketContainer = document.getElementById('pay-ticket');
        payTicketContainer.innerHTML = '';

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            payTicketContainer.appendChild(li);
        });

        const totalCost = carrito.reduce((total, item) => total + item.price * item.quantity, 0);
        document.getElementById('total-cost').textContent = `Total: $${totalCost}`;

        const clientInfo = JSON.parse(localStorage.getItem('clientInfo')) || {};
        if (clientInfo.deliveryOption === 'delivery') {
            const shippingCost = 500; // Ejemplo de costo de envío
            document.getElementById('shipping-cost').textContent = `Costo de Envío: $${shippingCost}`;
            document.getElementById('total-cost').textContent = `Total: $${totalCost + shippingCost}`;
        } else {
            document.getElementById('shipping-cost').textContent = '';
        }
    }

    function switchSection(button, section) {
        document.querySelectorAll('.cart-header button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.querySelectorAll('.cart-cont section').forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
    }
});
