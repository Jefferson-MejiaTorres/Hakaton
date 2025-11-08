// Script principal para SIDI - Versión Mejorada con Animaciones Profesionales

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar efectos y animaciones
    initScrollIndicator();
    initNavbarEffects();
    initAnimationsOnScroll();
    initParallaxEffects();
    
    // Mobile menu toggle con animación mejorada
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            
            // Animar icono del botón
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
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
        let color, icono, titulo, mensaje, recomendaciones, contextoMedico, indicadoresNutricionales, planAccion;
        
        // Obtener el nombre del tipo
        const nombreTipo = {
            'bebe': 'Bebé',
            'nino': 'Niño/a',
            'adolescente': 'Adolescente',
            'adulto': 'Adulto/a'
        }[tipo];
        
        // Obtener datos del formulario para análisis detallado
        const edad = parseInt(document.getElementById('edad').value);
        const peso = parseFloat(document.getElementById('peso').value);
        const talla = parseFloat(document.getElementById('talla').value);
        const zona = document.getElementById('zona').value;
        const acceso = document.getElementById('acceso').value;
        const nivel = document.getElementById('nivel').value;
        const imc = peso / Math.pow(talla / 100, 2);
        
        if (riesgo === 'alto') {
            color = 'red';
            icono = 'fa-exclamation-triangle';
            titulo = `⚠️ Riesgo Alto de Desnutrición - ${nombreTipo}`;
            mensaje = `El análisis predictivo del sistema SIDI indica un <strong>RIESGO ALTO</strong> de desnutrición para este ${nombreTipo.toLowerCase()}. Los indicadores antropométricos y factores socioeconómicos analizados sugieren la necesidad de intervención médica inmediata.`;
            
            // Contexto médico detallado
            contextoMedico = `
                <div class="bg-red-50 border-l-4 border-red-600 p-4 mb-4">
                    <h5 class="font-bold text-red-900 mb-2">
                        <i class="fas fa-stethoscope mr-2"></i>Análisis Clínico Detallado
                    </h5>
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>IMC Calculado:</strong> ${imc.toFixed(2)} kg/m² - 
                        ${imc < 16 ? 'Severamente bajo' : imc < 17 ? 'Muy bajo' : 'Por debajo del rango saludable'}
                    </p>
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>Factores de Riesgo Identificados:</strong>
                    </p>
                    <ul class="text-sm text-gray-700 ml-4 list-disc">
                        <li>Peso: ${peso} kg - Talla: ${talla} cm (Relación peso/talla crítica)</li>
                        ${zona === 'rural' ? '<li>Zona rural: Acceso limitado a servicios de salud especializados</li>' : ''}
                        ${acceso === 'no' ? '<li>Sin acceso regular a servicios de salud (Factor crítico)</li>' : ''}
                        ${nivel === 'bajo' ? '<li>Nivel socioeconómico bajo: Mayor vulnerabilidad nutricional</li>' : ''}
                    </ul>
                </div>
            `;
            
            // Indicadores nutricionales
            indicadoresNutricionales = `
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <h5 class="font-bold text-orange-900 mb-3">
                        <i class="fas fa-chart-bar mr-2"></i>Indicadores Nutricionales Críticos
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div class="bg-white p-3 rounded border-l-4 border-red-500">
                            <div class="font-semibold text-gray-700">Estado Nutricional</div>
                            <div class="text-red-600 font-bold">Desnutrición Aguda</div>
                            <div class="text-xs text-gray-600 mt-1">Requiere intervención urgente</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-orange-500">
                            <div class="font-semibold text-gray-700">Prioridad de Atención</div>
                            <div class="text-orange-600 font-bold">ALTA - Código Rojo</div>
                            <div class="text-xs text-gray-600 mt-1">Máximo 24-48 horas</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-yellow-500">
                            <div class="font-semibold text-gray-700">Riesgo de Complicaciones</div>
                            <div class="text-yellow-700 font-bold">Elevado</div>
                            <div class="text-xs text-gray-600 mt-1">Sistema inmune comprometido</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-purple-500">
                            <div class="font-semibold text-gray-700">Tipo de Desnutrición</div>
                            <div class="text-purple-600 font-bold">Posible Mixta</div>
                            <div class="text-xs text-gray-600 mt-1">Peso y talla afectados</div>
                        </div>
                    </div>
                </div>
            `;
            
            // Recomendaciones específicas según tipo
            if (tipo === 'bebe') {
                recomendaciones = [
                    '<strong>Urgente - Evaluación pediátrica inmediata:</strong> Remitir a servicio de urgencias pediátricas en las próximas 24 horas. Evaluar signos de deshidratación, hipoglucemia y compromiso del estado general.',
                    '<strong>Análisis de laboratorio completo:</strong> Hemograma, perfil metabólico, electrolitos, proteínas séricas (albúmina, prealbúmina) para determinar el estado nutricional y detectar deficiencias específicas.',
                    '<strong>Evaluación de lactancia y alimentación:</strong> Valorar técnica de amamantamiento, producción de leche materna, introducción de fórmula si es necesario. Evaluar alimentación complementaria según edad.',
                    '<strong>Protocolo de recuperación nutricional:</strong> Iniciar fase de estabilización con fórmulas terapéuticas si se requiere hospitalización. Monitoreo estricto de ingesta calórica y peso diario.',
                    '<strong>Seguimiento intensivo:</strong> Controles cada 3-5 días durante el primer mes. Monitoreo de curvas de crecimiento OMS. Evaluación del desarrollo psicomotor.',
                    '<strong>Educación a cuidadores:</strong> Capacitación en preparación de alimentos, higiene, reconocimiento de signos de alarma. Apoyo psicosocial y evaluación del entorno familiar.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Plan de Acción Inmediato (Próximas 72 horas)
                        </h5>
                        <ol class="text-sm space-y-2 ml-4 list-decimal text-gray-700">
                            <li><strong>Hora 0:</strong> Contacto telefónico con familia. Cita urgente en centro de salud.</li>
                            <li><strong>Día 1:</strong> Evaluación médica completa. Toma de muestras de laboratorio. Inicio de intervención nutricional.</li>
                            <li><strong>Día 2:</strong> Resultados de laboratorio. Ajuste del plan nutricional. Educación a cuidadores.</li>
                            <li><strong>Día 3:</strong> Primera valoración de respuesta. Decisión sobre manejo ambulatorio u hospitalización.</li>
                        </ol>
                    </div>
                `;
                
            } else if (tipo === 'nino') {
                recomendaciones = [
                    '<strong>Intervención médica urgente (24-48h):</strong> Evaluación integral por pediatría. Descartar enfermedades subyacentes (parasitosis, infecciones crónicas, malabsorción intestinal, celiaquía).',
                    '<strong>Estudios diagnósticos completos:</strong> Hemograma con VSG, proteínas totales y fraccionadas, perfil tiroideo, coprocultivo y coproparasitológico seriado, vitaminas (A, D, B12, ácido fólico), zinc y hierro sérico.',
                    '<strong>Plan nutricional terapéutico:</strong> Dieta hipercalórica e hiperproteica adaptada a la edad. Fórmulas de alto valor nutricional. Suplementación con micronutrientes específicos según déficits detectados.',
                    '<strong>Evaluación y tratamiento odontológico:</strong> La salud bucal afecta directamente la alimentación. Tratamiento de caries y problemas de masticación.',
                    '<strong>Programa de seguimiento estructurado:</strong> Controles semanales el primer mes, quincenales el segundo mes, mensuales posteriormente. Registro de peso, talla, perímetro cefálico y braquial.',
                    '<strong>Apoyo psicosocial integral:</strong> Evaluación del entorno familiar y socioeconómico. Vinculación con programas de apoyo alimentario (PAE, ICBF). Trabajo social para gestión de ayudas gubernamentales.',
                    '<strong>Educación nutricional familiar:</strong> Talleres prácticos de preparación de alimentos nutritivos de bajo costo. Guías de alimentación saludable adaptadas al contexto socioeconómico.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Protocolo de Recuperación Nutricional (30 días)
                        </h5>
                        <div class="text-sm space-y-3 text-gray-700">
                            <div class="bg-white p-3 rounded">
                                <strong class="text-red-600">Semana 1:</strong> Evaluación inicial completa + Inicio de intervención nutricional intensiva + Educación familiar
                            </div>
                            <div class="bg-white p-3 rounded">
                                <strong class="text-orange-600">Semana 2:</strong> Ajuste del plan según respuesta + Resultados de laboratorio + Suplementación específica
                            </div>
                            <div class="bg-white p-3 rounded">
                                <strong class="text-yellow-600">Semana 3:</strong> Evaluación de progreso + Refuerzo educativo + Vinculación con programas de apoyo
                            </div>
                            <div class="bg-white p-3 rounded">
                                <strong class="text-green-600">Semana 4:</strong> Valoración final del primer ciclo + Definición de plan de seguimiento a largo plazo
                            </div>
                        </div>
                    </div>
                `;
                
            } else if (tipo === 'adolescente') {
                recomendaciones = [
                    '<strong>Evaluación médica y psicológica urgente:</strong> Descartar trastornos de la conducta alimentaria (anorexia, bulimia, trastorno por atracón). Evaluación por psiquiatría o psicología especializada en adolescentes.',
                    '<strong>Estudios complementarios especializados:</strong> Además de análisis básicos, considerar: densitometría ósea, evaluación hormonal completa (incluir hormonas tiroideas, sexuales, cortisol), electrocardiograma si IMC < 16.',
                    '<strong>Abordaje multidisciplinario:</strong> Equipo integrado por médico, nutricionista, psicólogo/psiquiatra, trabajador social. Involucrar activamente al adolescente en su tratamiento respetando su autonomía.',
                    '<strong>Plan nutricional personalizado:</strong> Diseñado específicamente para adolescentes, considerando necesidades del crecimiento y desarrollo puberal. Evitar restricciones extremas que puedan reforzar trastornos alimentarios.',
                    '<strong>Intervención psicosocial:</strong> Terapia cognitivo-conductual si hay indicios de TCA. Grupos de apoyo para adolescentes. Trabajo con la familia sobre dinámicas alimentarias saludables.',
                    '<strong>Seguimiento semanal inicial:</strong> Monitoreo estrecho durante el primer mes con valoraciones médicas, nutricionales y psicológicas. Evaluación de adherencia al tratamiento.',
                    '<strong>Educación en salud integral:</strong> Talleres sobre nutrición, imagen corporal saludable, manejo del estrés, autoestima. Prevención de trastornos alimentarios.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Ruta de Atención Especializada para Adolescentes
                        </h5>
                        <div class="text-sm space-y-2 text-gray-700">
                            <div class="flex items-start">
                                <span class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                                <div><strong>Evaluación inicial integral:</strong> Médica, nutricional y psicológica en menos de 48 horas</div>
                            </div>
                            <div class="flex items-start">
                                <span class="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                                <div><strong>Diagnóstico diferencial:</strong> Descartar TCA, enfermedades orgánicas, problemas psicosociales</div>
                            </div>
                            <div class="flex items-start">
                                <span class="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                                <div><strong>Plan terapéutico personalizado:</strong> Nutricional + Psicológico + Médico (considerar hospitalización si IMC < 15)</div>
                            </div>
                            <div class="flex items-start">
                                <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                                <div><strong>Seguimiento multidisciplinario:</strong> Semanal primer mes, quincenal segundo y tercer mes, mensual posteriormente</div>
                            </div>
                        </div>
                    </div>
                `;
                
            } else { // adulto
                recomendaciones = [
                    '<strong>Consulta médica urgente (48-72h):</strong> Evaluación por medicina interna o medicina familiar. Descartar causas orgánicas: cáncer, hipertiroidismo, diabetes no controlada, enfermedades gastrointestinales, tuberculosis, VIH.',
                    '<strong>Batería completa de estudios:</strong> Hemograma completo, química sanguínea, pruebas hepáticas y renales, perfil tiroideo, marcadores tumorales si se sospecha cáncer, serología para VIH y hepatitis, radiografía de tórax.',
                    '<strong>Evaluación nutricional especializada:</strong> Valoración por nutricionista especializado en adultos. Análisis de composición corporal. Identificación de deficiencias de macro y micronutrientes.',
                    '<strong>Investigación de causas subyacentes:</strong> Evaluación socioeconómica (inseguridad alimentaria, desempleo), problemas de salud mental (depresión, ansiedad), adicciones (alcohol, drogas), aislamiento social.',
                    '<strong>Plan de recuperación nutricional:</strong> Dieta personalizada con incremento calórico gradual (evitar síndrome de realimentación). Suplementación nutricional oral si es necesario. Considerar soporte nutricional enteral en casos severos.',
                    '<strong>Apoyo psicosocial y seguimiento:</strong> Evaluación por trabajo social. Vinculación con programas de apoyo alimentario y económico. Seguimiento semanal durante el primer mes, quincenal posteriormente.',
                    '<strong>Educación y empoderamiento:</strong> Capacitación en preparación de alimentos nutritivos de bajo costo. Estrategias para mejorar acceso a alimentos. Grupos de apoyo comunitario.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Protocolo de Intervención para Adultos
                        </h5>
                        <div class="text-sm space-y-2 text-gray-700">
                            <p class="font-semibold mb-2">Fase 1 - Evaluación y Estabilización (Semana 1-2):</p>
                            <ul class="ml-4 list-disc space-y-1">
                                <li>Estudios diagnósticos completos para identificar causa</li>
                                <li>Estabilización médica si hay complicaciones agudas</li>
                                <li>Inicio de soporte nutricional con precaución (síndrome de realimentación)</li>
                            </ul>
                            <p class="font-semibold mb-2 mt-3">Fase 2 - Recuperación Intensiva (Semana 3-8):</p>
                            <ul class="ml-4 list-disc space-y-1">
                                <li>Incremento progresivo de aporte calórico</li>
                                <li>Tratamiento de patologías subyacentes</li>
                                <li>Seguimiento semanal de peso y parámetros bioquímicos</li>
                            </ul>
                            <p class="font-semibold mb-2 mt-3">Fase 3 - Mantenimiento (Mes 3 en adelante):</p>
                            <ul class="ml-4 list-disc space-y-1">
                                <li>Consolidación de peso objetivo</li>
                                <li>Seguimiento mensual</li>
                                <li>Prevención de recaídas</li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        } else if (riesgo === 'medio') {
            color = 'yellow';
            icono = 'fa-exclamation-circle';
            titulo = `⚠️ Riesgo Moderado de Desnutrición - ${nombreTipo}`;
            mensaje = `El sistema SIDI ha identificado un <strong>RIESGO MODERADO</strong> de desnutrición para este ${nombreTipo.toLowerCase()}. Aunque no es una emergencia médica inmediata, se requiere atención profesional oportuna para prevenir el deterioro del estado nutricional.`;
            
            // Contexto médico para riesgo medio
            contextoMedico = `
                <div class="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-4">
                    <h5 class="font-bold text-yellow-900 mb-2">
                        <i class="fas fa-stethoscope mr-2"></i>Evaluación Nutricional Preventiva
                    </h5>
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>IMC Actual:</strong> ${imc.toFixed(2)} kg/m² - 
                        ${imc < 18 ? 'Ligeramente por debajo del rango saludable' : 'En límite inferior del rango normal'}
                    </p>
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>Factores de Atención:</strong>
                    </p>
                    <ul class="text-sm text-gray-700 ml-4 list-disc">
                        <li>Relación peso/talla requiere monitoreo (Peso: ${peso} kg - Talla: ${talla} cm)</li>
                        ${zona === 'rural' ? '<li>Residencia en zona rural: Planificar accesibilidad a seguimiento</li>' : ''}
                        ${acceso === 'no' ? '<li>Acceso limitado a servicios de salud: Priorizar estrategias de seguimiento</li>' : ''}
                        ${nivel === 'bajo' ? '<li>Situación socioeconómica: Considerar apoyo alimentario complementario</li>' : ''}
                    </ul>
                    <p class="text-sm text-gray-700 mt-2 font-semibold text-yellow-800">
                        ⏰ Ventana de oportunidad: La intervención temprana puede prevenir deterioro a riesgo alto
                    </p>
                </div>
            `;
            
            // Indicadores nutricionales moderados
            indicadoresNutricionales = `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h5 class="font-bold text-yellow-900 mb-3">
                        <i class="fas fa-chart-line mr-2"></i>Indicadores de Alerta Temprana
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div class="bg-white p-3 rounded border-l-4 border-yellow-500">
                            <div class="font-semibold text-gray-700">Estado Nutricional</div>
                            <div class="text-yellow-600 font-bold">Riesgo Nutricional</div>
                            <div class="text-xs text-gray-600 mt-1">Intervención preventiva necesaria</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-orange-400">
                            <div class="font-semibold text-gray-700">Prioridad de Atención</div>
                            <div class="text-orange-600 font-bold">MEDIA - Código Amarillo</div>
                            <div class="text-xs text-gray-600 mt-1">Evaluación en 48-72 horas</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                            <div class="font-semibold text-gray-700">Potencial de Recuperación</div>
                            <div class="text-blue-600 font-bold">Alto</div>
                            <div class="text-xs text-gray-600 mt-1">Respuesta favorable esperada</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-green-500">
                            <div class="font-semibold text-gray-700">Pronóstico</div>
                            <div class="text-green-600 font-bold">Favorable con intervención</div>
                            <div class="text-xs text-gray-600 mt-1">Prevención efectiva posible</div>
                        </div>
                    </div>
                </div>
            `;
            
            if (tipo === 'bebe') {
                recomendaciones = [
                    '<strong>Evaluación pediátrica en 48-72 horas:</strong> Consulta con pediatría para valoración completa del crecimiento. Revisar curva de crecimiento según percentiles OMS. Descartar patologías que afecten el estado nutricional.',
                    '<strong>Optimización de la lactancia materna:</strong> Si lactancia materna exclusiva: evaluar técnica de agarre, posición, frecuencia de tomas, producción de leche. Si lactancia mixta: revisar cantidad y preparación de fórmula. Consulta con especialista en lactancia si es necesario.',
                    '<strong>Revisión de alimentación complementaria:</strong> Si tiene más de 6 meses, evaluar introducción adecuada de alimentos sólidos. Consistencia, variedad, cantidad y frecuencia según edad. Educación sobre alimentación perceptiva.',
                    '<strong>Análisis básico de laboratorio:</strong> Hemograma para descartar anemia. Evaluar necesidad de suplementación con hierro, vitamina D. Perfil básico si hay factores de riesgo adicionales.',
                    '<strong>Seguimiento quincenal primer mes:</strong> Monitoreo de peso, talla y perímetro cefálico cada 15 días. Ajuste del plan nutricional según respuesta. Registro en carné de crecimiento y desarrollo.',
                    '<strong>Educación a cuidadores:</strong> Taller práctico sobre preparación de papillas y alimentos complementarios. Higiene en la alimentación. Señales de alerta nutricional. Estimulación del desarrollo infantil.',
                    '<strong>Evaluación del entorno familiar:</strong> Identificar factores que pueden estar afectando la alimentación del bebé. Apoyo emocional a la madre/cuidador. Vinculación con grupos de apoyo a la lactancia.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Plan de Monitoreo y Prevención (60 días)
                        </h5>
                        <div class="text-sm space-y-3 text-gray-700">
                            <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                                <strong>Días 1-3:</strong> Cita con pediatría. Evaluación nutricional. Laboratorios básicos. Educación inicial a cuidadores.
                            </div>
                            <div class="bg-white p-3 rounded border-l-4 border-green-500">
                                <strong>Día 15:</strong> Primera evaluación de seguimiento. Peso y talla. Ajuste de recomendaciones según respuesta.
                            </div>
                            <div class="bg-white p-3 rounded border-l-4 border-yellow-500">
                                <strong>Día 30:</strong> Segunda evaluación. Análisis de curva de crecimiento. Refuerzo educativo. Resultados de laboratorio.
                            </div>
                            <div class="bg-white p-3 rounded border-l-4 border-purple-500">
                                <strong>Día 60:</strong> Evaluación final del ciclo. Decisión sobre continuidad del seguimiento intensivo o paso a control rutinario.
                            </div>
                        </div>
                        <div class="mt-3 p-3 bg-green-50 rounded">
                            <strong class="text-green-800">Meta:</strong> <span class="text-gray-700">Recuperación de curva de crecimiento adecuada. Peso y talla en percentil apropiado según edad.</span>
                        </div>
                    </div>
                `;
                
            } else if (tipo === 'nino') {
                recomendaciones = [
                    '<strong>Consulta médica programada (48-72h):</strong> Evaluación por pediatría o medicina familiar. Análisis de curva de crecimiento de los últimos 6-12 meses. Historia clínica completa incluyendo antecedentes de enfermedades recurrentes.',
                    '<strong>Evaluación de hábitos alimentarios:</strong> Diario de alimentación por 3-5 días. Análisis de frecuencia, cantidad y calidad de comidas. Identificar preferencias, rechazos alimentarios y ambiente familiar durante las comidas.',
                    '<strong>Estudios de laboratorio selectivos:</strong> Hemograma completo, ferritina, vitamina D, zinc. Coproparasitológico si hay factores de riesgo. TSH si hay sospecha de problemas tiroideos. Evaluar según hallazgos clínicos.',
                    '<strong>Plan nutricional preventivo:</strong> Diseño de menús balanceados adaptados a la edad y preferencias del niño. Incremento calórico moderado (10-20% sobre requerimiento basal). Inclusión de alimentos densamente nutritivos.',
                    '<strong>Educación nutricional familiar:</strong> Taller práctico con padres/cuidadores sobre alimentación infantil saludable. Estrategias para manejo de selectividad alimentaria. Recetas económicas y nutritivas.',
                    '<strong>Evaluación psicosocial:</strong> Identificar factores familiares, económicos o emocionales que afecten la alimentación. Ambiente durante las comidas. Dinámicas familiares. Acceso a alimentos.',
                    '<strong>Seguimiento estructurado:</strong> Control quincenal el primer mes con medición de peso y talla. Luego mensual por 3 meses. Registro fotográfico del progreso. Ajustes según evolución.',
                    '<strong>Vinculación con programas de apoyo:</strong> Programa de Alimentación Escolar (PAE) si aplica. ICBF - Modalidad de nutrición. Banco de alimentos local. Programas municipales de seguridad alimentaria.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Estrategia de Recuperación Nutricional (3 meses)
                        </h5>
                        <div class="text-sm text-gray-700">
                            <div class="mb-4">
                                <strong class="text-blue-800 block mb-2">🎯 Objetivos Principales:</strong>
                                <ul class="ml-4 list-disc space-y-1">
                                    <li>Incremento de peso de 0.5-1 kg por mes (según edad)</li>
                                    <li>Mejora en velocidad de crecimiento lineal</li>
                                    <li>Establecimiento de hábitos alimentarios saludables</li>
                                    <li>Normalización de parámetros bioquímicos</li>
                                </ul>
                            </div>
                            <div class="space-y-2">
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-orange-600">Mes 1 - Fase de Adaptación:</strong>
                                    <p class="text-xs mt-1">Evaluación inicial + Plan nutricional + Educación familiar + Control quincenal</p>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-yellow-600">Mes 2 - Fase de Progreso:</strong>
                                    <p class="text-xs mt-1">Ajuste del plan + Suplementación si necesario + Seguimiento mensual + Refuerzo educativo</p>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-green-600">Mes 3 - Fase de Consolidación:</strong>
                                    <p class="text-xs mt-1">Evaluación de logros + Mantenimiento + Definir frecuencia de seguimiento a largo plazo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
            } else if (tipo === 'adolescente') {
                recomendaciones = [
                    '<strong>Evaluación médica integral (72 horas):</strong> Consulta con medicina del adolescente o medicina familiar. Evaluación de desarrollo puberal, cambios corporales y crecimiento remanente esperado.',
                    '<strong>Screening de salud mental:</strong> Evaluación inicial de riesgo de trastornos alimentarios mediante cuestionarios validados (EAT-26, SCOFF). Indagar sobre imagen corporal, dietas restrictivas, ejercicio excesivo.',
                    '<strong>Análisis de estilo de vida:</strong> Evaluación de rutinas alimentarias, actividad física, patrón de sueño, manejo del estrés. Influencia de redes sociales y grupo de pares en hábitos alimentarios.',
                    '<strong>Laboratorios orientados:</strong> Hemograma, perfil bioquímico, hormonas tiroideas. Si es mujer: evaluar ciclos menstruales y considerar perfil hormonal. Vitamina D, B12, hierro sérico.',
                    '<strong>Plan nutricional para adolescentes:</strong> Diseño participativo con el adolescente (empoderamiento). Dieta balanceada considerando necesidades de crecimiento y desarrollo. Evitar restricciones extremas.',
                    '<strong>Educación en nutrición y salud:</strong> Talleres interactivos sobre nutrición basada en evidencia. Desmitificación de dietas de moda. Alimentación saludable vs. dietas restrictivas. Manejo saludable del peso.',
                    '<strong>Apoyo psicosocial preventivo:</strong> Espacios de escucha activa. Trabajo en autoestima y autopercepción. Manejo de presión social. Grupos de apoyo para adolescentes si está disponible.',
                    '<strong>Seguimiento mensual:</strong> Controles mensuales durante 3 meses. Monitoreo de peso, talla, evolución puberal. Evaluación continua de aspectos emocionales y conducta alimentaria.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Programa Integral para Adolescentes (3 meses)
                        </h5>
                        <div class="text-sm text-gray-700">
                            <p class="mb-3 text-blue-800 font-semibold">Enfoque multidimensional centrado en el adolescente:</p>
                            <div class="space-y-2 mb-3">
                                <div class="flex items-start bg-white p-2 rounded">
                                    <span class="text-2xl mr-3">🏥</span>
                                    <div>
                                        <strong>Componente Médico:</strong> Evaluación inicial + Laboratorios + Seguimiento mensual + Monitoreo de desarrollo
                                    </div>
                                </div>
                                <div class="flex items-start bg-white p-2 rounded">
                                    <span class="text-2xl mr-3">🥗</span>
                                    <div>
                                        <strong>Componente Nutricional:</strong> Plan personalizado + Educación nutricional + Talleres prácticos + Ajustes según progreso
                                    </div>
                                </div>
                                <div class="flex items-start bg-white p-2 rounded">
                                    <span class="text-2xl mr-3">🧠</span>
                                    <div>
                                        <strong>Componente Psicoemocional:</strong> Evaluación de salud mental + Apoyo emocional + Trabajo en autoestima
                                    </div>
                                </div>
                                <div class="flex items-start bg-white p-2 rounded">
                                    <span class="text-2xl mr-3">👨‍👩‍👧</span>
                                    <div>
                                        <strong>Componente Familiar:</strong> Orientación a padres + Mejora de dinámicas familiares + Apoyo conjunto
                                    </div>
                                </div>
                            </div>
                            <div class="bg-green-100 p-3 rounded mt-3">
                                <strong class="text-green-800">✓ Resultado Esperado:</strong>
                                <p class="text-sm mt-1">Recuperación nutricional + Hábitos saludables sostenibles + Bienestar emocional + Prevención de trastornos alimentarios</p>
                            </div>
                        </div>
                    </div>
                `;
                
            } else { // adulto
                recomendaciones = [
                    '<strong>Consulta médica en 72 horas:</strong> Evaluación por medicina interna o familiar. Historia clínica completa. Revisión de medicamentos que puedan afectar el peso. Identificación de factores de riesgo.',
                    '<strong>Evaluación nutricional detallada:</strong> Análisis de ingesta mediante recordatorio de 24 horas o diario alimentario. Identificar patrones alimentarios, horarios, preferencias. Evaluar acceso a alimentos y recursos económicos.',
                    '<strong>Estudios de laboratorio básicos:</strong> Hemograma, química sanguínea (glicemia, función renal y hepática), perfil lipídico, proteínas totales y albúmina, TSH. Complementar según hallazgos clínicos.',
                    '<strong>Investigación de causas contribuyentes:</strong> Evaluar enfermedades crónicas no diagnosticadas. Salud bucal y dental (capacidad de masticación). Problemas gastrointestinales. Medicamentos con efecto anorexígeno.',
                    '<strong>Plan nutricional personalizado:</strong> Dieta normocalórica a hipercalórica según necesidad (incremento gradual). Fraccionamiento de comidas (5-6 al día). Enfoque en densidad nutricional. Suplementos si es necesario.',
                    '<strong>Evaluación psicosocial:</strong> Screening de depresión y ansiedad. Situación laboral y económica. Red de apoyo social. Acceso a programas de asistencia alimentaria. Evaluación de adicciones.',
                    '<strong>Seguimiento programado:</strong> Control mensual durante 3 meses iniciales. Medición de peso, evaluación clínica, adherencia al plan. Ajustes según respuesta. Motivación y apoyo continuo.',
                    '<strong>Estrategias de apoyo comunitario:</strong> Vinculación con bancos de alimentos. Programas de apoyo nutricional municipal. Grupos de apoyo comunitario. Orientación sobre programas sociales disponibles.'
                ];
                
                planAccion = `
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-bold text-blue-900 mb-3">
                            <i class="fas fa-clipboard-check mr-2"></i>Plan de Recuperación para Adultos (3 meses)
                        </h5>
                        <div class="text-sm text-gray-700">
                            <div class="mb-3">
                                <p class="font-semibold mb-2 text-blue-800">Enfoque Integral y Sostenible:</p>
                                <div class="bg-white p-3 rounded mb-2">
                                    <strong class="text-gray-800">📋 Evaluación Inicial (Semana 1):</strong>
                                    <ul class="text-xs mt-1 ml-4 list-disc">
                                        <li>Consulta médica y nutricional completa</li>
                                        <li>Laboratorios básicos y específicos según hallazgos</li>
                                        <li>Evaluación psicosocial y de recursos</li>
                                        <li>Diseño del plan nutricional individualizado</li>
                                    </ul>
                                </div>
                                <div class="bg-white p-3 rounded mb-2">
                                    <strong class="text-gray-800">🎯 Fase de Intervención (Semana 2-12):</strong>
                                    <ul class="text-xs mt-1 ml-4 list-disc">
                                        <li>Incremento calórico progresivo y controlado</li>
                                        <li>Suplementación nutricional si es necesaria</li>
                                        <li>Educación y empoderamiento nutricional</li>
                                        <li>Seguimiento mensual con ajustes</li>
                                        <li>Apoyo psicosocial continuo</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded">
                                <strong class="text-green-800">🎉 Meta a 3 Meses:</strong>
                                <p class="text-xs mt-1">Ganancia de 3-5 kg, mejoría en parámetros bioquímicos, establecimiento de hábitos alimentarios saludables y sostenibles</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            color = 'green';
            icono = 'fa-check-circle';
            titulo = `✅ Riesgo Bajo de Desnutrición - ${nombreTipo}`;
            mensaje = `El sistema SIDI indica un <strong>RIESGO BAJO</strong> de desnutrición. El ${nombreTipo.toLowerCase()} presenta indicadores nutricionales dentro de parámetros normales. Es importante mantener estos buenos hábitos y continuar con los controles preventivos.`;
            
            // Contexto médico para riesgo bajo
            contextoMedico = `
                <div class="bg-green-50 border-l-4 border-green-600 p-4 mb-4">
                    <h5 class="font-bold text-green-900 mb-2">
                        <i class="fas fa-check-circle mr-2"></i>Estado Nutricional Saludable
                    </h5>
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>IMC Actual:</strong> ${imc.toFixed(2)} kg/m² - Dentro del rango saludable
                    </p>
                    <p class="text-sm text-gray-700 mb-2">
                        <strong>Indicadores Positivos:</strong>
                    </p>
                    <ul class="text-sm text-gray-700 ml-4 list-disc">
                        <li>Relación peso/talla adecuada (Peso: ${peso} kg - Talla: ${talla} cm)</li>
                        <li>Indicadores antropométricos en rango normal para la edad</li>
                        <li>Mantener seguimiento preventivo según calendario de salud</li>
                    </ul>
                    <p class="text-sm text-gray-700 mt-2 font-semibold text-green-800">
                        ✓ Continuar con hábitos saludables y controles de rutina
                    </p>
                </div>
            `;
            
            // Indicadores nutricionales saludables
            indicadoresNutricionales = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h5 class="font-bold text-green-900 mb-3">
                        <i class="fas fa-heart mr-2"></i>Indicadores de Salud Óptima
                    </h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div class="bg-white p-3 rounded border-l-4 border-green-500">
                            <div class="font-semibold text-gray-700">Estado Nutricional</div>
                            <div class="text-green-600 font-bold">Normal - Saludable</div>
                            <div class="text-xs text-gray-600 mt-1">Mantener hábitos actuales</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-blue-500">
                            <div class="font-semibold text-gray-700">Seguimiento</div>
                            <div class="text-blue-600 font-bold">Preventivo - Rutinario</div>
                            <div class="text-xs text-gray-600 mt-1">Según calendario de salud</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-purple-500">
                            <div class="font-semibold text-gray-700">Pronóstico</div>
                            <div class="text-purple-600 font-bold">Excelente</div>
                            <div class="text-xs text-gray-600 mt-1">Crecimiento adecuado</div>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-yellow-500">
                            <div class="font-semibold text-gray-700">Recomendación</div>
                            <div class="text-yellow-700 font-bold">Mantenimiento</div>
                            <div class="text-xs text-gray-600 mt-1">Continuar cuidados actuales</div>
                        </div>
                    </div>
                </div>
            `;
            
            if (tipo === 'bebe') {
                recomendaciones = [
                    '<strong>Controles pediátricos regulares:</strong> Mantener seguimiento según cronograma establecido (mensual en menores de 6 meses, bimensual de 6-12 meses). Registro de peso, talla y perímetro cefálico en cada consulta.',
                    '<strong>Lactancia materna exclusiva hasta los 6 meses:</strong> Si es posible, continuar con lactancia materna exclusiva. Beneficios para el sistema inmune, vínculo afectivo y desarrollo óptimo. Apoyo a la madre lactante.',
                    '<strong>Introducción adecuada de alimentación complementaria:</strong> A partir de los 6 meses, introducir gradualmente alimentos sólidos. Variedad de texturas y sabores. Respetar señales de hambre y saciedad del bebé.',
                    '<strong>Calendario de vacunación completo:</strong> Cumplir con el esquema de vacunación nacional. Las vacunas protegen contra enfermedades que pueden afectar el estado nutricional.',
                    '<strong>Estimulación temprana:</strong> Actividades de estimulación según la edad que favorezcan el desarrollo psicomotor, cognitivo y social. Tiempo de calidad con cuidadores.',
                    '<strong>Higiene y prevención de infecciones:</strong> Lavado de manos frecuente. Preparación higiénica de alimentos. Limpieza de utensilios. Estas prácticas previenen enfermedades diarreicas que afectan el estado nutricional.'
                ];
                
                planAccion = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 class="font-bold text-green-900 mb-3">
                            <i class="fas fa-star mr-2"></i>Plan de Mantenimiento Preventivo
                        </h5>
                        <div class="text-sm text-gray-700 space-y-2">
                            <div class="flex items-center bg-white p-3 rounded">
                                <span class="text-3xl mr-3">🍼</span>
                                <div>
                                    <strong>Nutrición Óptima:</strong> Continuar con lactancia materna o fórmula adecuada + alimentación complementaria balanceada según edad
                                </div>
                            </div>
                            <div class="flex items-center bg-white p-3 rounded">
                                <span class="text-3xl mr-3">📅</span>
                                <div>
                                    <strong>Controles Regulares:</strong> Seguir calendario de crecimiento y desarrollo + vacunación completa
                                </div>
                            </div>
                            <div class="flex items-center bg-white p-3 rounded">
                                <span class="text-3xl mr-3">🧸</span>
                                <div>
                                    <strong>Desarrollo Integral:</strong> Estimulación temprana + juego + vínculo afectivo seguro
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (tipo === 'nino') {
                recomendaciones = [
                    '<strong>Controles de crecimiento y desarrollo:</strong> Consultas pediátricas trimestrales o semestrales según la edad. Monitoreo de curvas de crecimiento. Evaluación del desarrollo según hitos esperados.',
                    '<strong>Alimentación balanceada y variada:</strong> Dieta que incluya todos los grupos alimenticios. 3 comidas principales + 2 meriendas saludables. Fomentar consumo de frutas, verduras, proteínas y lácteos.',
                    '<strong>Hidratación adecuada:</strong> Consumo suficiente de agua durante el día. Evitar exceso de bebidas azucaradas. Enseñar hábitos de hidratación saludable.',
                    '<strong>Actividad física regular:</strong> Mínimo 60 minutos de actividad física al día. Juego activo, deportes, recreación. Limitar tiempo de pantalla (TV, videojuegos, tablets).',
                    '<strong>Hábitos de sueño saludables:</strong> Horarios regulares de sueño. 10-12 horas de sueño según la edad. El descanso adecuado es esencial para el crecimiento.',
                    '<strong>Salud bucal:</strong> Cepillado dental 3 veces al día. Visitas regulares al odontólogo. La salud dental impacta en la alimentación y nutrición.',
                    '<strong>Esquema de vacunación completo:</strong> Mantener vacunas al día. Refuerzos según calendario nacional. Protección contra enfermedades prevenibles.',
                    '<strong>Educación nutricional familiar:</strong> Involucrar a toda la familia en hábitos saludables. Preparación de comidas en familia. Modelar comportamientos alimentarios positivos.'
                ];
                
                planAccion = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 class="font-bold text-green-900 mb-3">
                            <i class="fas fa-star mr-2"></i>Guía de Hábitos Saludables para Mantener
                        </h5>
                        <div class="text-sm text-gray-700">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-green-700 flex items-center mb-2">
                                        <i class="fas fa-utensils text-xl mr-2"></i> Alimentación
                                    </strong>
                                    <ul class="text-xs space-y-1 ml-4 list-disc">
                                        <li>5 comidas al día balanceadas</li>
                                        <li>Variedad de colores en el plato</li>
                                        <li>Porciones adecuadas a la edad</li>
                                    </ul>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-blue-700 flex items-center mb-2">
                                        <i class="fas fa-running text-xl mr-2"></i> Actividad Física
                                    </strong>
                                    <ul class="text-xs space-y-1 ml-4 list-disc">
                                        <li>60 min diarios de juego activo</li>
                                        <li>Deportes o recreación</li>
                                        <li>Limitar tiempo de pantalla</li>
                                    </ul>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-purple-700 flex items-center mb-2">
                                        <i class="fas fa-moon text-xl mr-2"></i> Descanso
                                    </strong>
                                    <ul class="text-xs space-y-1 ml-4 list-disc">
                                        <li>10-12 horas de sueño</li>
                                        <li>Horarios regulares</li>
                                        <li>Rutina de sueño tranquila</li>
                                    </ul>
                                </div>
                                <div class="bg-white p-3 rounded">
                                    <strong class="text-orange-700 flex items-center mb-2">
                                        <i class="fas fa-heartbeat text-xl mr-2"></i> Salud
                                    </strong>
                                    <ul class="text-xs space-y-1 ml-4 list-disc">
                                        <li>Controles médicos regulares</li>
                                        <li>Vacunación al día</li>
                                        <li>Higiene personal y bucal</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (tipo === 'adolescente') {
                recomendaciones = [
                    '<strong>Chequeos médicos anuales:</strong> Consulta anual con medicina del adolescente o medicina familiar. Evaluación del desarrollo puberal, crecimiento remanente esperado, salud mental.',
                    '<strong>Alimentación consciente y balanceada:</strong> Promover relación saludable con la comida. Dieta variada sin restricciones extremas. Educación sobre nutrición basada en evidencia, no en modas.',
                    '<strong>Actividad física regular:</strong> Mínimo 60 minutos diarios de actividad moderada a vigorosa. Deportes, gimnasio, baile, o cualquier actividad que disfrute. Beneficios físicos y mentales.',
                    '<strong>Salud mental y emocional:</strong> Estrategias para manejo del estrés (escolares, sociales). Promover autoestima saludable y positiva imagen corporal. Espacio seguro para expresar emociones.',
                    '<strong>Hábitos de sueño:</strong> 8-10 horas de sueño nocturno. Evitar dispositivos electrónicos antes de dormir. El sueño es crucial para el rendimiento escolar y bienestar.',
                    '<strong>Prevención de conductas de riesgo:</strong> Educación sobre alimentación saludable vs. dietas restrictivas. Prevención de trastornos alimentarios. Uso responsable de redes sociales.',
                    '<strong>Autonomía y responsabilidad:</strong> Involucrar al adolescente en decisiones sobre su salud. Preparación de comidas saludables. Desarrollo de habilidades para vida independiente.'
                ];
                
                planAccion = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 class="font-bold text-green-900 mb-3">
                            <i class="fas fa-star mr-2"></i>Estilo de Vida Saludable para Adolescentes
                        </h5>
                        <div class="text-sm text-gray-700 space-y-3">
                            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded">
                                <strong class="text-gray-800 block mb-2">🎯 Pilares del Bienestar Adolescente:</strong>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                    <div class="bg-white p-2 rounded">
                                        <strong class="text-blue-600">Nutrición Inteligente</strong>
                                        <p>Comidas balanceadas + hidratación + snacks saludables</p>
                                    </div>
                                    <div class="bg-white p-2 rounded">
                                        <strong class="text-green-600">Movimiento Activo</strong>
                                        <p>Deporte + actividades al aire libre + menos sedentarismo</p>
                                    </div>
                                    <div class="bg-white p-2 rounded">
                                        <strong class="text-purple-600">Bienestar Mental</strong>
                                        <p>Manejo del estrés + autoestima + relaciones sanas</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-white p-3 rounded border-l-4 border-green-500">
                                <strong class="text-green-800">💡 Consejo:</strong>
                                <p class="text-xs mt-1">Los hábitos saludables establecidos en la adolescencia tienden a mantenerse en la vida adulta. ¡Estás construyendo tu futuro saludable!</p>
                            </div>
                        </div>
                    </div>
                `;
            } else { // adulto
                recomendaciones = [
                    '<strong>Chequeos médicos anuales:</strong> Consulta médica anual preventiva. Exámenes de laboratorio de rutina según edad y factores de riesgo. Detección temprana de enfermedades crónicas.',
                    '<strong>Dieta balanceada y sostenible:</strong> Alimentación variada rica en frutas, verduras, proteínas magras, granos enteros. Moderación en azúcares y grasas saturadas. Hidratación adecuada.',
                    '<strong>Actividad física regular:</strong> Mínimo 150 minutos semanales de actividad moderada o 75 minutos de actividad vigorosa. Incluir ejercicios de fuerza y flexibilidad.',
                    '<strong>Manejo del estrés:</strong> Técnicas de relajación, meditación, mindfulness. Balance trabajo-vida personal. Tiempo para hobbies y actividades placenteras.',
                    '<strong>Sueño reparador:</strong> 7-9 horas de sueño nocturno. Hábitos de higiene del sueño. Atender problemas de insomnio o apnea del sueño si existen.',
                    '<strong>Relaciones sociales saludables:</strong> Mantener vínculos sociales positivos. Participar en actividades comunitarias. El apoyo social es protector de la salud.',
                    '<strong>Prevención de enfermedades:</strong> No fumar, consumo moderado o nulo de alcohol. Control de peso saludable. Manejo de factores de riesgo cardiovascular.',
                    '<strong>Salud mental:</strong> Atención a signos de depresión o ansiedad. Buscar apoyo profesional si es necesario. La salud mental es tan importante como la física.'
                ];
                
                planAccion = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 class="font-bold text-green-900 mb-3">
                            <i class="fas fa-star mr-2"></i>Plan de Vida Saludable para Adultos
                        </h5>
                        <div class="text-sm text-gray-700">
                            <div class="mb-3">
                                <strong class="block mb-2 text-green-800">🌟 Dimensiones del Bienestar Integral:</strong>
                                <div class="space-y-2">
                                    <div class="flex items-start bg-white p-2 rounded">
                                        <span class="text-2xl mr-3">🥗</span>
                                        <div class="flex-1">
                                            <strong>Nutrición:</strong>
                                            <p class="text-xs">Dieta mediterránea o patrón alimentario equilibrado + suplementos si necesario</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start bg-white p-2 rounded">
                                        <span class="text-2xl mr-3">💪</span>
                                        <div class="flex-1">
                                            <strong>Ejercicio:</strong>
                                            <p class="text-xs">Combinar aeróbico + fuerza + flexibilidad para salud óptima</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start bg-white p-2 rounded">
                                        <span class="text-2xl mr-3">🧘</span>
                                        <div class="flex-1">
                                            <strong>Bienestar Mental:</strong>
                                            <p class="text-xs">Manejo del estrés + tiempo personal + relaciones positivas</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start bg-white p-2 rounded">
                                        <span class="text-2xl mr-3">🏥</span>
                                        <div class="flex-1">
                                            <strong>Prevención:</strong>
                                            <p class="text-xs">Chequeos regulares + vacunación + tamizajes según edad</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // Generar HTML del resultado mejorado con más información
        let html = `
            <div class="mb-4">
                <div class="inline-block bg-${color}-100 text-${color}-800 px-6 py-3 rounded-full mb-4">
                    <i class="fas ${icono} text-2xl mr-2"></i>
                    <span class="text-xl font-bold">${titulo}</span>
                </div>
                <p class="text-lg text-gray-700 mb-6">${mensaje}</p>
            </div>
            
            ${contextoMedico}
            ${indicadoresNutricionales}
            
            <div class="bg-white rounded-lg p-6 text-left mb-4 shadow-md">
                <h4 class="text-xl font-bold text-gray-900 mb-4">
                    <i class="fas fa-clipboard-list text-blue-600 mr-2"></i>
                    Recomendaciones Clínicas Detalladas
                </h4>
                <ul class="space-y-4">
                    ${recomendaciones.map((rec, index) => `
                        <li class="flex items-start">
                            <span class="bg-${color}-100 text-${color}-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1 font-bold text-sm">${index + 1}</span>
                            <span class="text-gray-700">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            ${planAccion || ''}
            
            <div class="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4 text-left shadow-sm">
                <p class="text-sm text-gray-700">
                    <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                    <strong>Nota Médico-Legal:</strong> Este resultado es generado por un sistema de apoyo 
                    a la decisión clínica basado en algoritmos de inteligencia artificial y minería de datos. 
                    <strong>Siempre debe ser validado por un profesional de salud calificado.</strong> 
                    SIDI es una herramienta complementaria que mejora la eficiencia del trabajo médico y apoya 
                    la toma de decisiones, pero no reemplaza el juicio clínico profesional.
                </p>
            </div>
            
            <div class="mt-4 flex gap-3 justify-center flex-wrap">
                <button onclick="window.print();" 
                        class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition flex items-center">
                    <i class="fas fa-print mr-2"></i>Imprimir Reporte
                </button>
                <button onclick="location.reload();" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                    <i class="fas fa-redo mr-2"></i>Nuevo Análisis
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

// Función para inicializar el indicador de scroll
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (!scrollIndicator) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollIndicator.style.width = scrolled + '%';
    });
}

// Función para efectos del navbar al hacer scroll
function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled', 'shadow-xl');
        } else {
            navbar.classList.remove('scrolled', 'shadow-xl');
        }
        
        // Ocultar navbar al bajar, mostrar al subir
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Función para animar elementos al hacer scroll
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible', 'animate-fade-in-up');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos con animación
    document.querySelectorAll('section > div, .stat-card, .tech-card, .card-hover').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Función para efectos parallax sutiles
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

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

// Funcionalidad del botón Scroll to Top
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    // Mostrar/ocultar botón basado en scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll suave al hacer click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
