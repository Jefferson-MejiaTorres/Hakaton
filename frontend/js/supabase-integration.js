// ========================================
// SIDI - Integración con Supabase
// ========================================
// Reemplaza este código en tu script.js existente
// para conectar directamente con Supabase
// ========================================

// 1. AGREGAR SUPABASE CLIENT AL HTML
// Agrega esto en el <head> de tu index.html ANTES de script.js:
/*
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
*/

// 2. CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://TU_PROJECT_ID.supabase.co'; // ⚠️ CAMBIAR
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI'; // ⚠️ CAMBIAR

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================================
// 3. FUNCIÓN PARA HACER PREDICCIÓN
// ========================================

async function predecirDesnutricion(datos) {
    try {
        console.log('📤 Enviando datos a Supabase...', datos);
        
        // Llamar a la función SQL predecir_simple
        const { data, error } = await supabase.rpc('predecir_simple', {
            edad_meses: datos.edadMeses,
            peso: parseFloat(datos.peso),
            talla: parseFloat(datos.talla),
            zona: datos.zona || 'urbana',
            educacion_madre: datos.educacionMadre || 'secundaria'
        });
        
        if (error) {
            console.error('❌ Error de Supabase:', error);
            throw error;
        }
        
        console.log('✅ Respuesta de Supabase:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Error en predicción:', error);
        throw error;
    }
}

// ========================================
// 4. FUNCIÓN COMPLETA (con más parámetros)
// ========================================

async function predecirDesnutricionCompleta(datos) {
    try {
        const { data, error } = await supabase.rpc('predecir_desnutricion', {
            p_edad_meses: datos.edadMeses,
            p_peso: parseFloat(datos.peso),
            p_talla: parseFloat(datos.talla),
            p_episodios_diarrea: parseInt(datos.episodiosDiarrea) || 0,
            p_infecciones_respiratorias: parseInt(datos.infeccionesRespiratorias) || 0,
            p_zona_residencia: datos.zona || 'urbana',
            p_nivel_educativo_madre: datos.educacionMadre || 'secundaria',
            p_ingreso_familiar: parseFloat(datos.ingresoFamiliar) || 1000000,
            p_acceso_agua_potable: datos.accesoAgua !== false,
            p_vacunacion_completa: datos.vacunacionCompleta !== false
        });
        
        if (error) throw error;
        return data;
        
    } catch (error) {
        console.error('Error en predicción completa:', error);
        throw error;
    }
}

// ========================================
// 5. GUARDAR PREDICCIÓN EN BASE DE DATOS
// ========================================

async function guardarPrediccion(ninoId, datos) {
    try {
        const { data, error } = await supabase.rpc('guardar_prediccion', {
            p_nino_id: ninoId,
            p_edad_meses: datos.edadMeses,
            p_peso: parseFloat(datos.peso),
            p_talla: parseFloat(datos.talla),
            p_episodios_diarrea: parseInt(datos.episodiosDiarrea) || 0,
            p_infecciones_respiratorias: parseInt(datos.infeccionesRespiratorias) || 0,
            p_zona_residencia: datos.zona || 'urbana',
            p_nivel_educativo_madre: datos.educacionMadre || 'secundaria',
            p_ingreso_familiar: parseFloat(datos.ingresoFamiliar) || 1000000,
            p_acceso_agua_potable: datos.accesoAgua !== false,
            p_vacunacion_completa: datos.vacunacionCompleta !== false
        });
        
        if (error) throw error;
        console.log('✅ Predicción guardada con ID:', data.prediccion_id);
        return data;
        
    } catch (error) {
        console.error('Error guardando predicción:', error);
        throw error;
    }
}

// ========================================
// 6. REEMPLAZAR LA FUNCIÓN DEL FORMULARIO
// ========================================

// Encuentra esta parte en tu script.js actual y reemplázala:

document.getElementById('prediction-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btnSubmit = this.querySelector('button[type="submit"]');
    const originalText = btnSubmit.innerHTML;
    
    try {
        // Mostrar loading
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analizando...';
        
        // Obtener datos del formulario
        const edad = parseInt(document.getElementById('edad').value);
        const peso = parseFloat(document.getElementById('peso').value);
        const talla = parseFloat(document.getElementById('talla').value);
        const zona = document.getElementById('zona').value;
        const educacionMadre = document.getElementById('nivel-educativo').value;
        
        // Calcular edad en meses
        let edadMeses;
        const tipoPersona = tipoPersonaSeleccionado || 'bebe';
        
        if (tipoPersona === 'bebe') {
            edadMeses = edad; // Ya está en meses
        } else if (tipoPersona === 'nino') {
            edadMeses = edad * 12; // Convertir años a meses
        } else if (tipoPersona === 'adolescente') {
            edadMeses = edad * 12;
        } else if (tipoPersona === 'adulto') {
            edadMeses = edad * 12;
        }
        
        // Hacer predicción con Supabase
        const prediccion = await predecirDesnutricion({
            edadMeses: edadMeses,
            peso: peso,
            talla: talla,
            zona: zona,
            educacionMadre: educacionMadre
        });
        
        console.log('📊 Resultado:', prediccion);
        
        // Mostrar resultado
        mostrarResultadoSupabase(prediccion, tipoPersona);
        
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al procesar la predicción. Por favor, intenta de nuevo.');
    } finally {
        // Restaurar botón
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
    }
});

// ========================================
// 7. FUNCIÓN PARA MOSTRAR RESULTADO
// ========================================

function mostrarResultadoSupabase(prediccion, tipoPersona) {
    const resultadoDiv = document.getElementById('resultado');
    const contenidoDiv = document.getElementById('resultado-contenido');
    
    // Determinar color según riesgo
    let colorClase, iconoRiesgo, mensajePrincipal;
    
    if (prediccion.nivel_riesgo === 'alto') {
        colorClase = 'bg-red-50 border-red-200';
        iconoRiesgo = '🔴';
        mensajePrincipal = 'REQUIERE ATENCIÓN MÉDICA URGENTE';
    } else if (prediccion.nivel_riesgo === 'medio') {
        colorClase = 'bg-yellow-50 border-yellow-200';
        iconoRiesgo = '🟡';
        mensajePrincipal = 'REQUIERE SEGUIMIENTO MÉDICO';
    } else {
        colorClase = 'bg-green-50 border-green-200';
        iconoRiesgo = '🟢';
        mensajePrincipal = 'ESTADO NUTRICIONAL ADECUADO';
    }
    
    // Construir HTML del resultado
    let html = `
        <div class="${colorClase} border-2 rounded-lg p-6 mb-6 animate-fade-in-up">
            <div class="text-center mb-4">
                <span class="text-5xl">${iconoRiesgo}</span>
                <h3 class="text-2xl font-bold mt-2 text-gray-800">${prediccion.clasificacion}</h3>
                <p class="text-lg text-gray-600 mt-1">${mensajePrincipal}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div class="bg-white rounded-lg p-4 text-center">
                    <p class="text-sm text-gray-600">Nivel de Riesgo</p>
                    <p class="text-xl font-bold text-gray-800 uppercase">${prediccion.nivel_riesgo}</p>
                </div>
                <div class="bg-white rounded-lg p-4 text-center">
                    <p class="text-sm text-gray-600">Probabilidad</p>
                    <p class="text-xl font-bold text-gray-800">${(prediccion.probabilidad * 100).toFixed(1)}%</p>
                </div>
                <div class="bg-white rounded-lg p-4 text-center">
                    <p class="text-sm text-gray-600">IMC</p>
                    <p class="text-xl font-bold text-gray-800">${prediccion.imc}</p>
                </div>
            </div>
        </div>
        
        <!-- Indicadores Nutricionales -->
        <div class="bg-white rounded-lg p-6 mb-6 border">
            <h4 class="text-lg font-bold text-gray-800 mb-4">📊 Indicadores Nutricionales</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span class="text-gray-700">Z-Score Peso/Edad:</span>
                    <span class="font-bold">${prediccion.z_scores.peso_edad}</span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span class="text-gray-700">Z-Score Talla/Edad:</span>
                    <span class="font-bold">${prediccion.z_scores.talla_edad}</span>
                </div>
            </div>
        </div>
        
        <!-- Factores de Riesgo -->
        <div class="bg-white rounded-lg p-6 mb-6 border">
            <h4 class="text-lg font-bold text-gray-800 mb-4">⚠️ Factores Identificados</h4>
            <ul class="space-y-2">
                ${prediccion.factores_riesgo.map(factor => 
                    `<li class="flex items-start">
                        <span class="text-red-500 mr-2">•</span>
                        <span class="text-gray-700">${factor}</span>
                    </li>`
                ).join('')}
            </ul>
        </div>
        
        <!-- Recomendaciones -->
        <div class="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 class="text-lg font-bold text-gray-800 mb-4">💡 Recomendaciones</h4>
            <ol class="space-y-3">
                ${prediccion.recomendaciones.map((rec, idx) => 
                    `<li class="flex items-start">
                        <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">${idx + 1}</span>
                        <span class="text-gray-700">${rec}</span>
                    </li>`
                ).join('')}
            </ol>
        </div>
        
        <!-- Nota Médica -->
        <div class="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            <p><strong>Nota importante:</strong> Esta herramienta es un sistema de apoyo al diagnóstico. Los resultados deben ser interpretados por un profesional de la salud calificado. En casos de riesgo alto, busque atención médica inmediata.</p>
        </div>
        
        <!-- Botones de Acción -->
        <div class="mt-6 flex gap-4 justify-center">
            <button onclick="window.print()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                <i class="fas fa-print mr-2"></i>Imprimir Reporte
            </button>
            <button onclick="location.reload()" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
                <i class="fas fa-redo mr-2"></i>Nueva Evaluación
            </button>
        </div>
    `;
    
    contenidoDiv.innerHTML = html;
    resultadoDiv.classList.remove('hidden');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// 8. CONSULTAS ADICIONALES ÚTILES
// ========================================

// Obtener todos los niños
async function obtenerNinos() {
    const { data, error } = await supabase
        .from('ninos')
        .select('*')
        .order('fecha_registro', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Obtener predicciones por municipio
async function obtenerEstadisticasPorMunicipio() {
    const { data, error } = await supabase
        .from('estadisticas_municipio')
        .select('*')
        .order('total_ninos', { ascending: false });
    
    if (error) throw error;
    return data;
}

// Obtener casos de alto riesgo
async function obtenerCasosAltoRiesgo() {
    const { data, error } = await supabase
        .from('vista_ninos_completa')
        .select('*')
        .eq('ultima_prediccion', 'alto')
        .order('probabilidad_riesgo', { ascending: false });
    
    if (error) throw error;
    return data;
}

// ========================================
// EJEMPLO DE USO COMPLETO
// ========================================

console.log('🏥 SIDI - Conectado a Supabase');
console.log('📡 URL:', SUPABASE_URL);
console.log('⚠️ RECUERDA: Configura SUPABASE_URL y SUPABASE_ANON_KEY');
