# SIDI - Sistema Inteligente de Detección de Desnutrición Infantil

**Demo en vivo:** [https://hakaton-peach-sigma.vercel.app/](https://hakaton-peach-sigma.vercel.app/)

---

## Descripción del Proyecto

SIDI es una plataforma de salud pública diseñada para el diagnóstico temprano y monitoreo de desnutrición infantil en el departamento Norte de Santander, Colombia. El sistema integra técnicas de Machine Learning con indicadores antropométricos estandarizados por la OMS para proporcionar evaluaciones de riesgo nutricional automatizadas, permitiendo intervenciones tempranas por parte de profesionales de la salud e instituciones sanitarias.

El proyecto implementa un modelo de predicción basado en análisis multifactorial que considera variables antropométricas (peso, talla, perímetro braquial), datos clínicos (episodios de diarrea, infecciones respiratorias), y determinantes socioeconómicos (zona de residencia, nivel educativo materno, acceso a servicios básicos).

---

## Arquitectura del Sistema

### Stack Tecnológico

**Frontend**
- HTML5 + CSS3 con Tailwind CSS para diseño responsivo
- JavaScript Vanilla (sin frameworks)
- Chart.js 4.4.0 para visualización de datos
- Font Awesome 6.4.0 para iconografía

**Backend**
- Supabase (PostgreSQL 15+) como backend-as-a-service
- PostgreSQL Functions para lógica de predicción ML
- Supabase Authentication con gestión de roles
- Row Level Security (RLS) para control de acceso

**Despliegue**
- Frontend: Vercel con CDN global
- Backend: Supabase Cloud Infrastructure

### Modelo de Datos

El esquema de base de datos implementa las siguientes tablas principales:

**`ninos`** - Registro de pacientes pediátricos
- Datos demográficos (nombre, apellido, fecha de nacimiento, sexo)
- Documento de identidad único
- Timestamps de registro

**`mediciones_antropometricas`** - Mediciones físicas
- Peso, talla, perímetro braquial, peso al nacer
- IMC calculado automáticamente
- Z-scores (peso/edad, talla/edad, peso/talla) según estándares OMS
- Relación N:1 con `ninos`

**`factores_riesgo`** - Variables epidemiológicas
- Episodios de diarrea e infecciones respiratorias
- Estado de vacunación
- Antecedentes de desnutrición
- Relación 1:1 con `mediciones_antropometricas`

**`indicadores_socioeconomicos`** - Determinantes sociales
- Zona de residencia (urbana/rural)
- Nivel educativo materno
- Ingreso familiar mensual
- Acceso a servicios básicos (agua potable, saneamiento)
- Seguridad alimentaria

**`predicciones`** - Resultados del modelo ML
- Nivel de riesgo (Bajo/Moderado/Alto)
- Probabilidad de desnutrición (0-100%)
- Clasificación nutricional según OMS
- Recomendaciones automatizadas
- Timestamp de predicción

### Sistema de Roles y Permisos

El sistema implementa tres perfiles de usuario con permisos diferenciados:

| Rol | Capacidades |
|-----|-------------|
| **Médico** | Registro de pacientes, captura de mediciones antropométricas, solicitud de predicciones, consulta de historiales individuales, generación de alertas |
| **Investigador** | Acceso a datos agregados, análisis estadístico, exportación de datasets, visualización de tendencias epidemiológicas |
| **Institución** | Dashboard ejecutivo con KPIs poblacionales, reportes consolidados, gestión de alertas masivas, análisis de coberturas |

---

## Funcionalidades Principales

### Predicción de Desnutrición con Machine Learning

El sistema implementa la función SQL `predecir_desnutricion()` que opera directamente en la capa de base de datos, eliminando la necesidad de servicios externos. Esta función:

**Parámetros de entrada:**
- `edad_meses` (INTEGER): Edad del paciente en meses
- `peso` (NUMERIC): Peso en kilogramos
- `talla` (NUMERIC): Talla en centímetros
- `episodios_diarrea` (INTEGER): Número de episodios en los últimos 6 meses
- `infecciones_respiratorias` (INTEGER): Número de infecciones en los últimos 6 meses
- `zona_residencia` (VARCHAR): 'urbana' o 'rural'
- `nivel_educativo_madre` (VARCHAR): 'ninguno', 'primaria', 'secundaria', 'universitaria'
- `ingreso_familiar` (NUMERIC): Ingreso mensual en COP
- `acceso_agua_potable` (BOOLEAN)
- `vacunacion_completa` (BOOLEAN)

**Valores de retorno:**
- `nivel_riesgo`: Clasificación categórica (Bajo, Moderado, Alto)
- `probabilidad`: Valor numérico entre 0-100%
- `clasificacion`: Desnutrición aguda, crónica, global, peso adecuado
- `imc`: Índice de Masa Corporal calculado
- `z_score_peso_edad`, `z_score_talla_edad`, `z_score_peso_talla`: Desviaciones estándar según tablas OMS
- `recomendaciones`: Array de intervenciones sugeridas

**Algoritmo de clasificación:**
El modelo utiliza un sistema de scoring multidimensional que pondera:
- Z-scores antropométricos (50% del peso)
- Indicadores clínicos (25% del peso)
- Factores socioeconómicos (25% del peso)

Umbrales de riesgo:
- Score < 40: Riesgo Bajo
- Score 40-70: Riesgo Moderado
- Score > 70: Riesgo Alto

### Dashboard Interactivo

El panel de control proporciona visualizaciones en tiempo real:

**Gráficos implementados:**
- Distribución de niveles de riesgo (pie chart)
- Curvas de crecimiento comparadas con percentiles OMS (line chart)
- Histograma de clasificaciones nutricionales (bar chart)
- Tendencias temporales de casos de alto riesgo (time series)

**Filtros disponibles:**
- Rango de fechas
- Sexo del paciente
- Clasificación nutricional
- Zona de residencia

**Tabla de pacientes de alto riesgo:**
Lista dinámica de casos que requieren intervención inmediata, ordenada por probabilidad de desnutrición descendente.

---

## Instalación y Configuración

### Requisitos Previos

- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+)
- Cuenta en Supabase (gratuita o de pago)
- Node.js 16+ (solo para despliegue en Vercel)

### Configuración de Base de Datos

1. Crear proyecto en [Supabase](https://supabase.com)

2. Ejecutar scripts SQL en orden:

```bash
# 1. Crear esquema de tablas
psql -h <db-host> -U postgres -d postgres -f backend/supabase_schema.sql

# 2. Implementar función de predicción ML
psql -h <db-host> -U postgres -d postgres -f backend/funcion_prediccion.sql

# 3. Cargar datos de ejemplo (opcional)
psql -h <db-host> -U postgres -d postgres -f backend/datos_ejemplo.sql
```

O ejecutar directamente en el SQL Editor de Supabase Dashboard.

3. Configurar políticas RLS (Row Level Security):

Las políticas de seguridad ya están incluidas en `supabase_schema.sql`. Verificar que estén activas:

```sql
-- Verificar RLS
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Configuración de Frontend

1. Clonar repositorio:

```bash
git clone https://github.com/Jefferson-MejiaTorres/Hakaton.git
cd Hakaton
```

2. Configurar credenciales de Supabase:

Editar `frontend/js/supabase-integration.js`:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-anon-public-key';
```

Obtener credenciales desde: Supabase Dashboard → Settings → API

3. Ejecutar localmente:

```bash
# Opción 1: Python HTTP Server
python -m http.server 8000

# Opción 2: Node.js http-server
npx http-server frontend -p 8000

# Opción 3: VS Code Live Server extension (recomendado)
# Clic derecho en index.html → "Open with Live Server"
```

Acceder a: `http://localhost:8000`

### Despliegue en Producción

**Vercel (recomendado):**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
cd Hakaton
vercel deploy --prod
```

Configuración automática mediante `vercel.json`.

**Otras plataformas:**
- Netlify: `netlify deploy --prod --dir=frontend`
- GitHub Pages: Configurar Actions workflow con `frontend/` como directorio base

---

## Uso del Sistema

### Registro de Nuevo Paciente

1. Iniciar sesión como usuario con rol "Médico"
2. Navegar a Dashboard → "Nuevo Paciente"
3. Completar formulario con datos demográficos
4. Sistema asigna ID único automáticamente

### Captura de Mediciones

1. Seleccionar paciente existente
2. Ingresar mediciones antropométricas (peso, talla, perímetro braquial)
3. Agregar factores de riesgo (diarrea, infecciones)
4. Completar indicadores socioeconómicos
5. Sistema calcula IMC y Z-scores automáticamente

### Solicitar Predicción

1. Con mediciones capturadas, clic en "Evaluar Riesgo"
2. Sistema ejecuta función `predecir_desnutricion()`
3. Resultados mostrados en modal con:
   - Nivel de riesgo con código de color
   - Probabilidad numérica
   - Clasificación nutricional OMS
   - Recomendaciones de intervención
4. Predicción almacenada en base de datos con timestamp

### Visualización de Datos (Investigadores)

1. Acceder a sección "Análisis"
2. Seleccionar período de estudio
3. Visualizar gráficos agregados
4. Exportar datos en formato CSV para análisis externo

---

## Estructura del Proyecto

```
Hakaton/
│
├── frontend/                      # Aplicación web cliente
│   ├── index.html                # Landing page
│   ├── login.html                # Autenticación de usuarios
│   ├── register.html             # Registro de nuevos usuarios
│   ├── dashboard.html            # Panel de control principal
│   ├── about.html                # Información del proyecto
│   │
│   ├── css/
│   │   └── styles.css            # Estilos personalizados + Tailwind
│   │
│   └── js/
│       ├── auth.js               # Lógica de autenticación Supabase
│       ├── dashboard.js          # Funcionalidad del dashboard
│       └── supabase-integration.js  # Cliente Supabase + configuración
│
├── backend/                      # Scripts de base de datos
│   ├── supabase_schema.sql       # DDL completo (tablas, índices, RLS)
│   ├── funcion_prediccion.sql    # Función ML en PL/pgSQL
│   ├── datos_ejemplo.sql         # Dataset de 30 pacientes de prueba
│   └── requirements.txt          # Dependencias Python (para futuros notebooks)
│
├── vercel.json                   # Configuración de despliegue Vercel
├── GUIA_COMPLETA.md              # Documentación técnica extendida
└── README.md                     # Este archivo
```

---

## API de Predicción

### Endpoint: Función PostgreSQL

```sql
SELECT * FROM predecir_desnutricion(
    p_edad_meses := 24,
    p_peso := 10.5,
    p_talla := 82.0,
    p_episodios_diarrea := 2,
    p_infecciones_respiratorias := 1,
    p_zona_residencia := 'rural',
    p_nivel_educativo_madre := 'primaria',
    p_ingreso_familiar := 800000,
    p_acceso_agua_potable := false,
    p_vacunacion_completa := true
);
```

### Respuesta Ejemplo

```json
{
  "nivel_riesgo": "Alto",
  "probabilidad": 78.5,
  "clasificacion": "Desnutrición aguda moderada",
  "imc": 15.6,
  "z_score_peso_edad": -2.1,
  "z_score_talla_edad": -1.8,
  "z_score_peso_talla": -2.3,
  "recomendaciones": [
    "Derivación inmediata a nutricionista",
    "Evaluación de seguridad alimentaria familiar",
    "Seguimiento quincenal de peso/talla",
    "Suplementación con micronutrientes"
  ]
}
```

---

## Contribuir al Proyecto

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama específica: `git checkout -b feature/nueva-funcionalidad`
3. Implementar cambios siguiendo convenciones de código
4. Ejecutar pruebas locales
5. Commit con mensajes descriptivos: `git commit -m "feat: agregar exportación CSV en dashboard"`
6. Push a rama: `git push origin feature/nueva-funcionalidad`
7. Abrir Pull Request con descripción detallada

### Convenciones de Código

- **JavaScript:** ESLint config estándar, camelCase para variables
- **SQL:** Snake_case para tablas/columnas, UPPER_CASE para keywords
- **HTML/CSS:** Indentación 2 espacios, clases semánticas

### Áreas de Mejora

- Implementación de tests unitarios (Jest)
- Migración a framework moderno (React/Vue)
- API REST para integraciones externas
- Módulo de exportación a estándares HL7 FHIR
- Implementación de modelo ML con Scikit-learn/TensorFlow
- Soporte multiidioma (i18n)

---

## Documentación Adicional

- **Guía técnica completa:** `GUIA_COMPLETA.md`
- **Esquema de base de datos:** `backend/supabase_schema.sql` (comentarios inline)
- **Modelo de predicción:** `backend/funcion_prediccion.sql` (documentación PL/pgSQL)

---

## Equipo de Desarrollo

**Universidad de Pamplona - Norte de Santander, Colombia**

- Daniel Felipe Contreras Caballero
- Jefferson David Mejía Torres

**Contacto:** jefferson.de.la.torres.2025@gmail.com  
**Repositorio:** [https://github.com/Jefferson-MejiaTorres/Hakaton](https://github.com/Jefferson-MejiaTorres/Hakaton)  
**Año:** 2025

---

## Referencias

- Organización Mundial de la Salud (OMS). (2006). *Estándares de crecimiento infantil.*
- Instituto Colombiano de Bienestar Familiar (ICBF). (2015). *Encuesta Nacional de Situación Nutricional (ENSIN).*
- Supabase Documentation. [https://supabase.com/docs](https://supabase.com/docs)
