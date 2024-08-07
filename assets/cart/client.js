document.addEventListener('DOMContentLoaded', () => {
    const showClientBtn = document.getElementById('show-client');
    const cartClientSection = document.querySelector('.cart-client');
    const deliveryOptionRadios = document.getElementsByName('delivery-option');
    const deliveryInfoForm = document.getElementById('delivery-info');
    const addressTypeRadios = document.getElementsByName('address-type');
    const apartmentInfo = document.getElementById('apartment-info');
    const saveClientInfoBtn = document.getElementById('save-client-info');
    const saveMessage = document.getElementById('save-message');

    showClientBtn.addEventListener('click', () => {
        switchSection(showClientBtn, cartClientSection);
    });

    deliveryOptionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'delivery') {
                deliveryInfoForm.classList.remove('hidden');
            } else {
                deliveryInfoForm.classList.add('hidden');
            }
        });
    });

    addressTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'apartment') {
                apartmentInfo.classList.remove('hidden');
            } else {
                apartmentInfo.classList.add('hidden');
            }
        });
    });

    saveClientInfoBtn.addEventListener('click', (event) => {
        event.preventDefault();
        saveClientInfo();
    });

    function saveClientInfo() {
        const clientInfo = {
            firstName: sanitizeInput(document.getElementById('first-name').value),
            lastName: sanitizeInput(document.getElementById('last-name').value),
            phoneNumber: sanitizeInput(document.getElementById('phone-number').value),
            deliveryOption: document.querySelector('input[name="delivery-option"]:checked').value,
        };

        if (clientInfo.deliveryOption === 'delivery') {
            clientInfo.address = sanitizeInput(document.getElementById('address').value);
            clientInfo.addressNumber = sanitizeInput(document.getElementById('address-number').value);
            clientInfo.addressType = document.querySelector('input[name="address-type"]:checked').value;

            if (clientInfo.addressType === 'apartment') {
                clientInfo.floor = sanitizeInput(document.getElementById('floor').value);
                clientInfo.apartmentNumber = sanitizeInput(document.getElementById('apartment-number').value);
            }
        }

        const validation = validateClientInfo(clientInfo);
        if (validation.isValid) {
            localStorage.setItem('clientInfo', JSON.stringify(clientInfo));
            console.log('Información del cliente guardada:', clientInfo);
            showSaveMessage('Información guardada exitosamente', 'green');
        } else {
            console.error('Error: Información inválida');
            showSaveMessage(validation.message, 'red');
        }
    }

    function loadClientInfo() {
        const storedClientInfo = localStorage.getItem('clientInfo');
        if (storedClientInfo) {
            const clientInfo = JSON.parse(storedClientInfo);
            document.getElementById('first-name').value = clientInfo.firstName;
            document.getElementById('last-name').value = clientInfo.lastName;
            document.getElementById('phone-number').value = clientInfo.phoneNumber;
            document.querySelector(`input[name="delivery-option"][value="${clientInfo.deliveryOption}"]`).checked = true;

            if (clientInfo.deliveryOption === 'delivery') {
                deliveryInfoForm.classList.remove('hidden');
                document.getElementById('address').value = clientInfo.address;
                document.getElementById('address-number').value = clientInfo.addressNumber;
                document.querySelector(`input[name="address-type"][value="${clientInfo.addressType}"]`).checked = true;

                if (clientInfo.addressType === 'apartment') {
                    apartmentInfo.classList.remove('hidden');
                    document.getElementById('floor').value = clientInfo.floor;
                    document.getElementById('apartment-number').value = clientInfo.apartmentNumber;
                }
            }
        }
    }

    function sanitizeInput(input) {
        const element = document.createElement('div');
        element.innerText = input;
        return element.innerHTML;
    }

    function validateClientInfo(clientInfo) {
        const namePattern = /^[a-zA-Z\s]+$/;
        const phonePattern = /^[0-9]{10,15}$/;
        const addressPattern = /^[a-zA-Z0-9\s]+$/;

        if (!namePattern.test(clientInfo.firstName)) {
            return { isValid: false, message: 'Nombre inválido: Solo letras y espacios permitidos.' };
        }
        if (!namePattern.test(clientInfo.lastName)) {
            return { isValid: false, message: 'Apellido inválido: Solo letras y espacios permitidos.' };
        }
        if (!phonePattern.test(clientInfo.phoneNumber)) {
            return { isValid: false, message: 'Número de teléfono inválido: Solo números permitidos y entre 10 y 15 dígitos.' };
        }
        if (clientInfo.deliveryOption === 'delivery') {
            if (!addressPattern.test(clientInfo.address)) {
                return { isValid: false, message: 'Dirección inválida: Solo letras, números y espacios permitidos.' };
            }
            if (!addressPattern.test(clientInfo.addressNumber)) {
                return { isValid: false, message: 'Numeración inválida: Solo letras, números y espacios permitidos.' };
            }
            if (clientInfo.addressType === 'apartment') {
                if (!addressPattern.test(clientInfo.floor)) {
                    return { isValid: false, message: 'Piso inválido: Solo letras, números y espacios permitidos.' };
                }
                if (!addressPattern.test(clientInfo.apartmentNumber)) {
                    return { isValid: false, message: 'Número de departamento inválido: Solo letras, números y espacios permitidos.' };
                }
            }
        }
        return { isValid: true, message: '' };
    }

    function showSaveMessage(message, color) {
        saveMessage.textContent = message;
        saveMessage.style.color = color;
    }

    function switchSection(button, section) {
        document.querySelectorAll('.cart-header button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.querySelectorAll('.cart-cont section').forEach(sec => sec.classList.remove('active'));
        section.classList.add('active');
    }

    loadClientInfo();
});
