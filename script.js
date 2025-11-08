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

    // Formulario de predicción - Sistema de pasos
    const predictionForm = document.getElementById('prediction-form');
    const resultadoDiv = document.getElementById('resultado');
    const resultadoContenido = document.getElementById('resultado-contenido');
    const pasoTipo = document.getElementById('paso-tipo');
    const pasoDatos = document.getElementById('paso-datos');
    const btnVolver = document.getElementById('btn-volver');
    let tipoPersonaSeleccionado = null;

    // Botones de tipo de persona
    const tipoPersonaBtns = document.querySelectorAll('.tipo-persona-btn');
    tipoPersonaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tipoPersonaSeleccionado = this.getAttribute('data-tipo');
            mostrarPasoDatos(tipoPersonaSeleccionado);
        });
    });

    // Botón volver
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            pasoTipo.classList.remove('hidden');
            pasoDatos.classList.add('hidden');
            resultadoDiv.classList.add('hidden');
            tipoPersonaSeleccionado = null;
        });
    }

    // Función para mostrar el paso de datos
    function mostrarPasoDatos(tipo) {
        pasoTipo.classList.add('hidden');
        pasoDatos.classList.remove('hidden');
        
        // Actualizar el badge y configurar campos según el tipo
        const badge = document.getElementById('tipo-seleccionado-badge');
        const labelEdad = document.getElementById('label-edad');
        const inputEdad = document.getElementById('edad');
        
        switch(tipo) {
            case 'bebe':
                badge.innerHTML = '<i class="fas fa-baby mr-2"></i>Bebé (0-12 meses)';
                badge.className = 'inline-block bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mt-2';
                labelEdad.textContent = 'Edad (meses)';
                inputEdad.placeholder = 'Ej: 6';
                inputEdad.max = '12';
                break;
            case 'nino':
                badge.innerHTML = '<i class="fas fa-child mr-2"></i>Niño (1-12 años)';
                badge.className = 'inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mt-2';
                labelEdad.textContent = 'Edad (años)';
                inputEdad.placeholder = 'Ej: 5';
                inputEdad.max = '12';
                break;
            case 'adolescente':
                badge.innerHTML = '<i class="fas fa-user-graduate mr-2"></i>Adolescente (13-17 años)';
                badge.className = 'inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mt-2';
                labelEdad.textContent = 'Edad (años)';
                inputEdad.placeholder = 'Ej: 15';
                inputEdad.max = '17';
                break;
            case 'adulto':
                badge.innerHTML = '<i class="fas fa-user mr-2"></i>Adulto (18+ años)';
                badge.className = 'inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mt-2';
                labelEdad.textContent = 'Edad (años)';
                inputEdad.placeholder = 'Ej: 35';
                inputEdad.max = '120';
                break;
        }
        
        // Limpiar el formulario
        predictionForm.reset();
    }

    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!tipoPersonaSeleccionado) {
                alert('Por favor selecciona el tipo de persona primero');
                return;
            }
            
            // Obtener valores del formulario
            const edad = parseInt(document.getElementById('edad').value);
            const peso = parseFloat(document.getElementById('peso').value);
            const talla = parseFloat(document.getElementById('talla').value);
            const zona = document.getElementById('zona').value;
            const acceso = document.getElementById('acceso').value;
            const nivel = document.getElementById('nivel').value;

            // Calcular IMC
            const tallaMetros = talla / 100;
            const imc = peso / (tallaMetros * tallaMetros);

            // Algoritmo de predicción adaptado al tipo de persona
            let riesgo = calcularRiesgo(edad, peso, talla, imc, zona, acceso, nivel, tipoPersonaSeleccionado);
            
            // Mostrar resultado con animación
            mostrarResultado(riesgo, tipoPersonaSeleccionado);
        });
    }

    // Función para calcular el riesgo (simulación del modelo de IA)
    function calcularRiesgo(edad, peso, talla, imc, zona, acceso, nivel, tipo) {
        let puntosRiesgo = 0;
        
        // Evaluación basada en tipo de persona
        switch(tipo) {
            case 'bebe':
                // Análisis para bebés (0-12 meses)
                const pesoEsperadoBebe = 3.5 + (edad * 0.6); // Peso aproximado en meses
                const porcentajePesoBebe = (peso / pesoEsperadoBebe) * 100;
                
                if (porcentajePesoBebe < 70) puntosRiesgo += 50;
                else if (porcentajePesoBebe < 80) puntosRiesgo += 35;
                else if (porcentajePesoBebe < 90) puntosRiesgo += 20;
                
                const tallaEsperadaBebe = 50 + (edad * 2.5);
                const porcentajeTallaBebe = (talla / tallaEsperadaBebe) * 100;
                
                if (porcentajeTallaBebe < 85) puntosRiesgo += 30;
                else if (porcentajeTallaBebe < 90) puntosRiesgo += 20;
                else if (porcentajeTallaBebe < 95) puntosRiesgo += 10;
                break;
                
            case 'nino':
                // Análisis para niños (1-12 años)
                const pesoEsperadoNino = (edad * 2) + 8;
                const porcentajePesoNino = (peso / pesoEsperadoNino) * 100;
                
                if (porcentajePesoNino < 70) puntosRiesgo += 40;
                else if (porcentajePesoNino < 80) puntosRiesgo += 30;
                else if (porcentajePesoNino < 90) puntosRiesgo += 15;
                
                const tallaEsperadaNino = 75 + (edad * 6);
                const porcentajeTallaNino = (talla / tallaEsperadaNino) * 100;
                
                if (porcentajeTallaNino < 85) puntosRiesgo += 25;
                else if (porcentajeTallaNino < 90) puntosRiesgo += 15;
                else if (porcentajeTallaNino < 95) puntosRiesgo += 5;
                
                // IMC infantil
                if (imc < 14) puntosRiesgo += 20;
                else if (imc < 15) puntosRiesgo += 10;
                break;
                
            case 'adolescente':
                // Análisis para adolescentes (13-17 años)
                const imcBajoAdolescente = edad < 16 ? 17 : 18;
                const imcMuyBajoAdolescente = edad < 16 ? 15 : 16;
                
                if (imc < imcMuyBajoAdolescente) puntosRiesgo += 35;
                else if (imc < imcBajoAdolescente) puntosRiesgo += 20;
                
                // Talla para edad en adolescentes
                const tallaEsperadaAdolescente = edad < 15 ? 150 + (edad - 13) * 7 : 165;
                const porcentajeTallaAdolescente = (talla / tallaEsperadaAdolescente) * 100;
                
                if (porcentajeTallaAdolescente < 90) puntosRiesgo += 15;
                else if (porcentajeTallaAdolescente < 95) puntosRiesgo += 8;
                break;
                
            case 'adulto':
                // Análisis para adultos (18+ años)
                if (imc < 16) puntosRiesgo += 40;
                else if (imc < 17) puntosRiesgo += 30;
                else if (imc < 18.5) puntosRiesgo += 15;
                
                // Para adultos, el peso muy bajo es crítico
                if (peso < 40) puntosRiesgo += 25;
                else if (peso < 45) puntosRiesgo += 15;
                break;
        }
        
        // Factores sociodemográficos (aplican a todos)
        if (zona === 'rural') puntosRiesgo += 10;
        if (acceso === 'no') puntosRiesgo += 15;
        if (nivel === 'bajo') puntosRiesgo += 10;
        
        // Determinar nivel de riesgo
        if (puntosRiesgo >= 70) return 'alto';
        else if (puntosRiesgo >= 40) return 'medio';
        else return 'bajo';
    }

    // Función para mostrar el resultado
    function mostrarResultado(riesgo, tipo) {
        let color, icono, titulo, mensaje, recomendaciones;
        
        // Obtener el nombre del tipo
        const nombreTipo = {
            'bebe': 'Bebé',
            'nino': 'Niño/a',
            'adolescente': 'Adolescente',
            'adulto': 'Adulto/a'
        }[tipo];
        
        if (riesgo === 'alto') {
            color = 'red';
            icono = 'fa-exclamation-triangle';
            titulo = `Riesgo Alto de Desnutrición - ${nombreTipo}`;
            mensaje = `El análisis indica un riesgo ALTO de desnutrición para este ${nombreTipo.toLowerCase()}.`;
            
            // Recomendaciones específicas según tipo
            if (tipo === 'bebe') {
                recomendaciones = [
                    'Intervención pediátrica inmediata requerida',
                    'Evaluación de lactancia materna y alimentación complementaria',
                    'Control médico cada 3-5 días',
                    'Valoración de suplementación nutricional urgente',
                    'Seguimiento del desarrollo psicomotor'
                ];
            } else if (tipo === 'nino') {
                recomendaciones = [
                    'Intervención médica inmediata requerida',
                    'Evaluación nutricional completa urgente',
                    'Seguimiento semanal por profesional de salud',
                    'Activar protocolos de atención prioritaria',
                    'Considerar apoyo psicosocial a la familia'
                ];
            } else if (tipo === 'adolescente') {
                recomendaciones = [
                    'Evaluación médica y nutricional urgente',
                    'Descartar trastornos alimentarios',
                    'Seguimiento semanal especializado',
                    'Apoyo psicológico recomendado',
                    'Educación nutricional personalizada'
                ];
            } else {
                recomendaciones = [
                    'Consulta médica inmediata requerida',
                    'Evaluación de causas subyacentes (enfermedad, económico)',
                    'Plan nutricional urgente personalizado',
                    'Seguimiento semanal por nutricionista',
                    'Valorar apoyo social y económico'
                ];
            }
        } else if (riesgo === 'medio') {
            color = 'yellow';
            icono = 'fa-exclamation-circle';
            titulo = `Riesgo Medio de Desnutrición - ${nombreTipo}`;
            mensaje = `El análisis indica un riesgo MODERADO que requiere atención para este ${nombreTipo.toLowerCase()}.`;
            
            if (tipo === 'bebe') {
                recomendaciones = [
                    'Evaluación pediátrica en las próximas 48 horas',
                    'Revisión de técnicas de alimentación',
                    'Seguimiento quincenal recomendado',
                    'Educación sobre alimentación complementaria',
                    'Monitoreo de curvas de crecimiento'
                ];
            } else if (tipo === 'nino') {
                recomendaciones = [
                    'Evaluación nutricional en las próximas 48 horas',
                    'Seguimiento quincenal recomendado',
                    'Revisar hábitos alimenticios familiares',
                    'Considerar suplementación nutricional',
                    'Educación nutricional a los cuidadores'
                ];
            } else if (tipo === 'adolescente') {
                recomendaciones = [
                    'Consulta con nutricionista en una semana',
                    'Evaluación de hábitos alimenticios',
                    'Seguimiento mensual recomendado',
                    'Educación sobre nutrición adolescente',
                    'Promover hábitos saludables'
                ];
            } else {
                recomendaciones = [
                    'Consulta médica en los próximos 7 días',
                    'Evaluación nutricional recomendada',
                    'Seguimiento mensual sugerido',
                    'Plan de alimentación balanceada',
                    'Considerar factores socioeconómicos'
                ];
            }
        } else {
            color = 'green';
            icono = 'fa-check-circle';
            titulo = `Riesgo Bajo de Desnutrición - ${nombreTipo}`;
            mensaje = `El análisis indica un riesgo BAJO. Estado nutricional dentro de parámetros normales para este ${nombreTipo.toLowerCase()}.`;
            
            if (tipo === 'bebe') {
                recomendaciones = [
                    'Mantener controles pediátricos regulares',
                    'Continuar con lactancia materna exclusiva (si aplica)',
                    'Seguir calendario de vacunación',
                    'Introducir alimentación complementaria adecuada',
                    'Monitoreo mensual preventivo'
                ];
            } else if (tipo === 'nino') {
                recomendaciones = [
                    'Mantener controles de crecimiento regulares',
                    'Continuar con alimentación balanceada',
                    'Seguimiento trimestral preventivo',
                    'Reforzar prácticas de higiene',
                    'Continuar con esquema de vacunación'
                ];
            } else if (tipo === 'adolescente') {
                recomendaciones = [
                    'Mantener chequeos anuales de rutina',
                    'Promover alimentación balanceada',
                    'Fomentar actividad física regular',
                    'Educación sobre nutrición saludable',
                    'Apoyo en desarrollo de hábitos sanos'
                ];
            } else {
                recomendaciones = [
                    'Mantener chequeos médicos anuales',
                    'Continuar con dieta balanceada',
                    'Actividad física regular recomendada',
                    'Mantener hidratación adecuada',
                    'Controles preventivos de rutina'
                ];
            }
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
                <button onclick="location.reload();" 
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
