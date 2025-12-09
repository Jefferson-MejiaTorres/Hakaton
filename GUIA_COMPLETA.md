# 🏥 SIDI - Guía Completa del Sistema

**Sistema Inteligente de Detección de Desnutrición Infantil**  
Universidad de Pamplona - Norte de Santander, Colombia

---

## 📋 ÍNDICE

1. [Descripción del Proyecto](#descripción)
2. [Estructura del Proyecto](#estructura)
3. [Roles del Sistema](#roles)
4. [Configuración y Despliegue](#configuración)
5. [Funcionalidades Implementadas](#funcionalidades)
6. [Base de Datos](#base-de-datos)

---

## 🎯 DESCRIPCIÓN

SIDI es un sistema web inteligente que detecta y monitorea casos de desnutrición infantil en el Norte de Santander usando machine learning.

### Problema que Resuelve
- 12% de desnutrición crónica en menores de 5 años en Norte de Santander
- Falta de herramientas digitales para detección temprana
- Necesidad de centralizar datos de salud infantil

### Solución
Sistema web con 3 roles diferenciados:
- **Personal Médico**: Gestión completa de pacientes y diagnósticos
- **Investigación**: Análisis avanzado y exportación de datos
- **Institución**: Reportes y monitoreo de alertas

---

## 📁 ESTRUCTURA DEL PROYECTO

```
Hakaton/
├── frontend/                    # Aplicación web (Vercel)
│   ├── index.html              # Landing page con selector de rol
│   ├── login.html              # Inicio de sesión
│   ├── register.html           # Registro de usuarios
│   ├── dashboard.html          # Dashboard principal (protegido)
│   ├── about.html              # Información del proyecto
│   ├── css/
│   │   └── styles.css          # Estilos personalizados
│   └── js/
│       ├── auth.js             # Autenticación
│       ├── dashboard.js        # Lógica del dashboard (2400+ líneas)
│       └── supabase-integration.js
│
├── backend/                     # Scripts SQL y datos
│   ├── supabase_schema.sql     # Schema de base de datos
│   ├── funcion_prediccion.sql  # Modelo ML en SQL
│   ├── datos_ejemplo.sql       # Datos de prueba (30 pacientes)
│   └── README.md               # Documentación del backend
│
├── GUIA_COMPLETA.md            # Este archivo
├── README.md                    # Documentación principal
└── vercel.json                  # Configuración de despliegue
```

---

## 👥 ROLES DEL SISTEMA

### 👨‍⚕️ Personal Médico (`role=medico`)

**Funcionalidades:**
- ✅ Dashboard con estadísticas
- ✅ Gestionar Pacientes (CRUD completo)
  - Ver listado con filtros (nombre, zona, riesgo)
  - Ver detalles con historial completo
  - Editar información básica
  - Eliminar pacientes con confirmación
- ✅ Registrar Paciente
  - Datos básicos (nombre, fecha nacimiento, sexo, documento)
  - Mediciones antropométricas (peso, talla, perímetro braquial)
  - Datos sociodemográficos (zona, educación madre, ingreso)
  - **Diagnóstico automático** al guardar
- ✅ Agregar Medición
  - Buscador inteligente de pacientes
  - Formulario de nueva medición
  - Opción de evaluación automática
  - Historial de mediciones y evaluaciones

**Menú Visible:**
- Dashboard
- Gestionar Pacientes
- Registrar Paciente
- Agregar Medición

---

### 🔬 Investigación (`role=investigador`)

**Funcionalidades:**
- ✅ Dashboard (solo lectura)
- ✅ Análisis Avanzado (filtros por fecha)
- ✅ Exportar Datos (CSV/JSON/Excel)

**Permisos:**
- ❌ NO puede registrar pacientes
- ❌ NO puede editar información
- ✅ Solo lectura y análisis

**Menú Visible:**
- Dashboard
- Análisis Avanzado
- Exportar Datos

---

### 🏫 Institución Educativa (`role=institucion`)

**Funcionalidades:**
- ✅ Dashboard (solo lectura)
- ✅ Generar Reportes PDF
- ✅ Alertas de Riesgo Alto

**Permisos:**
- ❌ NO puede registrar pacientes
- ❌ NO puede editar información
- ✅ Solo lectura y reportes

**Menú Visible:**
- Dashboard
- Reportes
- Alertas de Riesgo

---

## ⚙️ CONFIGURACIÓN Y DESPLIEGUE

### 1. Configuración de Supabase

**Variables de Entorno Necesarias:**
```javascript
SUPABASE_URL = 'https://hfeixwjdgvmrackugnsr.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

**Ubicaciones en el código:**
- `frontend/js/auth.js` (líneas 5-6)
- `frontend/js/dashboard.js` (líneas 7-8)
- `frontend/js/supabase-integration.js` (líneas 6-7)
- `frontend/login.html` (líneas 162-163)
- `frontend/register.html` (líneas 162-163)

### 2. Configurar Base de Datos en Supabase

**Ejecutar en orden:**

1. **Schema** (`backend/supabase_schema.sql`):
   ```sql
   -- Crea tablas: ninos, mediciones_antropometricas, 
   -- historia_clinica, datos_sociodemograficos, predicciones
   ```

2. **Función de Predicción** (`backend/funcion_prediccion.sql`):
   ```sql
   -- Crea función: predecir_simple()
   -- Modelo ML directo en PostgreSQL
   ```

3. **Datos de Ejemplo** (`backend/datos_ejemplo.sql`):
   ```sql
   -- Inserta 30 pacientes con datos completos
   -- Casos de riesgo alto, medio y bajo
   ```

4. **Políticas RLS** (Row Level Security):
   ```sql
   -- Habilitar RLS
   ALTER TABLE ninos ENABLE ROW LEVEL SECURITY;
   ALTER TABLE mediciones_antropometricas ENABLE ROW LEVEL SECURITY;
   ALTER TABLE datos_sociodemograficos ENABLE ROW LEVEL SECURITY;
   ALTER TABLE predicciones ENABLE ROW LEVEL SECURITY;
   
   -- Crear políticas para usuarios autenticados
   CREATE POLICY "Usuarios autenticados pueden todo" ON ninos
   FOR ALL USING (auth.role() = 'authenticated');
   
   CREATE POLICY "Usuarios autenticados pueden todo" ON mediciones_antropometricas
   FOR ALL USING (auth.role() = 'authenticated');
   
   CREATE POLICY "Usuarios autenticados pueden todo" ON datos_sociodemograficos
   FOR ALL USING (auth.role() = 'authenticated');
   
   CREATE POLICY "Usuarios autenticados pueden todo" ON predicciones
   FOR ALL USING (auth.role() = 'authenticated');
   ```

### 3. Desplegar en Vercel

**Paso a Paso:**

1. **Subir a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SIDI complete"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/Hakaton.git
   git push -u origin main
   ```

2. **Conectar Vercel:**
   - Ve a https://vercel.com
   - Click en "New Project"
   - Importa tu repositorio de GitHub
   - Configuración:
     - Framework Preset: **Other**
     - Root Directory: `./`
     - Build Command: (dejar vacío)
     - Output Directory: `frontend`
     - Install Command: (dejar vacío)

3. **Variables de Entorno en Vercel:**
   
   ⚠️ **IMPORTANTE**: NO es necesario agregar variables de entorno en Vercel porque las keys están directamente en el código del frontend (son públicas, diseñadas para eso).
   
   Las `SUPABASE_ANON_KEY` son seguras para el frontend porque:
   - Solo permiten operaciones autorizadas por RLS
   - Requieren autenticación del usuario
   - Las políticas de seguridad están en Supabase, no en el frontend

4. **Deploy:**
   - Click "Deploy"
   - Espera 2-3 minutos
   - Tu app estará en: `https://tu-proyecto.vercel.app`

### 4. Verificar que Funciona

✅ Checklist:
- [ ] Landing page carga correctamente
- [ ] Login funciona (crear cuenta de prueba)
- [ ] Dashboard muestra estadísticas
- [ ] Registrar paciente funciona y genera diagnóstico
- [ ] Gestionar pacientes muestra la lista
- [ ] Agregar medición funciona el buscador

---

## 🔧 FUNCIONALIDADES IMPLEMENTADAS

### Diagnóstico Automático

**Cómo funciona:**
1. Al registrar paciente o agregar medición
2. Se calculan automáticamente:
   - IMC (Índice de Masa Corporal)
   - Edad en meses
   - Z-scores (peso/edad, talla/edad)
3. Se ejecuta función SQL `predecir_simple()`
4. Retorna:
   - **Nivel de Riesgo**: Alto / Medio / Bajo
   - **Probabilidad**: 0-100%
   - **Factores de Riesgo**: Lista de indicadores
   - **Recomendaciones**: Acciones sugeridas

**Algoritmo de Predicción:**
- Basado en estándares OMS
- Considera 9 factores ponderados:
  - Z-scores antropométricos (55%)
  - Indicadores de salud (25%)
  - Factores socioeconómicos (20%)
- Clasificación:
  - ≥60 puntos = ALTO RIESGO
  - 30-59 puntos = RIESGO MEDIO
  - <30 puntos = BAJO RIESGO

### Seguimiento Continuo

**Historial de Evaluaciones:**
- Se guardan todas las predicciones con fecha
- Modal de detalles muestra timeline completo
- Permite ver evolución del paciente

**Nueva Medición:**
- Buscar paciente por nombre/documento
- Agregar peso, talla nuevos
- Checkbox para evaluación automática
- Historial actualizado en tiempo real

---

## 🗄️ BASE DE DATOS

### Tablas Principales

**ninos**
- id, nombre, apellido, fecha_nacimiento, sexo, documento_identidad
- PRIMARY KEY: id

**mediciones_antropometricas**
- id, nino_id (FK), fecha_medicion, peso, talla, imc, perimetro_braquial
- Z-scores: peso_edad, talla_edad, peso_talla

**datos_sociodemograficos**
- id, nino_id (FK), zona_residencia, nivel_educativo_madre, ingreso_familiar_mensual

**predicciones**
- id, nino_id (FK), fecha_prediccion, nivel_riesgo, probabilidad, modelo_usado
- features_json (JSONB): almacena todos los datos de entrada

**historia_clinica**
- id, nino_id (FK), episodios_diarrea, infecciones_respiratorias, vacunacion_completa

### Relaciones
```
ninos (1) → (∞) mediciones_antropometricas
ninos (1) → (1) datos_sociodemograficos
ninos (1) → (∞) predicciones
ninos (1) → (1) historia_clinica
```

---

## 🚀 PRÓXIMOS PASOS

### Implementar Rol Investigación
1. **Análisis Avanzado:**
   - Gráficas de tendencias temporales
   - Filtros por municipio, zona, rango de edad
   - Comparativas entre grupos

2. **Exportación:**
   - CSV con todos los datos
   - JSON para integraciones
   - Excel con formato

### Implementar Rol Institución
1. **Reportes PDF:**
   - Resumen mensual ejecutivo
   - Listado de casos críticos
   - Gráficas integradas

2. **Alertas:**
   - Notificaciones de casos alto riesgo
   - Dashboard de casos urgentes

---

## 📞 SOPORTE

**Documentación Técnica:**
- Schema SQL: `backend/supabase_schema.sql`
- Función Predicción: `backend/funcion_prediccion.sql`
- README Backend: `backend/README.md`

**Credenciales de Prueba:**
```
Email: test@sidi.com
Password: test123456
```

---

## 📄 LICENCIA

Proyecto académico - Universidad de Pamplona  
Norte de Santander, Colombia - 2024
