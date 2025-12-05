-- ========================================
-- SIDI - Datos de Ejemplo para Supabase
-- ========================================
-- Estos queries insertan datos de prueba realistas
-- para las 5 tablas del sistema
-- ========================================

-- ========================================
-- 1. INSERTAR NIÑOS DE EJEMPLO
-- ========================================

INSERT INTO ninos (nombre, apellido, fecha_nacimiento, sexo, documento_identidad) VALUES
('María', 'González Pérez', '2021-03-15', 'F', '1001234567'),
('Juan', 'Martínez López', '2020-08-22', 'M', '1001234568'),
('Ana', 'Rodríguez Silva', '2019-11-10', 'F', '1001234569'),
('Carlos', 'Ramírez Torres', '2022-01-05', 'M', '1001234570'),
('Sofía', 'Hernández Castro', '2020-05-18', 'F', '1001234571'),
('Luis', 'García Moreno', '2021-09-30', 'M', '1001234572'),
('Valentina', 'López Díaz', '2019-07-12', 'F', '1001234573'),
('Daniel', 'Sánchez Ruiz', '2022-04-25', 'M', '1001234574'),
('Isabella', 'Gómez Vargas', '2020-12-08', 'F', '1001234575'),
('Miguel', 'Fernández Cruz', '2021-06-14', 'M', '1001234576');

-- ========================================
-- 2. INSERTAR MEDICIONES ANTROPOMÉTRICAS
-- ========================================

-- Mediciones para María González (ID: 1)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(1, '2023-03-15', 12.5, 85.0, 15.2, 3200, 17.3, -0.5, 0.2, -0.8),
(1, '2023-09-15', 13.8, 89.5, 15.8, NULL, 17.2, -0.3, 0.3, -0.6);

-- Mediciones para Juan Martínez (ID: 2)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(2, '2023-02-20', 11.2, 82.0, 14.5, 2800, 16.7, -1.8, -1.2, -1.5),
(2, '2023-08-20', 11.8, 84.5, 14.8, NULL, 16.5, -1.5, -1.0, -1.3);

-- Mediciones para Ana Rodríguez (ID: 3)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(3, '2023-01-10', 15.5, 95.0, 16.5, 3400, 17.2, 0.5, 0.8, 0.3),
(3, '2023-07-10', 16.8, 98.0, 17.0, NULL, 17.5, 0.6, 0.9, 0.4);

-- Mediciones para Carlos Ramírez (ID: 4)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(4, '2023-04-05', 10.2, 78.0, 13.8, 2500, 16.8, -2.2, -1.8, -2.0),
(4, '2023-10-05', 10.8, 80.5, 14.2, NULL, 16.6, -2.0, -1.6, -1.8);

-- Mediciones para Sofía Hernández (ID: 5)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(5, '2023-05-18', 13.5, 87.5, 15.5, 3100, 17.6, -0.2, 0.4, -0.5);

-- Mediciones para Luis García (ID: 6)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(6, '2023-06-30', 12.0, 83.0, 15.0, 3000, 17.4, -0.8, -0.2, -0.9);

-- Mediciones para Valentina López (ID: 7)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(7, '2023-02-12', 16.2, 96.5, 17.2, 3500, 17.4, 0.7, 1.0, 0.5);

-- Mediciones para Daniel Sánchez (ID: 8)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(8, '2023-07-25', 9.8, 76.0, 13.5, 2400, 16.9, -2.5, -2.0, -2.3);

-- Mediciones para Isabella Gómez (ID: 9)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(9, '2023-03-08', 12.8, 86.0, 15.4, 3250, 17.3, -0.4, 0.1, -0.7);

-- Mediciones para Miguel Fernández (ID: 10)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(10, '2023-08-14', 11.5, 81.5, 14.7, 2900, 17.3, -1.2, -0.5, -1.0);

-- ========================================
-- 3. INSERTAR HISTORIA CLÍNICA
-- ========================================

INSERT INTO historia_clinica 
(nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
VALUES
(1, 1, 2, TRUE, NULL, 'exclusiva_6m', TRUE, 'Desarrollo adecuado para su edad'),
(2, 4, 5, FALSE, 'Anemia leve', 'mixta', TRUE, 'Requiere seguimiento nutricional estrecho'),
(3, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Excelente estado de salud'),
(4, 6, 7, FALSE, 'Anemia moderada, parasitosis', 'no_lacto', TRUE, 'Caso de riesgo alto - intervención urgente'),
(5, 2, 2, TRUE, NULL, 'exclusiva_6m', TRUE, 'Buen desarrollo general'),
(6, 3, 3, TRUE, NULL, 'mixta', TRUE, 'Seguimiento regular recomendado'),
(7, 0, 0, TRUE, NULL, 'exclusiva_6m', FALSE, 'Estado nutricional óptimo'),
(8, 8, 9, FALSE, 'Desnutrición crónica, anemia severa', 'no_lacto', TRUE, 'Requiere hospitalización y tratamiento intensivo'),
(9, 2, 3, TRUE, NULL, 'exclusiva_6m', TRUE, 'Desarrollo dentro de parámetros normales'),
(10, 3, 4, TRUE, 'Anemia leve', 'mixta', TRUE, 'Control mensual recomendado');

-- ========================================
-- 4. INSERTAR DATOS SOCIODEMOGRÁFICOS
-- ========================================

INSERT INTO datos_sociodemograficos 
(nino_id, nivel_educativo_madre, nivel_educativo_padre, ingreso_familiar_mensual, numero_hijos, tipo_vivienda, material_vivienda, acceso_agua_potable, acceso_alcantarillado, zona_residencia, municipio)
VALUES
(1, 'secundaria', 'secundaria', 1200000, 2, 'propia', 'concreto', TRUE, TRUE, 'urbana', 'Cúcuta'),
(2, 'primaria', 'primaria', 600000, 4, 'arrendada', 'madera', FALSE, FALSE, 'rural', 'Villa del Rosario'),
(3, 'universitario', 'universitario', 3500000, 1, 'propia', 'concreto', TRUE, TRUE, 'urbana', 'Cúcuta'),
(4, 'ninguno', 'primaria', 400000, 5, 'invasion', 'lata', FALSE, FALSE, 'rural', 'El Tarra'),
(5, 'tecnico', 'secundaria', 1800000, 2, 'propia', 'concreto', TRUE, TRUE, 'urbana', 'Ocaña'),
(6, 'secundaria', 'secundaria', 1000000, 3, 'arrendada', 'concreto', TRUE, FALSE, 'urbana', 'Pamplona'),
(7, 'universitario', 'universitario', 4200000, 2, 'propia', 'concreto', TRUE, TRUE, 'urbana', 'Cúcuta'),
(8, 'ninguno', 'ninguno', 300000, 6, 'invasion', 'lata', FALSE, FALSE, 'rural', 'Tibú'),
(9, 'secundaria', 'tecnico', 1500000, 2, 'familiar', 'concreto', TRUE, TRUE, 'urbana', 'Los Patios'),
(10, 'primaria', 'secundaria', 800000, 3, 'arrendada', 'mixto', FALSE, TRUE, 'rural', 'Sardinata');

-- ========================================
-- 5. INSERTAR PREDICCIONES
-- ========================================

INSERT INTO predicciones 
(nino_id, nivel_riesgo, probabilidad, modelo_usado, features_json)
VALUES
(1, 'bajo', 0.15, 'svm', '{"peso": 13.8, "talla": 89.5, "edad_meses": 30, "imc": 17.2, "z_score_peso_edad": -0.3, "episodios_diarrea": 1, "zona": "urbana", "educacion_madre": "secundaria", "ingreso_familiar": 1200000}'),
(2, 'alto', 0.82, 'svm', '{"peso": 11.8, "talla": 84.5, "edad_meses": 38, "imc": 16.5, "z_score_peso_edad": -1.5, "episodios_diarrea": 4, "zona": "rural", "educacion_madre": "primaria", "ingreso_familiar": 600000}'),
(3, 'bajo', 0.08, 'svm', '{"peso": 16.8, "talla": 98.0, "edad_meses": 48, "imc": 17.5, "z_score_peso_edad": 0.6, "episodios_diarrea": 0, "zona": "urbana", "educacion_madre": "universitario", "ingreso_familiar": 3500000}'),
(4, 'alto', 0.95, 'svm', '{"peso": 10.8, "talla": 80.5, "edad_meses": 22, "imc": 16.6, "z_score_peso_edad": -2.0, "episodios_diarrea": 6, "zona": "rural", "educacion_madre": "ninguno", "ingreso_familiar": 400000}'),
(5, 'bajo', 0.22, 'svm', '{"peso": 13.5, "talla": 87.5, "edad_meses": 42, "imc": 17.6, "z_score_peso_edad": -0.2, "episodios_diarrea": 2, "zona": "urbana", "educacion_madre": "tecnico", "ingreso_familiar": 1800000}'),
(6, 'medio', 0.45, 'svm', '{"peso": 12.0, "talla": 83.0, "edad_meses": 27, "imc": 17.4, "z_score_peso_edad": -0.8, "episodios_diarrea": 3, "zona": "urbana", "educacion_madre": "secundaria", "ingreso_familiar": 1000000}'),
(7, 'bajo', 0.05, 'svm', '{"peso": 16.2, "talla": 96.5, "edad_meses": 52, "imc": 17.4, "z_score_peso_edad": 0.7, "episodios_diarrea": 0, "zona": "urbana", "educacion_madre": "universitario", "ingreso_familiar": 4200000}'),
(8, 'alto', 0.98, 'svm', '{"peso": 9.8, "talla": 76.0, "edad_meses": 15, "imc": 16.9, "z_score_peso_edad": -2.5, "episodios_diarrea": 8, "zona": "rural", "educacion_madre": "ninguno", "ingreso_familiar": 300000}'),
(9, 'bajo', 0.18, 'svm', '{"peso": 12.8, "talla": 86.0, "edad_meses": 35, "imc": 17.3, "z_score_peso_edad": -0.4, "episodios_diarrea": 2, "zona": "urbana", "educacion_madre": "secundaria", "ingreso_familiar": 1500000}'),
(10, 'medio', 0.52, 'svm', '{"peso": 11.5, "talla": 81.5, "edad_meses": 29, "imc": 17.3, "z_score_peso_edad": -1.2, "episodios_diarrea": 3, "zona": "rural", "educacion_madre": "primaria", "ingreso_familiar": 800000}');

-- ========================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ========================================

-- Contar registros por tabla
SELECT 'ninos' AS tabla, COUNT(*) AS total FROM ninos
UNION ALL
SELECT 'mediciones_antropometricas', COUNT(*) FROM mediciones_antropometricas
UNION ALL
SELECT 'historia_clinica', COUNT(*) FROM historia_clinica
UNION ALL
SELECT 'datos_sociodemograficos', COUNT(*) FROM datos_sociodemograficos
UNION ALL
SELECT 'predicciones', COUNT(*) FROM predicciones;

-- ========================================
-- CONSULTAS DE EJEMPLO ÚTILES
-- ========================================

-- 1. Ver todos los niños con su última predicción
SELECT 
    n.nombre,
    n.apellido,
    edad_en_meses(n.fecha_nacimiento) AS edad_meses,
    p.nivel_riesgo,
    p.probabilidad,
    ds.municipio,
    ds.zona_residencia
FROM ninos n
LEFT JOIN LATERAL (
    SELECT * FROM predicciones 
    WHERE nino_id = n.id 
    ORDER BY fecha_prediccion DESC 
    LIMIT 1
) p ON TRUE
LEFT JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
ORDER BY p.probabilidad DESC;

-- 2. Casos de alto riesgo que requieren atención inmediata
SELECT 
    n.nombre || ' ' || n.apellido AS nombre_completo,
    edad_en_meses(n.fecha_nacimiento) AS edad_meses,
    m.peso,
    m.talla,
    m.imc,
    hc.episodios_diarrea,
    hc.infecciones_respiratorias,
    ds.municipio,
    p.probabilidad AS riesgo
FROM ninos n
JOIN predicciones p ON p.nino_id = n.id
JOIN mediciones_antropometricas m ON m.nino_id = n.id
JOIN historia_clinica hc ON hc.nino_id = n.id
JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
WHERE p.nivel_riesgo = 'alto'
AND p.fecha_prediccion = (
    SELECT MAX(fecha_prediccion) 
    FROM predicciones 
    WHERE nino_id = n.id
)
ORDER BY p.probabilidad DESC;

-- 3. Estadísticas por nivel de riesgo
SELECT 
    nivel_riesgo,
    COUNT(*) AS total_casos,
    ROUND(AVG(probabilidad)::NUMERIC, 3) AS probabilidad_promedio,
    MIN(probabilidad) AS prob_min,
    MAX(probabilidad) AS prob_max
FROM predicciones
GROUP BY nivel_riesgo
ORDER BY 
    CASE nivel_riesgo 
        WHEN 'alto' THEN 1 
        WHEN 'medio' THEN 2 
        WHEN 'bajo' THEN 3 
    END;

-- 4. Distribución por municipio
SELECT 
    ds.municipio,
    COUNT(DISTINCT n.id) AS total_ninos,
    SUM(CASE WHEN p.nivel_riesgo = 'alto' THEN 1 ELSE 0 END) AS riesgo_alto,
    SUM(CASE WHEN p.nivel_riesgo = 'medio' THEN 1 ELSE 0 END) AS riesgo_medio,
    SUM(CASE WHEN p.nivel_riesgo = 'bajo' THEN 1 ELSE 0 END) AS riesgo_bajo,
    ROUND(AVG(ds.ingreso_familiar_mensual)::NUMERIC, 0) AS ingreso_promedio
FROM ninos n
JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
LEFT JOIN LATERAL (
    SELECT * FROM predicciones 
    WHERE nino_id = n.id 
    ORDER BY fecha_prediccion DESC 
    LIMIT 1
) p ON TRUE
GROUP BY ds.municipio
ORDER BY riesgo_alto DESC, total_ninos DESC;

-- 5. Niños sin vacunación completa y con alto riesgo
SELECT 
    n.nombre || ' ' || n.apellido AS nombre_completo,
    edad_en_meses(n.fecha_nacimiento) AS edad_meses,
    ds.municipio,
    ds.zona_residencia,
    hc.vacunacion_completa,
    p.nivel_riesgo,
    p.probabilidad
FROM ninos n
JOIN historia_clinica hc ON hc.nino_id = n.id
JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
JOIN predicciones p ON p.nino_id = n.id
WHERE hc.vacunacion_completa = FALSE
AND p.nivel_riesgo IN ('alto', 'medio')
ORDER BY p.probabilidad DESC;

-- 6. Comparación zona urbana vs rural
SELECT 
    ds.zona_residencia,
    COUNT(DISTINCT n.id) AS total_ninos,
    ROUND(AVG(m.peso)::NUMERIC, 2) AS peso_promedio,
    ROUND(AVG(m.talla)::NUMERIC, 2) AS talla_promedio,
    ROUND(AVG(m.imc)::NUMERIC, 2) AS imc_promedio,
    ROUND(AVG(CASE WHEN p.nivel_riesgo = 'alto' THEN 1 ELSE 0 END)::NUMERIC * 100, 1) AS porcentaje_riesgo_alto
FROM ninos n
JOIN datos_sociodemograficos ds ON ds.nino_id = n.id
JOIN LATERAL (
    SELECT * FROM mediciones_antropometricas 
    WHERE nino_id = n.id 
    ORDER BY fecha_medicion DESC 
    LIMIT 1
) m ON TRUE
LEFT JOIN LATERAL (
    SELECT * FROM predicciones 
    WHERE nino_id = n.id 
    ORDER BY fecha_prediccion DESC 
    LIMIT 1
) p ON TRUE
GROUP BY ds.zona_residencia;

-- 7. Usar la vista predefinida
SELECT * FROM vista_ninos_completa
ORDER BY probabilidad_riesgo DESC NULLS LAST;

-- ========================================
-- ¡DATOS DE EJEMPLO LISTOS!
-- ========================================
-- Ahora tienes:
-- - 10 niños registrados
-- - 15 mediciones antropométricas
-- - 10 historias clínicas
-- - 10 registros sociodemográficos
-- - 10 predicciones
--
-- Puedes usar estos datos para:
-- - Probar la API
-- - Entrenar modelos ML
-- - Generar visualizaciones
-- - Desarrollar el frontend
-- ========================================
