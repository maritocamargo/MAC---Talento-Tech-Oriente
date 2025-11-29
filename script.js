// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.program-card, .benefit-card, .news-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const privacyCheckbox = document.getElementById('privacy');
    const submitButton = contactForm.querySelector('.btn-submit');
    const formMessage = document.getElementById('formMessage');

    // Validation functions
    function validateName(name) {
        return name.trim().length >= 3;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
        return phoneRegex.test(phone.trim());
    }

    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    function showError(input, errorId, message) {
        input.classList.add('error');
        document.getElementById(errorId).textContent = message;
    }

    function clearError(input, errorId) {
        input.classList.remove('error');
        document.getElementById(errorId).textContent = '';
    }

    // Real-time validation
    nameInput.addEventListener('blur', () => {
        if (!validateName(nameInput.value)) {
            showError(nameInput, 'nameError', 'El nombre debe tener al menos 3 caracteres');
        } else {
            clearError(nameInput, 'nameError');
        }
    });

    emailInput.addEventListener('blur', () => {
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'emailError', 'Ingresa un correo electrónico válido');
        } else {
            clearError(emailInput, 'emailError');
        }
    });

    phoneInput.addEventListener('blur', () => {
        if (!validatePhone(phoneInput.value)) {
            showError(phoneInput, 'phoneError', 'Ingresa un número de teléfono válido');
        } else {
            clearError(phoneInput, 'phoneError');
        }
    });

    messageInput.addEventListener('blur', () => {
        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'messageError', 'El mensaje debe tener al menos 10 caracteres');
        } else {
            clearError(messageInput, 'messageError');
        }
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages
        formMessage.className = 'form-message';
        formMessage.textContent = '';

        // Validate all fields
        let isValid = true;

        if (!validateName(nameInput.value)) {
            showError(nameInput, 'nameError', 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        }

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'emailError', 'Ingresa un correo electrónico válido');
            isValid = false;
        }

        if (!validatePhone(phoneInput.value)) {
            showError(phoneInput, 'phoneError', 'Ingresa un número de teléfono válido');
            isValid = false;
        }

        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'messageError', 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }

        if (!privacyCheckbox.checked) {
            document.getElementById('privacyError').textContent = 'Debes aceptar la política de tratamiento de datos';
            isValid = false;
        } else {
            document.getElementById('privacyError').textContent = '';
        }

        if (!isValid) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Por favor, corrige los errores en el formulario';
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formMessage.className = 'form-message success';
                formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
                contactForm.reset();

                // Clear all error states
                [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
                    input.classList.remove('error');
                });
                ['nameError', 'emailError', 'phoneError', 'messageError', 'privacyError'].forEach(id => {
                    document.getElementById(id).textContent = '';
                });
            } else {
                throw new Error('Error al enviar el formulario');
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.';
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
}

console.log('Talento Tech Oriente - Website loaded successfully with Chatbase integration and Contact Form!');
