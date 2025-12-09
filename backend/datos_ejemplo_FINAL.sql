-- ========================================
-- SIDI - Datos de Ejemplo FUNCIONALES
-- ========================================
-- Este archivo inserta 30 niños con todos sus datos
-- Usa subconsultas para obtener IDs correctos
-- ========================================

-- ========================================
-- PASO 1: Insertar Niños
-- ========================================

INSERT INTO ninos (nombre, apellido, fecha_nacimiento, sexo, documento_identidad) VALUES
-- ALTO RIESGO (10)
('María', 'González Pérez', '2022-03-15', 'F', 'DOC001'),
('Juan', 'Martínez López', '2021-08-22', 'M', 'DOC002'),
('Carlos', 'Ramírez Torres', '2023-01-05', 'M', 'DOC003'),
('Daniel', 'Sánchez Ruiz', '2022-11-25', 'M', 'DOC004'),
('Miguel', 'Fernández Cruz', '2021-10-14', 'M', 'DOC005'),
('Camila', 'Ortiz Morales', '2022-06-20', 'F', 'DOC006'),
('Andrés', 'Vargas Mendoza', '2023-02-10', 'M', 'DOC007'),
('Laura', 'Jiménez Reyes', '2021-12-05', 'F', 'DOC008'),
('Pedro', 'Castro Navarro', '2022-09-18', 'M', 'DOC009'),
('Gabriela', 'Rojas Silva', '2023-04-12', 'F', 'DOC010'),

-- RIESGO MEDIO (10)
('Ana', 'Rodríguez Silva', '2020-11-10', 'F', 'DOC011'),
('Sofía', 'Hernández Castro', '2020-05-18', 'F', 'DOC012'),
('Luis', 'García Moreno', '2021-09-30', 'M', 'DOC013'),
('Isabella', 'Gómez Vargas', '2020-12-08', 'F', 'DOC014'),
('Valeria', 'Mendoza López', '2021-03-22', 'F', 'DOC015'),
('Diego', 'Paredes Ruiz', '2020-07-15', 'M', 'DOC016'),
('Lucía', 'Torres Medina', '2021-01-28', 'F', 'DOC017'),
('Mateo', 'Ríos Delgado', '2020-10-11', 'M', 'DOC018'),
('Emma', 'Campos Herrera', '2021-05-19', 'F', 'DOC019'),
('Sebastián', 'Morales Vega', '2020-08-30', 'M', 'DOC020'),

-- BAJO RIESGO (10)
('Valentina', 'López Díaz', '2019-07-12', 'F', 'DOC021'),
('Martín', 'Gutiérrez Parra', '2019-04-20', 'M', 'DOC022'),
('Paula', 'Soto Romero', '2019-09-15', 'F', 'DOC023'),
('Nicolás', 'Peña Salazar', '2019-12-03', 'M', 'DOC024'),
('Daniela', 'Cruz Aguirre', '2019-06-25', 'F', 'DOC025'),
('Santiago', 'Ramírez Ochoa', '2019-11-08', 'M', 'DOC026'),
('Mariana', 'Molina Cárdenas', '2019-03-17', 'F', 'DOC027'),
('Felipe', 'Núñez Bravo', '2019-08-29', 'M', 'DOC028'),
('Carolina', 'Arias Montoya', '2019-05-14', 'F', 'DOC029'),
('Alejandro', 'Ibáñez Suárez', '2019-10-22', 'M', 'DOC030');

-- ========================================
-- PASO 2: Mediciones Antropométricas
-- ========================================

-- ALTO RIESGO - Mediciones críticas (20 niños x 3 mediciones = 60 registros)
INSERT INTO mediciones_antropometricas (nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
SELECT id, '2024-01-15'::DATE, 9.5, 78.0, 12.8, 2400, 15.6, -2.8, -2.5, -2.6 FROM ninos WHERE documento_identidad = 'DOC001'
UNION ALL SELECT id, '2024-07-15'::DATE, 10.2, 80.0, 13.2, NULL, 15.9, -2.5, -2.3, -2.4 FROM ninos WHERE documento_identidad = 'DOC001'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.8, 82.0, 13.5, NULL, 16.1, -2.3, -2.1, -2.2 FROM ninos WHERE documento_identidad = 'DOC001'
UNION ALL SELECT id, '2024-02-20'::DATE, 10.5, 81.0, 13.5, 2600, 16.0, -2.6, -2.2, -2.5 FROM ninos WHERE documento_identidad = 'DOC002'
UNION ALL SELECT id, '2024-08-20'::DATE, 11.0, 83.0, 14.0, NULL, 16.0, -2.4, -2.0, -2.3 FROM ninos WHERE documento_identidad = 'DOC002'
UNION ALL SELECT id, '2024-11-20'::DATE, 11.5, 85.0, 14.3, NULL, 15.9, -2.2, -1.8, -2.1 FROM ninos WHERE documento_identidad = 'DOC002'
UNION ALL SELECT id, '2024-03-05'::DATE, 8.8, 74.0, 12.2, 2300, 16.1, -3.0, -2.8, -2.9 FROM ninos WHERE documento_identidad = 'DOC003'
UNION ALL SELECT id, '2024-09-05'::DATE, 9.5, 76.0, 12.8, NULL, 16.4, -2.7, -2.5, -2.6 FROM ninos WHERE documento_identidad = 'DOC003'
UNION ALL SELECT id, '2024-12-05'::DATE, 10.0, 78.0, 13.0, NULL, 16.4, -2.5, -2.3, -2.4 FROM ninos WHERE documento_identidad = 'DOC003'
UNION ALL SELECT id, '2024-01-25'::DATE, 9.2, 76.0, 12.5, 2500, 15.9, -2.9, -2.6, -2.8 FROM ninos WHERE documento_identidad = 'DOC004'
UNION ALL SELECT id, '2024-07-25'::DATE, 9.8, 78.5, 13.0, NULL, 15.9, -2.6, -2.4, -2.5 FROM ninos WHERE documento_identidad = 'DOC004'
UNION ALL SELECT id, '2024-11-25'::DATE, 10.5, 80.0, 13.3, NULL, 16.4, -2.4, -2.2, -2.3 FROM ninos WHERE documento_identidad = 'DOC004'
UNION ALL SELECT id, '2024-02-14'::DATE, 10.8, 82.0, 13.8, 2700, 16.1, -2.5, -2.0, -2.3 FROM ninos WHERE documento_identidad = 'DOC005'
UNION ALL SELECT id, '2024-08-14'::DATE, 11.5, 84.5, 14.2, NULL, 16.1, -2.2, -1.8, -2.0 FROM ninos WHERE documento_identidad = 'DOC005'
UNION ALL SELECT id, '2024-12-01'::DATE, 12.0, 86.0, 14.5, NULL, 16.2, -2.0, -1.6, -1.8 FROM ninos WHERE documento_identidad = 'DOC005'
UNION ALL SELECT id, '2024-03-20'::DATE, 9.0, 75.0, 12.5, 2400, 16.0, -2.8, -2.5, -2.7 FROM ninos WHERE documento_identidad = 'DOC006'
UNION ALL SELECT id, '2024-09-20'::DATE, 9.8, 77.5, 13.0, NULL, 16.3, -2.5, -2.2, -2.4 FROM ninos WHERE documento_identidad = 'DOC006'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.2, 79.0, 13.3, NULL, 16.3, -2.3, -2.0, -2.2 FROM ninos WHERE documento_identidad = 'DOC006'
UNION ALL SELECT id, '2024-04-10'::DATE, 8.5, 72.0, 12.0, 2200, 16.4, -3.1, -2.9, -3.0 FROM ninos WHERE documento_identidad = 'DOC007'
UNION ALL SELECT id, '2024-10-10'::DATE, 9.2, 74.5, 12.5, NULL, 16.6, -2.8, -2.6, -2.7 FROM ninos WHERE documento_identidad = 'DOC007'
UNION ALL SELECT id, '2024-12-01'::DATE, 9.8, 76.0, 13.0, NULL, 16.9, -2.5, -2.4, -2.5 FROM ninos WHERE documento_identidad = 'DOC007'
UNION ALL SELECT id, '2024-01-05'::DATE, 10.0, 79.0, 13.2, 2600, 16.0, -2.7, -2.3, -2.6 FROM ninos WHERE documento_identidad = 'DOC008'
UNION ALL SELECT id, '2024-07-05'::DATE, 10.8, 81.5, 13.8, NULL, 16.3, -2.4, -2.0, -2.3 FROM ninos WHERE documento_identidad = 'DOC008'
UNION ALL SELECT id, '2024-12-01'::DATE, 11.5, 83.5, 14.2, NULL, 16.5, -2.1, -1.8, -2.0 FROM ninos WHERE documento_identidad = 'DOC008'
UNION ALL SELECT id, '2024-02-18'::DATE, 9.5, 77.0, 12.8, 2500, 16.0, -2.8, -2.4, -2.7 FROM ninos WHERE documento_identidad = 'DOC009'
UNION ALL SELECT id, '2024-08-18'::DATE, 10.2, 79.5, 13.3, NULL, 16.1, -2.5, -2.1, -2.4 FROM ninos WHERE documento_identidad = 'DOC009'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.8, 81.0, 13.8, NULL, 16.4, -2.3, -1.9, -2.2 FROM ninos WHERE documento_identidad = 'DOC009'
UNION ALL SELECT id, '2024-03-12'::DATE, 8.2, 70.0, 11.8, 2100, 16.7, -3.2, -3.0, -3.1 FROM ninos WHERE documento_identidad = 'DOC010'
UNION ALL SELECT id, '2024-09-12'::DATE, 9.0, 72.5, 12.3, NULL, 17.1, -2.9, -2.7, -2.8 FROM ninos WHERE documento_identidad = 'DOC010'
UNION ALL SELECT id, '2024-12-01'::DATE, 9.5, 74.0, 12.8, NULL, 17.3, -2.6, -2.5, -2.6 FROM ninos WHERE documento_identidad = 'DOC010'
UNION ALL SELECT id, '2024-01-08'::DATE, 9.3, 77.5, 12.6, 2450, 15.5, -2.7, -2.4, -2.6 FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, '2024-07-08'::DATE, 10.0, 79.5, 13.1, NULL, 15.8, -2.5, -2.2, -2.4 FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.6, 81.5, 13.4, NULL, 16.0, -2.3, -2.0, -2.2 FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, '2024-02-22'::DATE, 8.7, 73.5, 12.3, 2250, 16.1, -2.9, -2.7, -2.8 FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, '2024-08-22'::DATE, 9.4, 75.5, 12.7, NULL, 16.5, -2.7, -2.5, -2.6 FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.1, 77.5, 13.2, NULL, 16.8, -2.4, -2.2, -2.3 FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, '2024-03-15'::DATE, 10.3, 80.5, 13.4, 2550, 15.9, -2.6, -2.3, -2.5 FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, '2024-09-15'::DATE, 11.0, 82.5, 13.9, NULL, 16.1, -2.4, -2.1, -2.3 FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, '2024-12-01'::DATE, 11.7, 84.5, 14.4, NULL, 16.4, -2.1, -1.8, -2.0 FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, '2024-01-30'::DATE, 9.1, 76.5, 12.7, 2480, 15.6, -2.8, -2.5, -2.7 FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, '2024-07-30'::DATE, 9.7, 78.5, 13.1, NULL, 15.7, -2.6, -2.3, -2.5 FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.4, 80.5, 13.6, NULL, 16.0, -2.3, -2.0, -2.2 FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, '2024-02-18'::DATE, 8.6, 72.0, 12.1, 2180, 16.6, -3.0, -2.9, -3.0 FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, '2024-08-18'::DATE, 9.3, 74.0, 12.6, NULL, 17.0, -2.8, -2.7, -2.8 FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, '2024-12-01'::DATE, 9.9, 76.0, 13.1, NULL, 17.1, -2.5, -2.4, -2.5 FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, '2024-03-25'::DATE, 9.4, 77.0, 12.9, 2520, 15.9, -2.7, -2.4, -2.6 FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, '2024-09-25'::DATE, 10.1, 79.0, 13.4, NULL, 16.2, -2.5, -2.2, -2.4 FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.7, 81.0, 13.9, NULL, 16.3, -2.2, -1.9, -2.1 FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, '2024-01-12'::DATE, 10.6, 81.5, 13.6, 2650, 16.0, -2.5, -2.1, -2.4 FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, '2024-07-12'::DATE, 11.3, 83.5, 14.1, NULL, 16.2, -2.3, -1.9, -2.2 FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, '2024-12-01'::DATE, 11.9, 85.5, 14.6, NULL, 16.3, -2.0, -1.6, -1.9 FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, '2024-02-03'::DATE, 8.9, 75.0, 12.4, 2380, 15.8, -2.8, -2.6, -2.7 FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, '2024-08-03'::DATE, 9.6, 77.0, 12.9, NULL, 16.2, -2.6, -2.4, -2.5 FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.3, 79.0, 13.4, NULL, 16.5, -2.3, -2.1, -2.2 FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, '2024-02-28'::DATE, 8.4, 71.5, 11.9, 2150, 16.4, -3.1, -3.0, -3.1 FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, '2024-08-28'::DATE, 9.1, 73.5, 12.4, NULL, 16.8, -2.9, -2.8, -2.9 FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, '2024-12-01'::DATE, 9.7, 75.5, 12.9, NULL, 17.0, -2.6, -2.5, -2.6 FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, '2024-01-14'::DATE, 9.6, 78.0, 13.0, 2580, 15.8, -2.6, -2.3, -2.5 FROM ninos WHERE documento_identidad = 'DOC020'
UNION ALL SELECT id, '2024-07-14'::DATE, 10.3, 80.0, 13.5, NULL, 16.1, -2.4, -2.1, -2.3 FROM ninos WHERE documento_identidad = 'DOC020'
UNION ALL SELECT id, '2024-12-01'::DATE, 10.9, 82.0, 14.0, NULL, 16.2, -2.1, -1.8, -2.0 FROM ninos WHERE documento_identidad = 'DOC020';

-- RIESGO MEDIO - Mediciones intermedias
INSERT INTO mediciones_antropometricas (nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
SELECT id, '2024-01-10'::DATE, 14.0, 92.0, 15.5, 3200, 16.5, -1.2, -0.8, -1.0 FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, '2024-12-01'::DATE, 15.8, 97.0, 16.5, NULL, 16.8, -0.8, -0.4, -0.6 FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, '2024-02-18'::DATE, 12.8, 86.0, 14.8, 3000, 17.3, -1.5, -1.0, -1.3 FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, '2024-12-01'::DATE, 14.2, 90.5, 15.6, NULL, 17.3, -1.0, -0.6, -0.8 FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, '2024-03-30'::DATE, 11.8, 83.0, 14.5, 2900, 17.1, -1.4, -0.9, -1.2 FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, '2024-12-01'::DATE, 13.0, 87.0, 15.3, NULL, 17.2, -0.9, -0.5, -0.7 FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, '2024-01-08'::DATE, 13.2, 87.0, 15.0, 3100, 17.4, -1.3, -0.7, -1.0 FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, '2024-12-01'::DATE, 14.8, 91.5, 16.0, NULL, 17.7, -0.7, -0.3, -0.5 FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, '2024-02-22'::DATE, 12.0, 84.0, 14.6, 2950, 17.0, -1.5, -1.1, -1.3 FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, '2024-12-01'::DATE, 13.5, 88.0, 15.4, NULL, 17.4, -0.9, -0.6, -0.8 FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, '2024-03-15'::DATE, 13.5, 88.0, 15.2, 3050, 17.4, -1.2, -0.8, -1.0 FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, '2024-12-01'::DATE, 15.0, 92.5, 16.0, NULL, 17.5, -0.6, -0.4, -0.5 FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, '2024-01-28'::DATE, 11.5, 82.0, 14.2, 2850, 17.1, -1.6, -1.2, -1.4 FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, '2024-12-01'::DATE, 13.0, 86.5, 15.0, NULL, 17.4, -1.0, -0.7, -0.8 FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, '2024-02-11'::DATE, 13.8, 89.0, 15.3, 3100, 17.4, -1.1, -0.7, -0.9 FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, '2024-12-01'::DATE, 15.2, 93.5, 16.2, NULL, 17.4, -0.6, -0.3, -0.4 FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, '2024-03-19'::DATE, 12.5, 85.0, 14.8, 2980, 17.3, -1.4, -1.0, -1.2 FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, '2024-12-01'::DATE, 14.0, 89.5, 15.6, NULL, 17.5, -0.8, -0.5, -0.6 FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, '2024-01-30'::DATE, 14.0, 90.0, 15.5, 3150, 17.3, -1.0, -0.6, -0.8 FROM ninos WHERE documento_identidad = 'DOC020'
UNION ALL SELECT id, '2024-12-01'::DATE, 15.5, 94.5, 16.5, NULL, 17.4, -0.5, -0.2, -0.3 FROM ninos WHERE documento_identidad = 'DOC020';

-- BAJO RIESGO - Nutrición óptima
INSERT INTO mediciones_antropometricas (nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
SELECT id, '2024-01-12'::DATE, 16.5, 97.0, 17.0, 3400, 17.5, 0.5, 0.8, 0.3 FROM ninos WHERE documento_identidad = 'DOC021'
UNION ALL SELECT id, '2024-12-01'::DATE, 18.0, 101.5, 18.0, NULL, 17.5, 0.7, 1.0, 0.5 FROM ninos WHERE documento_identidad = 'DOC021'
UNION ALL SELECT id, '2024-02-20'::DATE, 17.0, 98.5, 17.2, 3500, 17.5, 0.6, 0.9, 0.4 FROM ninos WHERE documento_identidad = 'DOC022'
UNION ALL SELECT id, '2024-12-01'::DATE, 18.5, 103.0, 18.2, NULL, 17.4, 0.8, 1.1, 0.6 FROM ninos WHERE documento_identidad = 'DOC022'
UNION ALL SELECT id, '2024-01-15'::DATE, 16.0, 96.0, 16.8, 3350, 17.4, 0.4, 0.7, 0.2 FROM ninos WHERE documento_identidad = 'DOC023'
UNION ALL SELECT id, '2024-12-01'::DATE, 17.5, 100.5, 17.8, NULL, 17.3, 0.6, 0.9, 0.4 FROM ninos WHERE documento_identidad = 'DOC023'
UNION ALL SELECT id, '2024-02-03'::DATE, 17.5, 99.0, 17.5, 3600, 17.9, 0.7, 1.0, 0.5 FROM ninos WHERE documento_identidad = 'DOC024'
UNION ALL SELECT id, '2024-12-01'::DATE, 19.0, 103.5, 18.5, NULL, 17.7, 0.9, 1.2, 0.7 FROM ninos WHERE documento_identidad = 'DOC024'
UNION ALL SELECT id, '2024-03-25'::DATE, 16.8, 98.0, 17.2, 3450, 17.5, 0.5, 0.8, 0.3 FROM ninos WHERE documento_identidad = 'DOC025'
UNION ALL SELECT id, '2024-12-01'::DATE, 18.2, 102.5, 18.2, NULL, 17.3, 0.7, 1.0, 0.5 FROM ninos WHERE documento_identidad = 'DOC025'
UNION ALL SELECT id, '2024-01-08'::DATE, 17.2, 99.5, 17.6, 3550, 17.4, 0.6, 0.9, 0.4 FROM ninos WHERE documento_identidad = 'DOC026'
UNION ALL SELECT id, '2024-12-01'::DATE, 18.8, 104.5, 18.6, NULL, 17.2, 0.8, 1.1, 0.6 FROM ninos WHERE documento_identidad = 'DOC026'
UNION ALL SELECT id, '2024-02-17'::DATE, 16.5, 97.5, 17.0, 3400, 17.4, 0.5, 0.8, 0.3 FROM ninos WHERE documento_identidad = 'DOC027'
UNION ALL SELECT id, '2024-12-01'::DATE, 18.0, 102.0, 18.0, NULL, 17.3, 0.7, 1.0, 0.5 FROM ninos WHERE documento_identidad = 'DOC027'
UNION ALL SELECT id, '2024-03-29'::DATE, 17.8, 100.0, 17.8, 3650, 17.8, 0.7, 1.0, 0.5 FROM ninos WHERE documento_identidad = 'DOC028'
UNION ALL SELECT id, '2024-12-01'::DATE, 19.2, 104.5, 18.8, NULL, 17.6, 0.9, 1.2, 0.7 FROM ninos WHERE documento_identidad = 'DOC028'
UNION ALL SELECT id, '2024-01-14'::DATE, 16.2, 96.5, 16.9, 3380, 17.4, 0.4, 0.7, 0.2 FROM ninos WHERE documento_identidad = 'DOC029'
UNION ALL SELECT id, '2024-12-01'::DATE, 17.8, 101.0, 17.9, NULL, 17.4, 0.6, 0.9, 0.4 FROM ninos WHERE documento_identidad = 'DOC029'
UNION ALL SELECT id, '2024-02-22'::DATE, 17.5, 99.5, 17.7, 3580, 17.7, 0.6, 0.9, 0.4 FROM ninos WHERE documento_identidad = 'DOC030'
UNION ALL SELECT id, '2024-12-01'::DATE, 19.0, 104.0, 18.7, NULL, 17.6, 0.8, 1.1, 0.6 FROM ninos WHERE documento_identidad = 'DOC030';

-- ========================================
-- PASO 3: Datos Sociodemográficos
-- ========================================

-- ZONA RURAL (primeros 15)
INSERT INTO datos_sociodemograficos (nino_id, zona_residencia, acceso_agua_potable, acceso_alcantarillado, nivel_educativo_madre, ingreso_familiar_mensual)
SELECT id, 'rural', FALSE, TRUE, 'primaria', 450000 FROM ninos WHERE documento_identidad = 'DOC001'
UNION ALL SELECT id, 'rural', TRUE, FALSE, 'primaria', 380000 FROM ninos WHERE documento_identidad = 'DOC002'
UNION ALL SELECT id, 'rural', FALSE, FALSE, 'ninguno', 300000 FROM ninos WHERE documento_identidad = 'DOC003'
UNION ALL SELECT id, 'rural', TRUE, TRUE, 'primaria', 420000 FROM ninos WHERE documento_identidad = 'DOC004'
UNION ALL SELECT id, 'rural', FALSE, TRUE, 'secundaria', 480000 FROM ninos WHERE documento_identidad = 'DOC005'
UNION ALL SELECT id, 'rural', TRUE, FALSE, 'primaria', 350000 FROM ninos WHERE documento_identidad = 'DOC006'
UNION ALL SELECT id, 'rural', FALSE, FALSE, 'ninguno', 280000 FROM ninos WHERE documento_identidad = 'DOC007'
UNION ALL SELECT id, 'rural', TRUE, TRUE, 'primaria', 400000 FROM ninos WHERE documento_identidad = 'DOC008'
UNION ALL SELECT id, 'rural', FALSE, TRUE, 'secundaria', 460000 FROM ninos WHERE documento_identidad = 'DOC009'
UNION ALL SELECT id, 'rural', FALSE, FALSE, 'primaria', 320000 FROM ninos WHERE documento_identidad = 'DOC010'
UNION ALL SELECT id, 'rural', TRUE, TRUE, 'secundaria', 520000 FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, 'rural', TRUE, TRUE, 'secundaria', 550000 FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, 'rural', FALSE, TRUE, 'primaria', 440000 FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, 'rural', TRUE, FALSE, 'secundaria', 500000 FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, 'rural', TRUE, TRUE, 'primaria', 470000 FROM ninos WHERE documento_identidad = 'DOC015';

-- ZONA URBANA (últimos 15)
INSERT INTO datos_sociodemograficos (nino_id, zona_residencia, acceso_agua_potable, acceso_alcantarillado, nivel_educativo_madre, ingreso_familiar_mensual)
SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1500000 FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'secundaria', 900000 FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1800000 FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'secundaria', 1000000 FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1600000 FROM ninos WHERE documento_identidad = 'DOC020'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 2000000 FROM ninos WHERE documento_identidad = 'DOC021'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 2200000 FROM ninos WHERE documento_identidad = 'DOC022'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'secundaria', 1100000 FROM ninos WHERE documento_identidad = 'DOC023'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1900000 FROM ninos WHERE documento_identidad = 'DOC024'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1700000 FROM ninos WHERE documento_identidad = 'DOC025'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'secundaria', 1200000 FROM ninos WHERE documento_identidad = 'DOC026'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1800000 FROM ninos WHERE documento_identidad = 'DOC027'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 2100000 FROM ninos WHERE documento_identidad = 'DOC028'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'secundaria', 1300000 FROM ninos WHERE documento_identidad = 'DOC029'
UNION ALL SELECT id, 'urbana', TRUE, TRUE, 'universitario', 1950000 FROM ninos WHERE documento_identidad = 'DOC030';

-- ========================================
-- PASO 4: Historia Clínica
-- ========================================

-- ALTO RIESGO (complicaciones)
INSERT INTO historia_clinica (nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
SELECT id, 6, 8, FALSE, 'Anemia severa', 'no_lacto', TRUE, 'Requiere seguimiento nutricional urgente' FROM ninos WHERE documento_identidad = 'DOC001'
UNION ALL SELECT id, 5, 7, FALSE, 'Anemia moderada', 'mixta', TRUE, 'Falta acceso a alimentos variados' FROM ninos WHERE documento_identidad = 'DOC002'
UNION ALL SELECT id, 8, 9, FALSE, 'Desnutrición crónica', 'no_lacto', TRUE, 'Caso crítico. Intervención inmediata' FROM ninos WHERE documento_identidad = 'DOC003'
UNION ALL SELECT id, 7, 6, TRUE, 'Anemia leve', 'exclusiva_6m', TRUE, 'Mejora progresiva con suplementación' FROM ninos WHERE documento_identidad = 'DOC004'
UNION ALL SELECT id, 4, 5, FALSE, 'Anemia moderada', 'mixta', TRUE, 'Familia desplazada' FROM ninos WHERE documento_identidad = 'DOC005'
UNION ALL SELECT id, 6, 7, FALSE, 'Anemia severa', 'no_lacto', TRUE, 'Madre adolescente' FROM ninos WHERE documento_identidad = 'DOC006'
UNION ALL SELECT id, 9, 10, FALSE, 'Desnutrición aguda', 'no_lacto', TRUE, 'Caso más crítico del programa' FROM ninos WHERE documento_identidad = 'DOC007'
UNION ALL SELECT id, 5, 6, TRUE, 'Anemia leve', 'exclusiva_6m', TRUE, 'Evolución favorable' FROM ninos WHERE documento_identidad = 'DOC008'
UNION ALL SELECT id, 6, 8, FALSE, 'Anemia moderada', 'mixta', TRUE, 'Situación económica difícil' FROM ninos WHERE documento_identidad = 'DOC009'
UNION ALL SELECT id, 8, 9, FALSE, 'Desnutrición severa', 'no_lacto', TRUE, 'Nacimiento prematuro' FROM ninos WHERE documento_identidad = 'DOC010';

-- RIESGO MEDIO
INSERT INTO historia_clinica (nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
SELECT id, 3, 4, TRUE, 'Anemia leve', 'exclusiva_6m', TRUE, 'Mejoría notable' FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, 2, 3, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo adecuado' FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, 3, 5, FALSE, 'Anemia leve', 'mixta', TRUE, 'Requiere completar vacunación' FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, 2, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Evolución satisfactoria' FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, 4, 4, TRUE, 'Anemia leve', 'mixta', TRUE, 'Conocimientos básicos nutrición' FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, 1, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Crecimiento normal' FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, 3, 3, TRUE, NULL, 'mixta', TRUE, 'Seguimiento preventivo' FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, 2, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Sin complicaciones' FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, 3, 4, TRUE, 'Anemia leve', 'mixta', TRUE, 'Buen acceso a salud' FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo óptimo' FROM ninos WHERE documento_identidad = 'DOC020';

-- BAJO RIESGO (salud óptima)
INSERT INTO historia_clinica (nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
SELECT id, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Niña saludable' FROM ninos WHERE documento_identidad = 'DOC021'
UNION ALL SELECT id, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo avanzado' FROM ninos WHERE documento_identidad = 'DOC022'
UNION ALL SELECT id, 1, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Nutrición balanceada' FROM ninos WHERE documento_identidad = 'DOC023'
UNION ALL SELECT id, 0, 0, TRUE, NULL, 'exclusiva_6m', FALSE, 'Salud excelente' FROM ninos WHERE documento_identidad = 'DOC024'
UNION ALL SELECT id, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Alimentación óptima' FROM ninos WHERE documento_identidad = 'DOC025'
UNION ALL SELECT id, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Percentiles superiores' FROM ninos WHERE documento_identidad = 'DOC026'
UNION ALL SELECT id, 1, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Educación en salud' FROM ninos WHERE documento_identidad = 'DOC027'
UNION ALL SELECT id, 0, 0, TRUE, NULL, 'exclusiva_6m', FALSE, 'Sin antecedentes patológicos' FROM ninos WHERE documento_identidad = 'DOC028'
UNION ALL SELECT id, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Crecimiento armónico' FROM ninos WHERE documento_identidad = 'DOC029'
UNION ALL SELECT id, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo integral excelente' FROM ninos WHERE documento_identidad = 'DOC030';

-- ========================================
-- PASO 5: Predicciones
-- ========================================

-- ALTO RIESGO
INSERT INTO predicciones (nino_id, nivel_riesgo, probabilidad, fecha_prediccion, modelo_usado)
SELECT id, 'alto', 0.92, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC001'
UNION ALL SELECT id, 'alto', 0.89, '2024-11-20'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC002'
UNION ALL SELECT id, 'alto', 0.95, '2024-12-05'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC003'
UNION ALL SELECT id, 'alto', 0.88, '2024-11-25'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC004'
UNION ALL SELECT id, 'alto', 0.86, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC005'
UNION ALL SELECT id, 'alto', 0.90, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC006'
UNION ALL SELECT id, 'alto', 0.96, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC007'
UNION ALL SELECT id, 'alto', 0.85, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC008'
UNION ALL SELECT id, 'alto', 0.87, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC009'
UNION ALL SELECT id, 'alto', 0.94, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC010';

-- RIESGO MEDIO
INSERT INTO predicciones (nino_id, nivel_riesgo, probabilidad, fecha_prediccion, modelo_usado)
SELECT id, 'medio', 0.65, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC011'
UNION ALL SELECT id, 'medio', 0.58, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC012'
UNION ALL SELECT id, 'medio', 0.68, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC013'
UNION ALL SELECT id, 'medio', 0.55, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC014'
UNION ALL SELECT id, 'medio', 0.62, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC015'
UNION ALL SELECT id, 'medio', 0.52, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC016'
UNION ALL SELECT id, 'medio', 0.60, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC017'
UNION ALL SELECT id, 'medio', 0.54, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC018'
UNION ALL SELECT id, 'medio', 0.59, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC019'
UNION ALL SELECT id, 'medio', 0.51, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC020';

-- BAJO RIESGO
INSERT INTO predicciones (nino_id, nivel_riesgo, probabilidad, fecha_prediccion, modelo_usado)
SELECT id, 'bajo', 0.18, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC021'
UNION ALL SELECT id, 'bajo', 0.15, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC022'
UNION ALL SELECT id, 'bajo', 0.22, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC023'
UNION ALL SELECT id, 'bajo', 0.12, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC024'
UNION ALL SELECT id, 'bajo', 0.19, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC025'
UNION ALL SELECT id, 'bajo', 0.16, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC026'
UNION ALL SELECT id, 'bajo', 0.20, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC027'
UNION ALL SELECT id, 'bajo', 0.13, '2024-12-01'::DATE, 'random_forest' FROM ninos WHERE documento_identidad = 'DOC028'
UNION ALL SELECT id, 'bajo', 0.21, '2024-12-01'::DATE, 'mlp' FROM ninos WHERE documento_identidad = 'DOC029'
UNION ALL SELECT id, 'bajo', 0.17, '2024-12-01'::DATE, 'svm' FROM ninos WHERE documento_identidad = 'DOC030';

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================

SELECT 
    '✅ DATOS CARGADOS CORRECTAMENTE' as status,
    (SELECT COUNT(*) FROM ninos) as total_ninos,
    (SELECT COUNT(*) FROM mediciones_antropometricas) as total_mediciones,
    (SELECT COUNT(*) FROM datos_sociodemograficos) as total_sociodem,
    (SELECT COUNT(*) FROM historia_clinica) as total_historia,
    (SELECT COUNT(*) FROM predicciones) as total_predicciones;

SELECT 
    '📊 DISTRIBUCIÓN POR RIESGO' as info,
    nivel_riesgo,
    COUNT(*) as cantidad
FROM predicciones
GROUP BY nivel_riesgo
ORDER BY 
    CASE nivel_riesgo
        WHEN 'alto' THEN 1
        WHEN 'medio' THEN 2
        WHEN 'bajo' THEN 3
    END;

SELECT 
    '🗺️ DISTRIBUCIÓN POR ZONA' as info,
    zona_residencia,
    COUNT(*) as cantidad
FROM datos_sociodemograficos
GROUP BY zona_residencia;
