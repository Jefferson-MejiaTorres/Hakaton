// ========================================
// SIDI - Integración Completa con Supabase
// ========================================

// CONFIGURACIÓN - Credenciales de Supabase
const SUPABASE_URL = 'https://hfeixwjdgvmrackugnsr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZWl4d2pkZ3ZtcmFja3VnbnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1OTY1NjksImV4cCI6MjA4MDE3MjU2OX0.JZrUe6qCyi3Wu6dUoT4ulVeOMnYyTyTyrEeqBExoA24';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================================
// AUTENTICACIÓN
// ========================================

async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function register(email, password, metadata = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata }
        });
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getCurrentSession() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        return null;
    }
}

// ========================================
// PACIENTES - CRUD
// ========================================

async function crearPaciente(datosPaciente) {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .insert([datosPaciente])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function obtenerPacientes(filtros = {}) {
    try {
        let query = supabase
            .from('pacientes')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (filtros.zona) query = query.eq('zona', filtros.zona);
        if (filtros.riesgo) query = query.eq('nivel_riesgo', filtros.riesgo);
        
        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function obtenerPacientePorId(id) {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function actualizarPaciente(id, datosActualizados) {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .update(datosActualizados)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========================================
// PREDICCIONES ML
// ========================================

async function realizarPrediccion(datosPaciente) {
    try {
        const { data, error } = await supabase.rpc('predecir_desnutricion', {
            p_edad_meses: datosPaciente.edad_meses,
            p_peso: parseFloat(datosPaciente.peso),
            p_talla: parseFloat(datosPaciente.talla),
            p_zona_residencia: datosPaciente.zona || 'urbana',
            p_nivel_educativo_madre: datosPaciente.educacion_madre || 'secundaria',
            p_ingreso_familiar: parseFloat(datosPaciente.ingreso_familiar) || 1000000,
            p_acceso_agua_potable: datosPaciente.acceso_agua !== false,
            p_vacunacion_completa: datosPaciente.vacunacion !== false
        });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function obtenerPredicciones(filtros = {}) {
    try {
        let query = supabase
            .from('predicciones')
            .select('*, pacientes(*)')
            .order('fecha_prediccion', { ascending: false });
        
        if (filtros.nivel_riesgo) {
            query = query.eq('nivel_riesgo', filtros.nivel_riesgo);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========================================
// ESTADÍSTICAS
// ========================================

async function obtenerEstadisticas() {
    try {
        const { data, error } = await supabase.rpc('obtener_estadisticas');
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========================================
// EXPORTAR FUNCIONES
// ========================================

window.sidiDB = {
    // Auth
    login,
    register,
    logout,
    getCurrentSession,
    
    // Pacientes
    crearPaciente,
    obtenerPacientes,
    obtenerPacientePorId,
    actualizarPaciente,
    
    // Predicciones
    realizarPrediccion,
    obtenerPredicciones,
    
    // Estadísticas
    obtenerEstadisticas,
    
    // Cliente Supabase directo
    supabase
};
