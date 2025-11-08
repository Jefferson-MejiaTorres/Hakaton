// Script principal para SIDI

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Cerrar menú móvil al hacer click en un enlace
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scroll para todos los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Formulario de predicción
    const predictionForm = document.getElementById('prediction-form');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoContenido = document.getElementById('resultado-contenido');

    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const edad = parseInt(document.getElementById('edad').value);
            const peso = parseFloat(document.getElementById('peso').value);
            const talla = parseFloat(document.getElementById('talla').value);
            const zona = document.getElementById('zona').value;
            const acceso = document.getElementById('acceso').value;
            const nivel = document.getElementById('nivel').value;

            // Calcular IMC infantil aproximado
            const tallaMetros = talla / 100;
            const imc = peso / (tallaMetros * tallaMetros);

            // Algoritmo simplificado de predicción (simulación)
            let riesgo = calcularRiesgo(edad, peso, talla, imc, zona, acceso, nivel);
            
            // Mostrar resultado con animación
            mostrarResultado(riesgo);
        });
    }

    // Función para calcular el riesgo (simulación del modelo de IA)
    function calcularRiesgo(edad, peso, talla, imc, zona, acceso, nivel) {
        let puntosTiesgo = 0;
        
        // Evaluación basada en edad y medidas antropométricas
        // Estas son aproximaciones simplificadas
        
        // Peso por edad (simplificado)
        const pesoEsperado = (edad / 2) + 8; // Fórmula aproximada
        const porcentajePeso = (peso / pesoEsperado) * 100;
        
        if (porcentajePeso < 70) puntosTiesgo += 40;
        else if (porcentajePeso < 80) puntosTiesgo += 30;
        else if (porcentajePeso < 90) puntosTiesgo += 15;
        
        // Talla por edad (simplificado)
        const tallaEsperada = 70 + (edad * 0.8); // Fórmula aproximada
        const porcentajeTalla = (talla / tallaEsperada) * 100;
        
        if (porcentajeTalla < 85) puntosTiesgo += 25;
        else if (porcentajeTalla < 90) puntosTiesgo += 15;
        else if (porcentajeTalla < 95) puntosTiesgo += 5;
        
        // IMC
        if (imc < 14) puntosTiesgo += 20;
        else if (imc < 15) puntosTiesgo += 10;
        
        // Factores sociodemográficos
        if (zona === 'rural') puntosTiesgo += 10;
        if (acceso === 'no') puntosTiesgo += 15;
        if (nivel === 'bajo') puntosTiesgo += 10;
        
        // Determinar nivel de riesgo
        if (puntosTiesgo >= 70) return 'alto';
        else if (puntosTiesgo >= 40) return 'medio';
        else return 'bajo';
    }

    // Función para mostrar el resultado
    function mostrarResultado(riesgo) {
        let color, icono, titulo, mensaje, recomendaciones;
        
        if (riesgo === 'alto') {
            color = 'red';
            icono = 'fa-exclamation-triangle';
            titulo = 'Riesgo Alto de Desnutrición';
            mensaje = 'El análisis indica un riesgo ALTO de desnutrición infantil.';
            recomendaciones = [
                'Intervención médica inmediata requerida',
                'Evaluación nutricional completa urgente',
                'Seguimiento semanal por profesional de salud',
                'Activar protocolos de atención prioritaria',
                'Considerar apoyo psicosocial a la familia'
            ];
        } else if (riesgo === 'medio') {
            color = 'yellow';
            icono = 'fa-exclamation-circle';
            titulo = 'Riesgo Medio de Desnutrición';
            mensaje = 'El análisis indica un riesgo MODERADO que requiere atención.';
            recomendaciones = [
                'Evaluación nutricional en las próximas 48 horas',
                'Seguimiento quincenal recomendado',
                'Revisar hábitos alimenticios familiares',
                'Considerar suplementación nutricional',
                'Educación nutricional a los cuidadores'
            ];
        } else {
            color = 'green';
            icono = 'fa-check-circle';
            titulo = 'Riesgo Bajo de Desnutrición';
            mensaje = 'El análisis indica un riesgo BAJO. Estado nutricional dentro de parámetros normales.';
            recomendaciones = [
                'Mantener controles de crecimiento regulares',
                'Continuar con alimentación balanceada',
                'Seguimiento mensual preventivo',
                'Reforzar prácticas de higiene',
                'Continuar con esquema de vacunación'
            ];
        }

        // Generar HTML del resultado
        let html = `
            <div class="mb-4">
                <div class="inline-block bg-${color}-100 text-${color}-800 px-6 py-3 rounded-full mb-4">
                    <i class="fas ${icono} text-2xl mr-2"></i>
                    <span class="text-xl font-bold">${titulo}</span>
                </div>
                <p class="text-lg text-gray-700 mb-6">${mensaje}</p>
            </div>
            
            <div class="bg-white rounded-lg p-6 text-left">
                <h4 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-clipboard-list text-blue-600 mr-2"></i>
                    Recomendaciones del Sistema:
                </h4>
                <ul class="space-y-3">
                    ${recomendaciones.map(rec => `
                        <li class="flex items-start">
                            <i class="fas fa-check text-${color}-600 mr-3 mt-1"></i>
                            <span class="text-gray-700">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 text-left">
                <p class="text-sm text-gray-700">
                    <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                    <strong>Nota importante:</strong> Este resultado es generado por un sistema de apoyo 
                    a la decisión. Siempre debe ser validado por un profesional de salud calificado. 
                    SIDI es una herramienta complementaria que mejora la eficiencia del trabajo médico.
                </p>
            </div>
            
            <div class="mt-4 text-center">
                <button onclick="document.getElementById('prediction-form').reset(); document.getElementById('resultado').classList.add('hidden');" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    <i class="fas fa-redo mr-2"></i>Realizar Nuevo Análisis
                </button>
            </div>
        `;
        
        resultadoContenido.innerHTML = html;
        resultadoDiv.classList.remove('hidden');
        
        // Scroll suave al resultado
        resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Animación al hacer scroll (aparecer elementos)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observar secciones para animaciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Cambiar estilo del navbar al hacer scroll
    const navbar = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('shadow-xl');
        } else {
            navbar.classList.remove('shadow-xl');
        }
        
        lastScroll = currentScroll;
    });

    // Contador animado para estadísticas
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Activar contadores cuando sean visibles
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const statNumber = entry.target.querySelector('.text-4xl');
                if (statNumber) {
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (!isNaN(number)) {
                        statNumber.textContent = '0';
                        animateCounter(statNumber, number);
                        entry.target.dataset.animated = 'true';
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    // Observar las tarjetas de estadísticas
    document.querySelectorAll('.grid .bg-white').forEach(card => {
        if (card.querySelector('.text-4xl')) {
            statsObserver.observe(card);
        }
    });

    // Easter egg: confetti al hacer click en el logo
    let clickCount = 0;
    const logo = document.querySelector('nav .fa-heartbeat');
    
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            if (clickCount === 5) {
                alert('🎉 ¡Gracias por explorar SIDI! Juntos trabajamos por la salud infantil de Norte de Santander.');
                clickCount = 0;
            }
        });
    }

    // Validación mejorada del formulario
    const formInputs = predictionForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.classList.add('border-red-500');
            } else {
                this.classList.remove('border-red-500');
            }
        });
    });

    console.log('🏥 SIDI - Sistema Inteligente de Detección de Desnutrición Infantil');
    console.log('💚 Pilar: Herramientas TIC para el Trabajo Incluyente y Seguro');
    console.log('🚀 Sistema cargado correctamente');
});

// Función para compartir en redes sociales (opcional)
function compartirProyecto() {
    const texto = 'Conoce SIDI: Sistema Inteligente de Detección de Desnutrición Infantil - Tecnología al servicio de la salud pública';
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'SIDI',
            text: texto,
            url: url
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(url);
        alert('¡Enlace copiado al portapapeles!');
    }
}
