-- ========================================
-- SIDI - Datos de Ejemplo COMPLETOS
-- ========================================
-- Dataset extenso con 30 niños y todos sus datos
-- Incluye variedad de casos: riesgo alto, medio, bajo
-- Zonas: Urbana y Rural
-- ========================================

-- ========================================
-- LIMPIAR DATOS EXISTENTES (OPCIONAL)
-- ========================================
-- Descomenta estas líneas si quieres borrar datos anteriores
-- DELETE FROM predicciones;
-- DELETE FROM datos_sociodemograficos;
-- DELETE FROM historia_clinica;
-- DELETE FROM mediciones_antropometricas;
-- DELETE FROM ninos;
-- ALTER SEQUENCE ninos_id_seq RESTART WITH 1;

-- ========================================
-- 1. INSERTAR 30 NIÑOS DE EJEMPLO
-- ========================================

-- IMPORTANTE: Los IDs se generan automáticamente con SERIAL
-- Las referencias usarán los IDs generados

INSERT INTO ninos (nombre, apellido, fecha_nacimiento, sexo, documento_identidad) VALUES
-- Casos de Alto Riesgo (10 niños) - IDs del 1 al 10
('María', 'González Pérez', '2022-03-15', 'F', '1001234567'),
('Juan', 'Martínez López', '2021-08-22', 'M', '1001234568'),
('Carlos', 'Ramírez Torres', '2023-01-05', 'M', '1001234570'),
('Daniel', 'Sánchez Ruiz', '2022-11-25', 'M', '1001234574'),
('Miguel', 'Fernández Cruz', '2021-10-14', 'M', '1001234576'),
('Camila', 'Ortiz Morales', '2022-06-20', 'F', '1001234577'),
('Andrés', 'Vargas Mendoza', '2023-02-10', 'M', '1001234578'),
('Laura', 'Jiménez Reyes', '2021-12-05', 'F', '1001234579'),
('Pedro', 'Castro Navarro', '2022-09-18', 'M', '1001234580'),
('Gabriela', 'Rojas Silva', '2023-04-12', 'F', '1001234581'),

-- Casos de Riesgo Medio (10 niños) - IDs del 11 al 20
('Ana', 'Rodríguez Silva', '2020-11-10', 'F', '1001234569'),
('Sofía', 'Hernández Castro', '2020-05-18', 'F', '1001234571'),
('Luis', 'García Moreno', '2021-09-30', 'M', '1001234572'),
('Isabella', 'Gómez Vargas', '2020-12-08', 'F', '1001234575'),
('Valeria', 'Mendoza López', '2021-03-22', 'F', '1001234582'),
('Diego', 'Paredes Ruiz', '2020-07-15', 'M', '1001234583'),
('Lucía', 'Torres Medina', '2021-01-28', 'F', '1001234584'),
('Mateo', 'Ríos Delgado', '2020-10-11', 'M', '1001234585'),
('Emma', 'Campos Herrera', '2021-05-19', 'F', '1001234586'),
('Sebastián', 'Morales Vega', '2020-08-30', 'M', '1001234587'),

-- Casos de Bajo Riesgo (10 niños) - IDs del 21 al 30
('Valentina', 'López Díaz', '2019-07-12', 'F', '1001234573'),
('Martín', 'Gutiérrez Parra', '2019-04-20', 'M', '1001234588'),
('Paula', 'Soto Romero', '2019-09-15', 'F', '1001234589'),
('Nicolás', 'Peña Salazar', '2019-12-03', 'M', '1001234590'),
('Daniela', 'Cruz Aguirre', '2019-06-25', 'F', '1001234591'),
('Santiago', 'Ramírez Ochoa', '2019-11-08', 'M', '1001234592'),
('Mariana', 'Molina Cárdenas', '2019-03-17', 'F', '1001234593'),
('Felipe', 'Núñez Bravo', '2019-08-29', 'M', '1001234594'),
('Carolina', 'Arias Montoya', '2019-05-14', 'F', '1001234595'),
('Alejandro', 'Ibáñez Suárez', '2019-10-22', 'M', '1001234596');

-- ========================================
-- 2. MEDICIONES ANTROPOMÉTRICAS
-- ========================================

-- CASOS DE ALTO RIESGO (desnutrición severa)
-- NOTA: Usar (SELECT id FROM ninos WHERE documento_identidad = 'XXX') para obtener IDs correctos

-- María González - documento 1001234567
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
((SELECT id FROM ninos WHERE documento_identidad = '1001234567'), '2024-01-15', 9.5, 78.0, 12.8, 2400, 15.6, -2.8, -2.5, -2.6),
((SELECT id FROM ninos WHERE documento_identidad = '1001234567'), '2024-07-15', 10.2, 80.0, 13.2, NULL, 15.9, -2.5, -2.3, -2.4),
((SELECT id FROM ninos WHERE documento_identidad = '1001234567'), '2024-12-01', 10.8, 82.0, 13.5, NULL, 16.1, -2.3, -2.1, -2.2);

-- Juan Martínez (ID: 2)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(2, '2024-02-20', 10.5, 81.0, 13.5, 2600, 16.0, -2.6, -2.2, -2.5),
(2, '2024-08-20', 11.0, 83.0, 14.0, NULL, 16.0, -2.4, -2.0, -2.3),
(2, '2024-11-20', 11.5, 85.0, 14.3, NULL, 15.9, -2.2, -1.8, -2.1);

-- Carlos Ramírez (ID: 3)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(3, '2024-03-05', 8.8, 74.0, 12.2, 2300, 16.1, -3.0, -2.8, -2.9),
(3, '2024-09-05', 9.5, 76.0, 12.8, NULL, 16.4, -2.7, -2.5, -2.6),
(3, '2024-12-05', 10.0, 78.0, 13.0, NULL, 16.4, -2.5, -2.3, -2.4);

-- Daniel Sánchez (ID: 4)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(4, '2024-01-25', 9.2, 76.0, 12.5, 2500, 15.9, -2.9, -2.6, -2.8),
(4, '2024-07-25', 9.8, 78.5, 13.0, NULL, 15.9, -2.6, -2.4, -2.5),
(4, '2024-11-25', 10.5, 80.0, 13.3, NULL, 16.4, -2.4, -2.2, -2.3);

-- Miguel Fernández (ID: 5)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(5, '2024-02-14', 10.8, 82.0, 13.8, 2700, 16.1, -2.5, -2.0, -2.3),
(5, '2024-08-14', 11.5, 84.5, 14.2, NULL, 16.1, -2.2, -1.8, -2.0),
(5, '2024-12-01', 12.0, 86.0, 14.5, NULL, 16.2, -2.0, -1.6, -1.8);

-- Camila Ortiz (ID: 6)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(6, '2024-03-20', 9.0, 75.0, 12.5, 2400, 16.0, -2.8, -2.5, -2.7),
(6, '2024-09-20', 9.8, 77.5, 13.0, NULL, 16.3, -2.5, -2.2, -2.4),
(6, '2024-12-01', 10.2, 79.0, 13.3, NULL, 16.3, -2.3, -2.0, -2.2);

-- Andrés Vargas (ID: 7)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(7, '2024-04-10', 8.5, 72.0, 12.0, 2200, 16.4, -3.1, -2.9, -3.0),
(7, '2024-10-10', 9.2, 74.5, 12.5, NULL, 16.6, -2.8, -2.6, -2.7),
(7, '2024-12-01', 9.8, 76.0, 13.0, NULL, 16.9, -2.5, -2.4, -2.5);

-- Laura Jiménez (ID: 8)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(8, '2024-01-05', 10.0, 79.0, 13.2, 2600, 16.0, -2.7, -2.3, -2.6),
(8, '2024-07-05', 10.8, 81.5, 13.8, NULL, 16.3, -2.4, -2.0, -2.3),
(8, '2024-12-01', 11.5, 83.5, 14.2, NULL, 16.5, -2.1, -1.8, -2.0);

-- Pedro Castro (ID: 9)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(9, '2024-02-18', 9.5, 77.0, 12.8, 2500, 16.0, -2.8, -2.4, -2.7),
(9, '2024-08-18', 10.2, 79.5, 13.3, NULL, 16.1, -2.5, -2.1, -2.4),
(9, '2024-12-01', 10.8, 81.0, 13.8, NULL, 16.4, -2.3, -1.9, -2.2);

-- Gabriela Rojas (ID: 10)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(10, '2024-03-12', 8.2, 70.0, 11.8, 2100, 16.7, -3.2, -3.0, -3.1),
(10, '2024-09-12', 9.0, 72.5, 12.3, NULL, 17.1, -2.9, -2.7, -2.8),
(10, '2024-12-01', 9.5, 74.0, 12.8, NULL, 17.3, -2.6, -2.5, -2.6);

-- CASOS DE RIESGO MEDIO
-- Ana Rodríguez (ID: 11)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(11, '2024-01-10', 14.0, 92.0, 15.5, 3200, 16.5, -1.2, -0.8, -1.0),
(11, '2024-07-10', 15.0, 95.0, 16.0, NULL, 16.6, -1.0, -0.6, -0.8),
(11, '2024-12-01', 15.8, 97.0, 16.5, NULL, 16.8, -0.8, -0.4, -0.6);

-- Sofía Hernández (ID: 12)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(12, '2024-02-18', 12.8, 86.0, 14.8, 3000, 17.3, -1.5, -1.0, -1.3),
(12, '2024-08-18', 13.5, 88.5, 15.2, NULL, 17.2, -1.2, -0.8, -1.0),
(12, '2024-12-01', 14.2, 90.5, 15.6, NULL, 17.3, -1.0, -0.6, -0.8);

-- Luis García (ID: 13)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(13, '2024-03-30', 11.8, 83.0, 14.5, 2900, 17.1, -1.4, -0.9, -1.2),
(13, '2024-09-30', 12.5, 85.5, 15.0, NULL, 17.1, -1.1, -0.7, -0.9),
(13, '2024-12-01', 13.0, 87.0, 15.3, NULL, 17.2, -0.9, -0.5, -0.7);

-- Isabella Gómez (ID: 14)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(14, '2024-01-08', 13.2, 87.0, 15.0, 3100, 17.4, -1.3, -0.7, -1.0),
(14, '2024-07-08', 14.0, 89.5, 15.5, NULL, 17.5, -1.0, -0.5, -0.7),
(14, '2024-12-01', 14.8, 91.5, 16.0, NULL, 17.7, -0.7, -0.3, -0.5);

-- Valeria Mendoza (ID: 15)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(15, '2024-02-22', 12.0, 84.0, 14.6, 2950, 17.0, -1.5, -1.1, -1.3),
(15, '2024-08-22', 12.8, 86.5, 15.0, NULL, 17.1, -1.2, -0.8, -1.0),
(15, '2024-12-01', 13.5, 88.0, 15.4, NULL, 17.4, -0.9, -0.6, -0.8);

-- Diego Paredes (ID: 16)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(16, '2024-03-15', 13.5, 88.0, 15.2, 3050, 17.4, -1.2, -0.8, -1.0),
(16, '2024-09-15', 14.2, 90.5, 15.6, NULL, 17.3, -0.9, -0.6, -0.7),
(16, '2024-12-01', 15.0, 92.5, 16.0, NULL, 17.5, -0.6, -0.4, -0.5);

-- Lucía Torres (ID: 17)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(17, '2024-01-28', 11.5, 82.0, 14.2, 2850, 17.1, -1.6, -1.2, -1.4),
(17, '2024-07-28', 12.2, 84.5, 14.6, NULL, 17.1, -1.3, -0.9, -1.1),
(17, '2024-12-01', 13.0, 86.5, 15.0, NULL, 17.4, -1.0, -0.7, -0.8);

-- Mateo Ríos (ID: 18)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(18, '2024-02-11', 13.8, 89.0, 15.3, 3100, 17.4, -1.1, -0.7, -0.9),
(18, '2024-08-11', 14.5, 91.5, 15.8, NULL, 17.3, -0.8, -0.5, -0.6),
(18, '2024-12-01', 15.2, 93.5, 16.2, NULL, 17.4, -0.6, -0.3, -0.4);

-- Emma Campos (ID: 19)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(19, '2024-03-19', 12.5, 85.0, 14.8, 2980, 17.3, -1.4, -1.0, -1.2),
(19, '2024-09-19', 13.2, 87.5, 15.2, NULL, 17.2, -1.1, -0.7, -0.9),
(19, '2024-12-01', 14.0, 89.5, 15.6, NULL, 17.5, -0.8, -0.5, -0.6);

-- Sebastián Morales (ID: 20)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(20, '2024-01-30', 14.0, 90.0, 15.5, 3150, 17.3, -1.0, -0.6, -0.8),
(20, '2024-07-30', 14.8, 92.5, 16.0, NULL, 17.3, -0.7, -0.4, -0.5),
(20, '2024-12-01', 15.5, 94.5, 16.5, NULL, 17.4, -0.5, -0.2, -0.3);

-- CASOS DE BAJO RIESGO (nutrición adecuada)
-- Valentina López (ID: 21)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(21, '2024-01-12', 16.5, 97.0, 17.0, 3400, 17.5, 0.5, 0.8, 0.3),
(21, '2024-07-12', 17.2, 99.5, 17.5, NULL, 17.4, 0.6, 0.9, 0.4),
(21, '2024-12-01', 18.0, 101.5, 18.0, NULL, 17.5, 0.7, 1.0, 0.5);

-- Martín Gutiérrez (ID: 22)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(22, '2024-02-20', 17.0, 98.5, 17.2, 3500, 17.5, 0.6, 0.9, 0.4),
(22, '2024-08-20', 17.8, 101.0, 17.8, NULL, 17.4, 0.7, 1.0, 0.5),
(22, '2024-12-01', 18.5, 103.0, 18.2, NULL, 17.4, 0.8, 1.1, 0.6);

-- Paula Soto (ID: 23)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(23, '2024-01-15', 16.0, 96.0, 16.8, 3350, 17.4, 0.4, 0.7, 0.2),
(23, '2024-07-15', 16.8, 98.5, 17.3, NULL, 17.3, 0.5, 0.8, 0.3),
(23, '2024-12-01', 17.5, 100.5, 17.8, NULL, 17.3, 0.6, 0.9, 0.4);

-- Nicolás Peña (ID: 24)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(24, '2024-02-03', 17.5, 99.0, 17.5, 3600, 17.9, 0.7, 1.0, 0.5),
(24, '2024-08-03', 18.2, 101.5, 18.0, NULL, 17.7, 0.8, 1.1, 0.6),
(24, '2024-12-01', 19.0, 103.5, 18.5, NULL, 17.7, 0.9, 1.2, 0.7);

-- Daniela Cruz (ID: 25)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(25, '2024-03-25', 16.8, 98.0, 17.2, 3450, 17.5, 0.5, 0.8, 0.3),
(25, '2024-09-25', 17.5, 100.5, 17.7, NULL, 17.3, 0.6, 0.9, 0.4),
(25, '2024-12-01', 18.2, 102.5, 18.2, NULL, 17.3, 0.7, 1.0, 0.5);

-- Santiago Ramírez (ID: 26)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(26, '2024-01-08', 17.2, 99.5, 17.6, 3550, 17.4, 0.6, 0.9, 0.4),
(26, '2024-07-08', 18.0, 102.0, 18.1, NULL, 17.3, 0.7, 1.0, 0.5),
(26, '2024-12-01', 18.8, 104.5, 18.6, NULL, 17.2, 0.8, 1.1, 0.6);

-- Mariana Molina (ID: 27)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(27, '2024-02-17', 16.5, 97.5, 17.0, 3400, 17.4, 0.5, 0.8, 0.3),
(27, '2024-08-17', 17.3, 100.0, 17.5, NULL, 17.3, 0.6, 0.9, 0.4),
(27, '2024-12-01', 18.0, 102.0, 18.0, NULL, 17.3, 0.7, 1.0, 0.5);

-- Felipe Núñez (ID: 28)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(28, '2024-03-29', 17.8, 100.0, 17.8, 3650, 17.8, 0.7, 1.0, 0.5),
(28, '2024-09-29', 18.5, 102.5, 18.3, NULL, 17.6, 0.8, 1.1, 0.6),
(28, '2024-12-01', 19.2, 104.5, 18.8, NULL, 17.6, 0.9, 1.2, 0.7);

-- Carolina Arias (ID: 29)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(29, '2024-01-14', 16.2, 96.5, 16.9, 3380, 17.4, 0.4, 0.7, 0.2),
(29, '2024-07-14', 17.0, 99.0, 17.4, NULL, 17.3, 0.5, 0.8, 0.3),
(29, '2024-12-01', 17.8, 101.0, 17.9, NULL, 17.4, 0.6, 0.9, 0.4);

-- Alejandro Ibáñez (ID: 30)
INSERT INTO mediciones_antropometricas 
(nino_id, fecha_medicion, peso, talla, perimetro_braquial, peso_al_nacer, imc, z_score_peso_edad, z_score_talla_edad, z_score_peso_talla)
VALUES
(30, '2024-02-22', 17.5, 99.5, 17.7, 3580, 17.7, 0.6, 0.9, 0.4),
(30, '2024-08-22', 18.3, 102.0, 18.2, NULL, 17.6, 0.7, 1.0, 0.5),
(30, '2024-12-01', 19.0, 104.0, 18.7, NULL, 17.6, 0.8, 1.1, 0.6);

-- ========================================
-- 3. DATOS SOCIODEMOGRÁFICOS
-- ========================================

-- ZONA RURAL (15 niños - mayor riesgo)
INSERT INTO datos_sociodemograficos 
(nino_id, zona_residencia, acceso_agua_potable, acceso_electricidad, nivel_educativo_madre, ingreso_familiar_mensual)
VALUES
(1, 'rural', FALSE, TRUE, 'primaria', 450000),
(2, 'rural', TRUE, FALSE, 'primaria', 380000),
(3, 'rural', FALSE, FALSE, 'ninguno', 300000),
(4, 'rural', TRUE, TRUE, 'primaria', 420000),
(5, 'rural', FALSE, TRUE, 'secundaria', 480000),
(6, 'rural', TRUE, FALSE, 'primaria', 350000),
(7, 'rural', FALSE, FALSE, 'ninguno', 280000),
(8, 'rural', TRUE, TRUE, 'primaria', 400000),
(9, 'rural', FALSE, TRUE, 'secundaria', 460000),
(10, 'rural', FALSE, FALSE, 'primaria', 320000),
(11, 'rural', TRUE, TRUE, 'secundaria', 520000),
(12, 'rural', TRUE, TRUE, 'secundaria', 550000),
(13, 'rural', FALSE, TRUE, 'primaria', 440000),
(14, 'rural', TRUE, FALSE, 'secundaria', 500000),
(15, 'rural', TRUE, TRUE, 'primaria', 470000);

-- ZONA URBANA (15 niños - menor riesgo)
INSERT INTO datos_sociodemograficos 
(nino_id, zona_residencia, acceso_agua_potable, acceso_electricidad, nivel_educativo_madre, ingreso_familiar_mensual)
VALUES
(16, 'urbana', TRUE, TRUE, 'universitario', 1500000),
(17, 'urbana', TRUE, TRUE, 'secundaria', 900000),
(18, 'urbana', TRUE, TRUE, 'universitario', 1800000),
(19, 'urbana', TRUE, TRUE, 'secundaria', 1000000),
(20, 'urbana', TRUE, TRUE, 'universitario', 1600000),
(21, 'urbana', TRUE, TRUE, 'universitario', 2000000),
(22, 'urbana', TRUE, TRUE, 'universitario', 2200000),
(23, 'urbana', TRUE, TRUE, 'secundaria', 1100000),
(24, 'urbana', TRUE, TRUE, 'universitario', 1900000),
(25, 'urbana', TRUE, TRUE, 'universitario', 1700000),
(26, 'urbana', TRUE, TRUE, 'secundaria', 1200000),
(27, 'urbana', TRUE, TRUE, 'universitario', 1800000),
(28, 'urbana', TRUE, TRUE, 'universitario', 2100000),
(29, 'urbana', TRUE, TRUE, 'secundaria', 1300000),
(30, 'urbana', TRUE, TRUE, 'universitario', 1950000);

-- ========================================
-- 4. HISTORIA CLÍNICA
-- ========================================

-- CASOS DE ALTO RIESGO (historia clínica complicada)
INSERT INTO historia_clinica 
(nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
VALUES
(1, 6, 8, FALSE, 'Anemia severa', 'sin_lactancia', TRUE, 'Requiere seguimiento nutricional urgente. Familia en situación vulnerable.'),
(2, 5, 7, FALSE, 'Anemia moderada', 'mixta', TRUE, 'Falta acceso a alimentos variados. Madre trabajadora informal.'),
(3, 8, 9, FALSE, 'Desnutrición crónica', 'sin_lactancia', TRUE, 'Caso crítico. Requiere intervención inmediata del programa.'),
(4, 7, 6, TRUE, 'Anemia leve', 'exclusiva_6m', TRUE, 'Mejora progresiva con suplementación. Seguimiento mensual.'),
(5, 4, 5, FALSE, 'Anemia moderada', 'mixta', TRUE, 'Familia desplazada. Apoyo social requerido.'),
(6, 6, 7, FALSE, 'Anemia severa', 'sin_lactancia', TRUE, 'Madre adolescente. Requiere educación nutricional.'),
(7, 9, 10, FALSE, 'Desnutrición aguda', 'sin_lactancia', TRUE, 'Caso más crítico del programa. Hospitalización previa.'),
(8, 5, 6, TRUE, 'Anemia leve', 'exclusiva_6m', TRUE, 'Evolución favorable con tratamiento.'),
(9, 6, 8, FALSE, 'Anemia moderada', 'mixta', TRUE, 'Padre desempleado. Situación económica difícil.'),
(10, 8, 9, FALSE, 'Desnutrición severa', 'sin_lactancia', TRUE, 'Nacimiento prematuro. Seguimiento pediátrico intensivo.');

-- CASOS DE RIESGO MEDIO
INSERT INTO historia_clinica 
(nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
VALUES
(11, 3, 4, TRUE, 'Anemia leve', 'exclusiva_6m', TRUE, 'Mejoría notable. Familia colaboradora.'),
(12, 2, 3, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo adecuado. Controles regulares.'),
(13, 3, 5, FALSE, 'Anemia leve', 'mixta', TRUE, 'Requiere completar esquema de vacunación.'),
(14, 2, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Evolución satisfactoria.'),
(15, 4, 4, TRUE, 'Anemia leve', 'mixta', TRUE, 'Madre con conocimientos básicos de nutrición.'),
(16, 1, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Crecimiento dentro de parámetros normales.'),
(17, 3, 3, TRUE, NULL, 'mixta', TRUE, 'Seguimiento preventivo.'),
(18, 2, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Sin complicaciones reportadas.'),
(19, 3, 4, TRUE, 'Anemia leve', 'mixta', TRUE, 'Familia de clase media. Buen acceso a salud.'),
(20, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo óptimo.');

-- CASOS DE BAJO RIESGO (salud óptima)
INSERT INTO historia_clinica 
(nino_id, episodios_diarrea, infecciones_respiratorias, vacunacion_completa, enfermedades_cronicas, lactancia_materna, suplementacion_nutricional, observaciones)
VALUES
(21, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Niña saludable. Familia con buenos hábitos alimenticios.'),
(22, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo psicomotor avanzado. Sin complicaciones.'),
(23, 1, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Controles pediátricos al día. Nutrición balanceada.'),
(24, 0, 0, TRUE, NULL, 'exclusiva_6m', FALSE, 'Salud excelente. Actividad física regular.'),
(25, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Madre nutricionista. Alimentación óptima.'),
(26, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Desarrollo dentro de percentiles superiores.'),
(27, 1, 2, TRUE, NULL, 'exclusiva_6m', FALSE, 'Familia con educación en salud.'),
(28, 0, 0, TRUE, NULL, 'exclusiva_6m', FALSE, 'Sin antecedentes patológicos. Salud óptima.'),
(29, 1, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Crecimiento armónico. Buena alimentación.'),
(30, 0, 1, TRUE, NULL, 'exclusiva_6m', FALSE, 'Niño con excelente desarrollo integral.');

-- ========================================
-- 5. PREDICCIONES (Nivel de Riesgo)
-- ========================================

-- ALTO RIESGO (10 casos)
INSERT INTO predicciones 
(nino_id, nivel_riesgo, probabilidad, fecha_prediccion, modelo_utilizado, factores_principales)
VALUES
(1, 'alto', 0.92, '2024-12-01', 'SVM', 'Z-score bajo, anemia severa, zona rural sin servicios'),
(2, 'alto', 0.89, '2024-11-20', 'Random Forest', 'Desnutrición crónica, múltiples infecciones, falta agua potable'),
(3, 'alto', 0.95, '2024-12-05', 'SVM', 'Caso más crítico, Z-scores muy bajos, sin lactancia'),
(4, 'alto', 0.88, '2024-11-25', 'MLP', 'Bajo peso, anemia, zona rural vulnerable'),
(5, 'alto', 0.86, '2024-12-01', 'Random Forest', 'Familia desplazada, desnutrición progresiva'),
(6, 'alto', 0.90, '2024-12-01', 'SVM', 'Madre adolescente, anemia severa, falta educación'),
(7, 'alto', 0.96, '2024-12-01', 'SVM', 'Desnutrición aguda severa, hospitalización previa'),
(8, 'alto', 0.85, '2024-12-01', 'MLP', 'Múltiples factores de riesgo socioeconómico'),
(9, 'alto', 0.87, '2024-12-01', 'Random Forest', 'Padre desempleado, Z-scores bajos persistentes'),
(10, 'alto', 0.94, '2024-12-01', 'SVM', 'Prematuro, desnutrición severa, bajo peso al nacer');

-- RIESGO MEDIO (10 casos)
INSERT INTO predicciones 
(nino_id, nivel_riesgo, probabilidad, fecha_prediccion, modelo_utilizado, factores_principales)
VALUES
(11, 'medio', 0.65, '2024-12-01', 'Random Forest', 'Anemia leve, zona rural pero buena colaboración familiar'),
(12, 'medio', 0.58, '2024-12-01', 'MLP', 'Leve déficit nutricional, acceso limitado a servicios'),
(13, 'medio', 0.68, '2024-12-01', 'SVM', 'Vacunación incompleta, anemia leve'),
(14, 'medio', 0.55, '2024-12-01', 'Random Forest', 'Zona rural, pero buenos indicadores antropométricos'),
(15, 'medio', 0.62, '2024-12-01', 'MLP', 'Familia con recursos limitados pero estables'),
(16, 'medio', 0.52, '2024-12-01', 'SVM', 'Zona urbana, leve déficit en talla'),
(17, 'medio', 0.60, '2024-12-01', 'Random Forest', 'Historial de infecciones recurrentes'),
(18, 'medio', 0.54, '2024-12-01', 'MLP', 'Leve retraso en curva de crecimiento'),
(19, 'medio', 0.59, '2024-12-01', 'SVM', 'Clase media, anemia leve en tratamiento'),
(20, 'medio', 0.51, '2024-12-01', 'Random Forest', 'Indicadores en rango medio-bajo');

-- BAJO RIESGO (10 casos)
INSERT INTO predicciones 
(nino_id, nivel_riesgo, probabilidad, fecha_prediccion, modelo_utilizado, factores_principales)
VALUES
(21, 'bajo', 0.18, '2024-12-01', 'SVM', 'Todos los indicadores en rango óptimo, zona urbana'),
(22, 'bajo', 0.15, '2024-12-01', 'Random Forest', 'Salud excelente, desarrollo avanzado'),
(23, 'bajo', 0.22, '2024-12-01', 'MLP', 'Familia educada, buenos hábitos alimenticios'),
(24, 'bajo', 0.12, '2024-12-01', 'SVM', 'Sin factores de riesgo identificados'),
(25, 'bajo', 0.19, '2024-12-01', 'Random Forest', 'Madre nutricionista, alimentación óptima'),
(26, 'bajo', 0.16, '2024-12-01', 'MLP', 'Percentiles superiores, desarrollo óptimo'),
(27, 'bajo', 0.20, '2024-12-01', 'SVM', 'Familia con educación en salud'),
(28, 'bajo', 0.13, '2024-12-01', 'Random Forest', 'Todos los parámetros en rango ideal'),
(29, 'bajo', 0.21, '2024-12-01', 'MLP', 'Crecimiento armónico, sin complicaciones'),
(30, 'bajo', 0.17, '2024-12-01', 'SVM', 'Desarrollo integral excelente');

-- ========================================
-- RESUMEN DE DATOS
-- ========================================
-- 30 niños en total:
--   - 10 Alto Riesgo (zona rural, problemas severos)
--   - 10 Riesgo Medio (situación intermedia)
--   - 10 Bajo Riesgo (zona urbana, salud óptima)
--
-- Cada niño tiene:
--   ✅ 3 mediciones antropométricas (evolución en el tiempo)
--   ✅ Datos sociodemográficos completos
--   ✅ Historia clínica detallada
--   ✅ Predicción de riesgo actualizada
--
-- Casos variados para probar:
--   - Filtros por zona (15 rural, 15 urbana)
--   - Filtros por riesgo (10 alto, 10 medio, 10 bajo)
--   - Búsquedas por nombre
--   - Edición y eliminación
--   - Visualización de detalles completos
-- ========================================

SELECT '✅ DATOS DE EJEMPLO CARGADOS EXITOSAMENTE' as status,
       COUNT(*) as total_ninos
FROM ninos;

SELECT '📊 DISTRIBUCIÓN POR RIESGO' as info,
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

SELECT '🗺️ DISTRIBUCIÓN POR ZONA' as info,
       zona_residencia,
       COUNT(*) as cantidad
FROM datos_sociodemograficos
GROUP BY zona_residencia;
