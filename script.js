// Mobile Menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

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

// Chatbot
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickReplies = document.getElementById('quickReplies');

// Chatbot responses database
const responses = {
    programas: {
        text: "Ofrecemos 6 programas presenciales:\n\n1. Programación Web Full Stack\n2. Inteligencia Artificial\n3. Blockchain\n4. Análisis de Datos\n5. Arquitectura en la Nube\n6. Ciberseguridad\n\nTodos son totalmente gratuitos y presenciales. ¿Te gustaría saber más sobre alguno en específico?",
        replies: ['requisitos', 'inscripcion', 'beneficios']
    },
    requisitos: {
        text: "Los requisitos para inscribirte son:\n\n✓ Ser mayor de 18 años\n✓ Tener disponibilidad para asistir presencialmente\n✓ Contar con motivación para aprender tecnología\n✓ Completar el formulario de inscripción\n\n¿Quieres que te ayude con el proceso de inscripción?",
        replies: ['inscripcion', 'programas', 'beneficios']
    },
    beneficios: {
        text: "Los beneficios del programa incluyen:\n\n💰 Educación totalmente gratuita\n🎓 Certificación oficial del Ministerio TIC\n👥 Networking con profesionales del sector\n💼 Mejora de empleabilidad\n🚀 Apoyo al emprendimiento\n🌐 Contribución al cierre de brecha digital\n\n¿Te gustaría inscribirte?",
        replies: ['inscripcion', 'programas', 'requisitos']
    },
    inscripcion: {
        text: "Para inscribirte sigue estos pasos:\n\n1. Completa el formulario de inscripción\n2. Espera la revisión de requisitos\n3. Recibe confirmación por correo\n4. ¡Comienza tu aprendizaje!\n\n¿Quieres abrir el formulario de inscripción ahora?",
        replies: ['abrir_formulario', 'programas', 'contacto']
    },
    abrir_formulario: {
        text: "¡Perfecto! Te voy a redirigir al formulario de inscripción. Asegúrate de tener a mano:\n\n📄 Documento de identidad\n📧 Correo electrónico\n📱 Número de teléfono\n\nAbriendo formulario...",
        action: () => {
            setTimeout(() => {
                window.open('https://forms.zohopublic.com/talentotechoriente6/form/Inscripcin/formperma/j2DUxhOo3o6rOagMB4K_hXDFyM-RVMnN8rBWLLvrqlU', '_blank');
            }, 1000);
        },
        replies: ['programas', 'beneficios']
    },
    contacto: {
        text: "Puedes contactarnos por:\n\n📞 Línea Gratuita: 01-800-0914014\n📧 Email: minticresponde@mintic.gov.co\n🕐 Horario: Lunes a viernes, 8:30 AM - 4:30 PM\n\n¿En qué más puedo ayudarte?",
        replies: ['programas', 'inscripcion', 'beneficios']
    },
    default: {
        text: "Gracias por tu mensaje. Puedo ayudarte con información sobre:\n\n• Programas disponibles\n• Requisitos de inscripción\n• Beneficios del programa\n• Proceso de inscripción\n• Información de contacto\n\n¿Sobre qué te gustaría saber más?",
        replies: ['programas', 'requisitos', 'beneficios', 'inscripcion']
    }
};

const replyLabels = {
    programas: 'Ver programas disponibles',
    requisitos: 'Requisitos de inscripción',
    beneficios: 'Beneficios del programa',
    inscripcion: '¿Cómo me inscribo?',
    abrir_formulario: 'Sí, abrir formulario',
    contacto: 'Información de contacto'
};

// Toggle chatbot
chatbotToggle?.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
    if (chatbotContainer.classList.contains('active')) {
        chatbotToggle.querySelector('.chatbot-badge').style.display = 'none';
        chatbotInput.focus();
    }
});

chatbotClose?.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = isUser ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const p = document.createElement('p');
    p.textContent = text;
    p.style.whiteSpace = 'pre-line';
    
    content.appendChild(p);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    return content;
}

// Add quick replies
function addQuickReplies(replyKeys) {
    const existingReplies = chatbotMessages.querySelector('.quick-replies');
    if (existingReplies) {
        existingReplies.remove();
    }
    
    if (!replyKeys || replyKeys.length === 0) return;
    
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    
    replyKeys.forEach(key => {
        const button = document.createElement('button');
        button.className = 'quick-reply';
        button.textContent = replyLabels[key] || key;
        button.dataset.question = key;
        button.addEventListener('click', () => handleQuickReply(key));
        repliesDiv.appendChild(button);
    });
    
    const lastBotMessage = chatbotMessages.querySelector('.bot-message:last-child .message-content');
    if (lastBotMessage) {
        lastBotMessage.appendChild(repliesDiv);
    }
}

// Handle quick reply
function handleQuickReply(question) {
    const label = replyLabels[question] || question;
    addMessage(label, true);
    
    setTimeout(() => {
        const response = responses[question] || responses.default;
        addMessage(response.text);
        
        if (response.action) {
            response.action();
        }
        
        if (response.replies) {
            addQuickReplies(response.replies);
        }
    }, 500);
}

// Handle user input
function handleUserMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    chatbotInput.value = '';
    
    setTimeout(() => {
        const lowerMessage = message.toLowerCase();
        let response = responses.default;
        
        if (lowerMessage.includes('programa') || lowerMessage.includes('curso')) {
            response = responses.programas;
        } else if (lowerMessage.includes('requisito') || lowerMessage.includes('necesito')) {
            response = responses.requisitos;
        } else if (lowerMessage.includes('beneficio') || lowerMessage.includes('ventaja')) {
            response = responses.beneficios;
        } else if (lowerMessage.includes('inscri') || lowerMessage.includes('registro')) {
            response = responses.inscripcion;
        } else if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('email')) {
            response = responses.contacto;
        }
        
        addMessage(response.text);
        
        if (response.action) {
            response.action();
        }
        
        if (response.replies) {
            addQuickReplies(response.replies);
        }
    }, 500);
}

chatbotSend?.addEventListener('click', handleUserMessage);
chatbotInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});

// Initial quick replies
document.querySelectorAll('.quick-reply').forEach(button => {
    button.addEventListener('click', () => {
        const question = button.dataset.question;
        handleQuickReply(question);
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

console.log('Talento Tech Oriente - Website loaded successfully!');
