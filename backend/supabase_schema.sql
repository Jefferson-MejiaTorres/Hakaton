-- ========================================
-- SIDI - Queries SQL para Supabase
-- Sistema Inteligente de Detección de Desnutrición Infantil
-- ========================================
-- Ejecutar estos queries en el SQL Editor de Supabase
-- ========================================

-- 1. TABLA: ninos
-- Información básica del niño/paciente
CREATE TABLE IF NOT EXISTS ninos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
    documento_identidad VARCHAR(20) UNIQUE,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_fecha_nacimiento CHECK (fecha_nacimiento <= CURRENT_DATE)
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_ninos_documento ON ninos(documento_identidad);
CREATE INDEX idx_ninos_fecha_registro ON ninos(fecha_registro);

-- ========================================

-- 2. TABLA: mediciones_antropometricas
-- Mediciones físicas y antropométricas
CREATE TABLE IF NOT EXISTS mediciones_antropometricas (
    id SERIAL PRIMARY KEY,
    nino_id INTEGER NOT NULL REFERENCES ninos(id) ON DELETE CASCADE,
    fecha_medicion DATE NOT NULL,
    
    -- Mediciones básicas
    peso NUMERIC(6, 2) NOT NULL CHECK (peso > 0 AND peso < 200),
    talla NUMERIC(6, 2) NOT NULL CHECK (talla > 0 AND talla < 250),
    perimetro_braquial NUMERIC(5, 2) CHECK (perimetro_braquial > 0 AND perimetro_braquial < 100),
    peso_al_nacer NUMERIC(7, 2) CHECK (peso_al_nacer > 0 AND peso_al_nacer < 10000),
    
    -- Indicadores calculados
    imc NUMERIC(6, 2) CHECK (imc > 0 AND imc < 100),
    z_score_peso_edad NUMERIC(5, 2),
    z_score_talla_edad NUMERIC(5, 2),
    z_score_peso_talla NUMERIC(5, 2),
    
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_fecha_medicion CHECK (fecha_medicion <= CURRENT_DATE)
);

-- Crear índices
CREATE INDEX idx_mediciones_nino_id ON mediciones_antropometricas(nino_id);
CREATE INDEX idx_mediciones_fecha ON mediciones_antropometricas(fecha_medicion);

-- ========================================

-- 3. TABLA: historia_clinica
-- Historial médico del niño
CREATE TABLE IF NOT EXISTS historia_clinica (
    id SERIAL PRIMARY KEY,
    nino_id INTEGER NOT NULL UNIQUE REFERENCES ninos(id) ON DELETE CASCADE,
    
    -- Historial de salud (últimos 6 meses)
    episodios_diarrea INTEGER DEFAULT 0 CHECK (episodios_diarrea >= 0),
    infecciones_respiratorias INTEGER DEFAULT 0 CHECK (infecciones_respiratorias >= 0),
    vacunacion_completa BOOLEAN DEFAULT FALSE,
    enfermedades_cronicas VARCHAR(200),
    
    -- Alimentación
    lactancia_materna VARCHAR(20) CHECK (lactancia_materna IN ('exclusiva_6m', 'mixta', 'no_lacto', NULL)),
    suplementacion_nutricional BOOLEAN DEFAULT FALSE,
    
    -- Observaciones adicionales
    observaciones TEXT,
    
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice
CREATE INDEX idx_historia_nino_id ON historia_clinica(nino_id);

-- ========================================

-- 4. TABLA: datos_sociodemograficos
-- Información socioeconómica y demográfica
CREATE TABLE IF NOT EXISTS datos_sociodemograficos (
    id SERIAL PRIMARY KEY,
    nino_id INTEGER NOT NULL UNIQUE REFERENCES ninos(id) ON DELETE CASCADE,
    
    -- Educación de los padres
    nivel_educativo_madre VARCHAR(20) CHECK (nivel_educativo_madre IN ('ninguno', 'primaria', 'secundaria', 'tecnico', 'universitario', NULL)),
    nivel_educativo_padre VARCHAR(20) CHECK (nivel_educativo_padre IN ('ninguno', 'primaria', 'secundaria', 'tecnico', 'universitario', NULL)),
    
    -- Economía familiar
    ingreso_familiar_mensual NUMERIC(12, 2) CHECK (ingreso_familiar_mensual >= 0),
    numero_hijos INTEGER CHECK (numero_hijos > 0),
    
    -- Vivienda
    tipo_vivienda VARCHAR(20) CHECK (tipo_vivienda IN ('propia', 'arrendada', 'familiar', 'invasion', NULL)),
    material_vivienda VARCHAR(20) CHECK (material_vivienda IN ('concreto', 'madera', 'lata', 'mixto', NULL)),
    
    -- Servicios públicos
    acceso_agua_potable BOOLEAN DEFAULT FALSE,
    acceso_alcantarillado BOOLEAN DEFAULT FALSE,
    
    -- Ubicación
    zona_residencia VARCHAR(10) CHECK (zona_residencia IN ('urbana', 'rural', NULL)),
    municipio VARCHAR(50),
    
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_sociodem_nino_id ON datos_sociodemograficos(nino_id);
CREATE INDEX idx_sociodem_municipio ON datos_sociodemograficos(municipio);
CREATE INDEX idx_sociodem_zona ON datos_sociodemograficos(zona_residencia);

-- ========================================

-- 5. TABLA: predicciones
-- Resultados de las predicciones del modelo ML
CREATE TABLE IF NOT EXISTS predicciones (
    id SERIAL PRIMARY KEY,
    nino_id INTEGER NOT NULL REFERENCES ninos(id) ON DELETE CASCADE,
    fecha_prediccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Resultado de la predicción
    nivel_riesgo VARCHAR(10) NOT NULL CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto')),
    probabilidad NUMERIC(5, 4) CHECK (probabilidad >= 0 AND probabilidad <= 1),
    modelo_usado VARCHAR(20) CHECK (modelo_usado IN ('svm', 'random_forest', 'mlp', NULL)),
    
    -- Features utilizados (almacenados como JSON)
    features_json JSONB,
    
    CONSTRAINT chk_probabilidad CHECK (probabilidad >= 0 AND probabilidad <= 1)
);

-- Crear índices
CREATE INDEX idx_predicciones_nino_id ON predicciones(nino_id);
CREATE INDEX idx_predicciones_fecha ON predicciones(fecha_prediccion);
CREATE INDEX idx_predicciones_nivel_riesgo ON predicciones(nivel_riesgo);

-- ========================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ========================================

-- Trigger para actualizar fecha_actualizacion en historia_clinica
CREATE OR REPLACE FUNCTION update_historia_clinica_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_historia_clinica
    BEFORE UPDATE ON historia_clinica
    FOR EACH ROW
    EXECUTE FUNCTION update_historia_clinica_timestamp();

-- Trigger para actualizar fecha_actualizacion en datos_sociodemograficos
CREATE OR REPLACE FUNCTION update_sociodem_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sociodem
    BEFORE UPDATE ON datos_sociodemograficos
    FOR EACH ROW
    EXECUTE FUNCTION update_sociodem_timestamp();

-- ========================================
-- FUNCIONES ÚTILES
-- ========================================

-- Función para calcular IMC
CREATE OR REPLACE FUNCTION calcular_imc(peso_kg NUMERIC, talla_cm NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    IF talla_cm <= 0 THEN
        RETURN NULL;
    END IF;
    RETURN peso_kg / POWER(talla_cm / 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Función para obtener edad en meses
CREATE OR REPLACE FUNCTION edad_en_meses(fecha_nac DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nac)) * 12 + 
           EXTRACT(MONTH FROM AGE(CURRENT_DATE, fecha_nac));
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista: Información completa del niño con última medición
CREATE OR REPLACE VIEW vista_ninos_completa AS
SELECT 
    n.id,
    n.nombre,
    n.apellido,
    n.fecha_nacimiento,
    edad_en_meses(n.fecha_nacimiento) AS edad_meses,
    n.sexo,
    n.documento_identidad,
    m.peso AS ultimo_peso,
    m.talla AS ultima_talla,
    m.imc AS ultimo_imc,
    m.fecha_medicion AS fecha_ultima_medicion,
    hc.episodios_diarrea,
    hc.vacunacion_completa,
    ds.zona_residencia,
    ds.municipio,
    ds.nivel_educativo_madre,
    ds.acceso_agua_potable,
    p.nivel_riesgo AS ultima_prediccion,
    p.probabilidad AS probabilidad_riesgo,
    p.fecha_prediccion AS fecha_ultima_prediccion
FROM ninos n
LEFT JOIN LATERAL (
    SELECT * FROM mediciones_antropometricas 
    WHERE nino_id = n.id 
    ORDER BY fecha_medicion DESC 
    LIMIT 1
) m ON TRUE
LEFT JOIN historia_clinica hc ON hc.nino_id = n.id
LEFT JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
LEFT JOIN LATERAL (
    SELECT * FROM predicciones 
    WHERE nino_id = n.id 
    ORDER BY fecha_prediccion DESC 
    LIMIT 1
) p ON TRUE;

-- Vista: Estadísticas por municipio
CREATE OR REPLACE VIEW estadisticas_municipio AS
SELECT 
    ds.municipio,
    COUNT(DISTINCT n.id) AS total_ninos,
    COUNT(DISTINCT CASE WHEN p.nivel_riesgo = 'alto' THEN n.id END) AS ninos_riesgo_alto,
    COUNT(DISTINCT CASE WHEN p.nivel_riesgo = 'medio' THEN n.id END) AS ninos_riesgo_medio,
    COUNT(DISTINCT CASE WHEN p.nivel_riesgo = 'bajo' THEN n.id END) AS ninos_riesgo_bajo,
    ROUND(AVG(ds.ingreso_familiar_mensual), 2) AS ingreso_promedio,
    ROUND(SUM(CASE WHEN ds.acceso_agua_potable = TRUE THEN 1 ELSE 0 END)::NUMERIC / COUNT(*) * 100, 2) AS porcentaje_agua_potable
FROM ninos n
JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
LEFT JOIN LATERAL (
    SELECT * FROM predicciones 
    WHERE nino_id = n.id 
    ORDER BY fecha_prediccion DESC 
    LIMIT 1
) p ON TRUE
GROUP BY ds.municipio
ORDER BY total_ninos DESC;

-- ========================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ========================================
-- Descomenta estas líneas si necesitas RLS en Supabase

-- ALTER TABLE ninos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mediciones_antropometricas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE historia_clinica ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE datos_sociodemograficos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE predicciones ENABLE ROW LEVEL SECURITY;

-- Ejemplo de política (permitir lectura a todos los usuarios autenticados)
-- CREATE POLICY "Permitir lectura a usuarios autenticados"
--     ON ninos FOR SELECT
--     TO authenticated
--     USING (true);

-- ========================================
-- VERIFICACIÓN
-- ========================================

-- Verificar que todas las tablas se crearon correctamente
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columnas
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('ninos', 'mediciones_antropometricas', 'historia_clinica', 'datos_sociodemograficos', 'predicciones')
ORDER BY table_name;

-- ========================================
-- ¡LISTO! Base de datos configurada
-- ========================================
-- Ahora puedes:
-- 1. Insertar datos de prueba
-- 2. Conectar el backend FastAPI
-- 3. Empezar a entrenar modelos ML
-- ========================================
