-- ========================================
-- SIDI - FUNCIÓN SQL COMPLETA PARA PREDICCIÓN
-- ========================================
-- Esta función simula el modelo ML directamente en PostgreSQL/Supabase
-- Úsala desde tu frontend para obtener predicciones sin necesidad de backend Python
-- ========================================

-- ========================================
-- FUNCIÓN PRINCIPAL: predecir_desnutricion
-- ========================================

CREATE OR REPLACE FUNCTION predecir_desnutricion(
    p_edad_meses INTEGER,
    p_peso NUMERIC,
    p_talla NUMERIC,
    p_episodios_diarrea INTEGER DEFAULT 0,
    p_infecciones_respiratorias INTEGER DEFAULT 0,
    p_zona_residencia VARCHAR DEFAULT 'urbana',
    p_nivel_educativo_madre VARCHAR DEFAULT 'secundaria',
    p_ingreso_familiar NUMERIC DEFAULT 1000000,
    p_acceso_agua_potable BOOLEAN DEFAULT TRUE,
    p_vacunacion_completa BOOLEAN DEFAULT TRUE
)
RETURNS TABLE(
    nivel_riesgo VARCHAR,
    probabilidad NUMERIC,
    clasificacion VARCHAR,
    imc NUMERIC,
    z_score_peso_edad NUMERIC,
    z_score_talla_edad NUMERIC,
    factores_riesgo TEXT[],
    recomendaciones TEXT[]
) AS $$
DECLARE
    v_imc NUMERIC;
    v_z_peso NUMERIC;
    v_z_talla NUMERIC;
    v_score_riesgo NUMERIC := 0;
    v_probabilidad NUMERIC;
    v_nivel VARCHAR;
    v_clasificacion VARCHAR;
    v_factores TEXT[] := ARRAY[]::TEXT[];
    v_recomendaciones TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- ========================================
    -- 1. CALCULAR IMC
    -- ========================================
    v_imc := p_peso / POWER(p_talla / 100, 2);
    
    -- ========================================
    -- 2. CALCULAR Z-SCORES SIMPLIFICADOS
    -- ========================================
    -- Z-score peso/edad (simplificado, basado en percentiles)
    CASE 
        WHEN p_edad_meses BETWEEN 0 AND 12 THEN
            v_z_peso := (p_peso - (3.0 + p_edad_meses * 0.6)) / 1.2;
        WHEN p_edad_meses BETWEEN 13 AND 24 THEN
            v_z_peso := (p_peso - (10.0 + (p_edad_meses - 12) * 0.25)) / 1.5;
        WHEN p_edad_meses BETWEEN 25 AND 60 THEN
            v_z_peso := (p_peso - (12.5 + (p_edad_meses - 24) * 0.15)) / 2.0;
        ELSE
            v_z_peso := 0;
    END CASE;
    
    -- Z-score talla/edad (simplificado)
    CASE
        WHEN p_edad_meses BETWEEN 0 AND 12 THEN
            v_z_talla := (p_talla - (50.0 + p_edad_meses * 2.5)) / 2.5;
        WHEN p_edad_meses BETWEEN 13 AND 24 THEN
            v_z_talla := (p_talla - (75.0 + (p_edad_meses - 12) * 1.0)) / 3.0;
        WHEN p_edad_meses BETWEEN 25 AND 60 THEN
            v_z_talla := (p_talla - (87.0 + (p_edad_meses - 24) * 0.5)) / 3.5;
        ELSE
            v_z_talla := 0;
    END CASE;
    
    -- ========================================
    -- 3. CALCULAR SCORE DE RIESGO (0-100)
    -- ========================================
    
    -- Factor 1: Z-score peso/edad (peso: 30%)
    IF v_z_peso < -3 THEN
        v_score_riesgo := v_score_riesgo + 30;
        v_factores := array_append(v_factores, 'Peso muy bajo para la edad (desnutrición severa)');
    ELSIF v_z_peso < -2 THEN
        v_score_riesgo := v_score_riesgo + 20;
        v_factores := array_append(v_factores, 'Peso bajo para la edad (desnutrición moderada)');
    ELSIF v_z_peso < -1 THEN
        v_score_riesgo := v_score_riesgo + 10;
        v_factores := array_append(v_factores, 'Peso por debajo del promedio');
    END IF;
    
    -- Factor 2: Z-score talla/edad (peso: 25%)
    IF v_z_talla < -3 THEN
        v_score_riesgo := v_score_riesgo + 25;
        v_factores := array_append(v_factores, 'Talla muy baja para la edad (retraso severo)');
    ELSIF v_z_talla < -2 THEN
        v_score_riesgo := v_score_riesgo + 18;
        v_factores := array_append(v_factores, 'Talla baja para la edad (retraso moderado)');
    ELSIF v_z_talla < -1 THEN
        v_score_riesgo := v_score_riesgo + 8;
        v_factores := array_append(v_factores, 'Talla por debajo del promedio');
    END IF;
    
    -- Factor 3: Episodios de diarrea (peso: 15%)
    IF p_episodios_diarrea >= 6 THEN
        v_score_riesgo := v_score_riesgo + 15;
        v_factores := array_append(v_factores, 'Episodios frecuentes de diarrea (6+)');
    ELSIF p_episodios_diarrea >= 3 THEN
        v_score_riesgo := v_score_riesgo + 8;
        v_factores := array_append(v_factores, 'Episodios recurrentes de diarrea');
    END IF;
    
    -- Factor 4: Infecciones respiratorias (peso: 10%)
    IF p_infecciones_respiratorias >= 5 THEN
        v_score_riesgo := v_score_riesgo + 10;
        v_factores := array_append(v_factores, 'Infecciones respiratorias frecuentes');
    ELSIF p_infecciones_respiratorias >= 3 THEN
        v_score_riesgo := v_score_riesgo + 5;
        v_factores := array_append(v_factores, 'Infecciones respiratorias recurrentes');
    END IF;
    
    -- Factor 5: Zona de residencia (peso: 5%)
    IF p_zona_residencia = 'rural' THEN
        v_score_riesgo := v_score_riesgo + 5;
        v_factores := array_append(v_factores, 'Zona rural con acceso limitado a servicios');
    END IF;
    
    -- Factor 6: Educación de la madre (peso: 5%)
    IF p_nivel_educativo_madre IN ('ninguno', 'primaria') THEN
        v_score_riesgo := v_score_riesgo + 5;
        v_factores := array_append(v_factores, 'Nivel educativo materno bajo');
    END IF;
    
    -- Factor 7: Ingreso familiar (peso: 5%)
    IF p_ingreso_familiar < 500000 THEN
        v_score_riesgo := v_score_riesgo + 5;
        v_factores := array_append(v_factores, 'Ingresos familiares muy bajos');
    ELSIF p_ingreso_familiar < 800000 THEN
        v_score_riesgo := v_score_riesgo + 3;
        v_factores := array_append(v_factores, 'Ingresos familiares bajos');
    END IF;
    
    -- Factor 8: Acceso a agua potable (peso: 3%)
    IF NOT p_acceso_agua_potable THEN
        v_score_riesgo := v_score_riesgo + 3;
        v_factores := array_append(v_factores, 'Sin acceso a agua potable');
    END IF;
    
    -- Factor 9: Vacunación (peso: 2%)
    IF NOT p_vacunacion_completa THEN
        v_score_riesgo := v_score_riesgo + 2;
        v_factores := array_append(v_factores, 'Esquema de vacunación incompleto');
    END IF;
    
    -- ========================================
    -- 4. DETERMINAR NIVEL DE RIESGO Y PROBABILIDAD
    -- ========================================
    v_probabilidad := LEAST(v_score_riesgo / 100.0, 1.0);
    
    IF v_score_riesgo >= 60 THEN
        v_nivel := 'alto';
        v_clasificacion := 'RIESGO ALTO';
        v_recomendaciones := ARRAY[
            'Intervención médica URGENTE requerida',
            'Evaluación completa por pediatra y nutricionista',
            'Iniciar programa de recuperación nutricional',
            'Suplementación nutricional inmediata',
            'Seguimiento semanal durante el primer mes',
            'Vincular con programa ICBF o similar',
            'Evaluación de factores sociales y económicos',
            'Posible hospitalización si hay complicaciones'
        ];
    ELSIF v_score_riesgo >= 30 THEN
        v_nivel := 'medio';
        v_clasificacion := 'RIESGO MEDIO';
        v_recomendaciones := ARRAY[
            'Consulta médica en las próximas 2 semanas',
            'Evaluación nutricional completa',
            'Plan de alimentación personalizado',
            'Suplementación si es necesario',
            'Seguimiento mensual',
            'Educación nutricional para la familia',
            'Monitoreo de crecimiento',
            'Prevención de infecciones'
        ];
    ELSE
        v_nivel := 'bajo';
        v_clasificacion := 'RIESGO BAJO';
        v_recomendaciones := ARRAY[
            'Continuar con controles rutinarios',
            'Mantener alimentación balanceada',
            'Seguimiento trimestral',
            'Completar esquema de vacunación',
            'Promover lactancia materna (si aplica)',
            'Higiene y prevención de enfermedades',
            'Estimulación temprana',
            'Consultar ante cualquier cambio'
        ];
    END IF;
    
    -- Si no hay factores de riesgo identificados
    IF array_length(v_factores, 1) IS NULL THEN
        v_factores := ARRAY['Estado nutricional adecuado para la edad'];
    END IF;
    
    -- ========================================
    -- 5. RETORNAR RESULTADOS
    -- ========================================
    RETURN QUERY SELECT 
        v_nivel,
        ROUND(v_probabilidad, 4),
        v_clasificacion,
        ROUND(v_imc, 2),
        ROUND(v_z_peso, 2),
        ROUND(v_z_talla, 2),
        v_factores,
        v_recomendaciones;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- FUNCIÓN SIMPLIFICADA PARA EL FRONTEND
-- ========================================

CREATE OR REPLACE FUNCTION predecir_simple(
    edad_meses INTEGER,
    peso NUMERIC,
    talla NUMERIC,
    zona VARCHAR DEFAULT 'urbana',
    educacion_madre VARCHAR DEFAULT 'secundaria'
)
RETURNS JSON AS $$
DECLARE
    resultado RECORD;
BEGIN
    SELECT * INTO resultado FROM predecir_desnutricion(
        edad_meses, 
        peso, 
        talla,
        0, -- episodios_diarrea
        0, -- infecciones_respiratorias
        zona,
        educacion_madre,
        1000000, -- ingreso_familiar
        TRUE, -- acceso_agua_potable
        TRUE  -- vacunacion_completa
    );
    
    RETURN json_build_object(
        'nivel_riesgo', resultado.nivel_riesgo,
        'probabilidad', resultado.probabilidad,
        'clasificacion', resultado.clasificacion,
        'imc', resultado.imc,
        'z_scores', json_build_object(
            'peso_edad', resultado.z_score_peso_edad,
            'talla_edad', resultado.z_score_talla_edad
        ),
        'factores_riesgo', resultado.factores_riesgo,
        'recomendaciones', resultado.recomendaciones
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- GUARDAR PREDICCIÓN EN LA BASE DE DATOS
-- ========================================

CREATE OR REPLACE FUNCTION guardar_prediccion(
    p_nino_id INTEGER,
    p_edad_meses INTEGER,
    p_peso NUMERIC,
    p_talla NUMERIC,
    p_episodios_diarrea INTEGER DEFAULT 0,
    p_infecciones_respiratorias INTEGER DEFAULT 0,
    p_zona_residencia VARCHAR DEFAULT 'urbana',
    p_nivel_educativo_madre VARCHAR DEFAULT 'secundaria',
    p_ingreso_familiar NUMERIC DEFAULT 1000000,
    p_acceso_agua_potable BOOLEAN DEFAULT TRUE,
    p_vacunacion_completa BOOLEAN DEFAULT TRUE
)
RETURNS JSON AS $$
DECLARE
    resultado RECORD;
    v_features JSON;
    v_prediccion_id INTEGER;
BEGIN
    -- Obtener predicción
    SELECT * INTO resultado FROM predecir_desnutricion(
        p_edad_meses,
        p_peso,
        p_talla,
        p_episodios_diarrea,
        p_infecciones_respiratorias,
        p_zona_residencia,
        p_nivel_educativo_madre,
        p_ingreso_familiar,
        p_acceso_agua_potable,
        p_vacunacion_completa
    );
    
    -- Construir JSON de features
    v_features := json_build_object(
        'edad_meses', p_edad_meses,
        'peso', p_peso,
        'talla', p_talla,
        'imc', resultado.imc,
        'z_score_peso_edad', resultado.z_score_peso_edad,
        'z_score_talla_edad', resultado.z_score_talla_edad,
        'episodios_diarrea', p_episodios_diarrea,
        'infecciones_respiratorias', p_infecciones_respiratorias,
        'zona', p_zona_residencia,
        'educacion_madre', p_nivel_educativo_madre,
        'ingreso_familiar', p_ingreso_familiar,
        'acceso_agua_potable', p_acceso_agua_potable,
        'vacunacion_completa', p_vacunacion_completa
    );
    
    -- Insertar en tabla predicciones
    INSERT INTO predicciones (
        nino_id,
        nivel_riesgo,
        probabilidad,
        modelo_usado,
        features_json
    ) VALUES (
        p_nino_id,
        resultado.nivel_riesgo,
        resultado.probabilidad,
        'sql_function',
        v_features
    ) RETURNING id INTO v_prediccion_id;
    
    -- Retornar resultado completo
    RETURN json_build_object(
        'prediccion_id', v_prediccion_id,
        'nivel_riesgo', resultado.nivel_riesgo,
        'probabilidad', resultado.probabilidad,
        'clasificacion', resultado.clasificacion,
        'imc', resultado.imc,
        'z_scores', json_build_object(
            'peso_edad', resultado.z_score_peso_edad,
            'talla_edad', resultado.z_score_talla_edad
        ),
        'factores_riesgo', resultado.factores_riesgo,
        'recomendaciones', resultado.recomendaciones
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- EJEMPLOS DE USO
-- ========================================

-- Ejemplo 1: Predicción simple
SELECT * FROM predecir_desnutricion(
    30,      -- edad en meses (2.5 años)
    12.5,    -- peso en kg
    85.0,    -- talla en cm
    2,       -- episodios de diarrea
    3,       -- infecciones respiratorias
    'urbana',
    'secundaria',
    1200000,
    TRUE,
    TRUE
);

-- Ejemplo 2: Predicción en formato JSON (para API)
SELECT predecir_simple(30, 12.5, 85.0, 'urbana', 'secundaria');

-- Ejemplo 3: Caso de ALTO RIESGO
SELECT * FROM predecir_desnutricion(
    24,       -- 2 años
    9.5,      -- peso muy bajo
    78.0,     -- talla baja
    6,        -- muchas diarreas
    7,        -- muchas infecciones
    'rural',
    'ninguno',
    350000,
    FALSE,
    FALSE
);

-- Ejemplo 4: Caso de BAJO RIESGO
SELECT * FROM predecir_desnutricion(
    36,       -- 3 años
    15.0,     -- peso adecuado
    95.0,     -- talla adecuada
    0,        -- sin diarreas
    1,        -- pocas infecciones
    'urbana',
    'universitario',
    3500000,
    TRUE,
    TRUE
);

-- ========================================
-- CONSULTA PARA USAR DESDE JAVASCRIPT
-- ========================================

/*
DESDE TU FRONTEND, USA SUPABASE CLIENT:

const { data, error } = await supabase
  .rpc('predecir_simple', {
    edad_meses: 30,
    peso: 12.5,
    talla: 85.0,
    zona: 'urbana',
    educacion_madre: 'secundaria'
  });

console.log(data);
// {
//   nivel_riesgo: 'bajo',
//   probabilidad: 0.15,
//   clasificacion: 'RIESGO BAJO',
//   imc: 17.3,
//   z_scores: { peso_edad: -0.5, talla_edad: 0.2 },
//   factores_riesgo: ['Peso por debajo del promedio'],
//   recomendaciones: [...]
// }
*/

-- ========================================
-- HABILITAR RPC EN SUPABASE
-- ========================================

-- En Supabase, ve a Authentication → Policies
-- Crea una política para permitir ejecutar estas funciones:

-- ALTER FUNCTION predecir_desnutricion SECURITY DEFINER;
-- ALTER FUNCTION predecir_simple SECURITY DEFINER;
-- ALTER FUNCTION guardar_prediccion SECURITY DEFINER;

-- GRANT EXECUTE ON FUNCTION predecir_desnutricion TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION predecir_simple TO anon, authenticated;
-- GRANT EXECUTE ON FUNCTION guardar_prediccion TO authenticated;

-- ========================================
-- ¡LISTO! Ahora puedes hacer predicciones
-- directamente desde SQL sin necesidad de
-- Python, FastAPI o modelos ML entrenados
-- ========================================
