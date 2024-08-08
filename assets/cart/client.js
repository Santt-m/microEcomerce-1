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
            const sanitizedClientInfo = sanitizeData(clientInfo);
            localStorage.setItem('clientInfo', JSON.stringify(sanitizedClientInfo));
            console.log('Información del cliente guardada:', sanitizedClientInfo);
            showSaveMessage('Información guardada exitosamente', 'green');
        } else {
            console.error('Error: Información inválida');
            showSaveMessage(validation.message, 'red');
        }
    });

    function sanitizeInput(input) {
        const element = document.createElement('div');
        element.innerText = input;
        return element.innerHTML.trim();
    }

    function sanitizeData(data) {
        const sanitizedData = { ...data };
        for (const key in sanitizedData) {
            if (typeof sanitizedData[key] === 'string') {
                sanitizedData[key] = sanitizedData[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
        }
        return sanitizedData;
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

    function loadClientInfo() {
        const storedClientInfo = localStorage.getItem('clientInfo');
        if (storedClientInfo) {
            const clientInfo = JSON.parse(storedClientInfo);
            const sanitizedClientInfo = sanitizeData(clientInfo);
            document.getElementById('first-name').value = sanitizedClientInfo.firstName;
            document.getElementById('last-name').value = sanitizedClientInfo.lastName;
            document.getElementById('phone-number').value = sanitizedClientInfo.phoneNumber;
            document.querySelector(`input[name="delivery-option"][value="${sanitizedClientInfo.deliveryOption}"]`).checked = true;

            if (sanitizedClientInfo.deliveryOption === 'delivery') {
                deliveryInfoForm.classList.remove('hidden');
                document.getElementById('address').value = sanitizedClientInfo.address;
                document.getElementById('address-number').value = sanitizedClientInfo.addressNumber;
                document.querySelector(`input[name="address-type"][value="${sanitizedClientInfo.addressType}"]`).checked = true;

                if (sanitizedClientInfo.addressType === 'apartment') {
                    apartmentInfo.classList.remove('hidden');
                    document.getElementById('floor').value = sanitizedClientInfo.floor;
                    document.getElementById('apartment-number').value = sanitizedClientInfo.apartmentNumber;
                }
            }
        }
    }

    loadClientInfo();
});

