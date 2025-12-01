# 📊 ANÁLISIS COMPLETO DEL PROYECTO ACADÉMICO - SIDI

## Sistema Inteligente para la Detección Temprana de Desnutrición Infantil en Norte de Santander

---

## 📋 RESUMEN EJECUTIVO

**Materia:** Sistemas Inteligentes  
**Institución:** Universidad de Pamplona  
**Autores:** Daniel Felipe Contreras Caballero, Jefferson David Mejia Torres  
**Asesor:** José Gerardo Chacón Rangel  
**Año:** 2025  

**Estado Actual del Proyecto:**
- ✅ **Frontend completo:** Interfaz web profesional desplegada en Vercel
- ✅ **Objetivos 1 y 2 completados:** Análisis de datos y selección de algoritmos
- ⚠️ **Pendiente:** Implementación real del backend con ML, base de datos y API
- ⚠️ **Datos:** Actualmente usando datos simulados, necesitan datos reales

---

## 🎯 CONTEXTO ACADÉMICO Y OBJETIVOS

### Objetivo General
Desarrollar un sistema inteligente de detección temprana de desnutrición infantil en Norte de Santander, aplicando **minería de datos** y **aprendizaje supervisado**, para apoyar políticas públicas y generar acciones preventivas de salud.

### Objetivos Específicos Completados

#### ✅ Objetivo 1: Estudiar datos mediante minería de datos
**Estado:** COMPLETADO (teórico)
- Identificaron patrones asociados: educación materna, acceso a servicios, infecciones repetitivas
- Aplicaron clustering (K-Means) encontrando 3 grupos de riesgo
- Variables importantes: nivel educativo madre, peso/edad, infecciones, agua potable

#### ✅ Objetivo 2: Seleccionar técnicas de aprendizaje supervisado
**Estado:** COMPLETADO (experimental)
- **Random Forest:** Accuracy 0.87, Recall 0.82, AUC 0.89
- **SVM (kernel RBF):** Accuracy 0.91, Recall 0.87, AUC 0.92 ← **MEJOR**
- **MLP (1 capa, 25 neuronas):** Accuracy 0.89, Recall 0.85, AUC 0.90

### Objetivos Específicos Pendientes

#### ⚠️ Objetivo 3: Crear modelo predictivo
**Estado:** PENDIENTE
- Implementar SVM seleccionado con datos reales
- Entrenar con dataset completo de Norte de Santander
- Integrar con backend (API REST)

#### ⚠️ Objetivo 4: Validar el sistema
**Estado:** PENDIENTE
- Validación cruzada estratificada
- Métricas finales: Precisión, Recall, F1-score, AUC-ROC
- Pruebas con datos de validación independientes

---

## 📊 DATOS NECESARIOS PARA EL SISTEMA

### 1. Datos Antropométricos (Esenciales)

| Variable | Tipo | Unidad | Fuente | Importancia |
|----------|------|--------|--------|-------------|
| **Edad** | Numérica | Meses | Registro clínico | ⭐⭐⭐⭐⭐ |
| **Peso** | Numérica | Kilogramos | Báscula clínica | ⭐⭐⭐⭐⭐ |
| **Talla/Estatura** | Numérica | Centímetros | Tallímetro | ⭐⭐⭐⭐⭐ |
| **Perímetro braquial** | Numérica | Centímetros | Cinta métrica | ⭐⭐⭐⭐ |
| **IMC** | Derivada | kg/m² | Calculado | ⭐⭐⭐⭐⭐ |
| **Peso al nacer** | Numérica | Gramos | Registro de nacimiento | ⭐⭐⭐⭐ |

### 2. Datos Clínicos (Historial de Salud)

| Variable | Tipo | Opciones | Importancia |
|----------|------|----------|-------------|
| **Episodios de diarrea** | Categórica | 0, 1-2, 3-5, >5 (últimos 6 meses) | ⭐⭐⭐⭐⭐ |
| **Infecciones respiratorias** | Categórica | 0, 1-2, 3-4, >4 (últimos 6 meses) | ⭐⭐⭐⭐ |
| **Vacunación completa** | Binaria | Sí/No | ⭐⭐⭐ |
| **Enfermedades crónicas** | Categórica | Ninguna, Anemia, Parasitosis, Otras | ⭐⭐⭐⭐ |
| **Lactancia materna** | Categórica | Exclusiva <6m, Mixta, No lactó | ⭐⭐⭐⭐ |
| **Suplementación nutricional** | Binaria | Sí/No | ⭐⭐⭐ |

### 3. Datos Sociodemográficos (Contexto Familiar)

| Variable | Tipo | Opciones/Rango | Importancia |
|----------|------|----------------|-------------|
| **Nivel educativo madre** | Categórica | Ninguno, Primaria, Secundaria, Técnico, Universitario | ⭐⭐⭐⭐⭐ |
| **Nivel educativo padre** | Categórica | Ninguno, Primaria, Secundaria, Técnico, Universitario | ⭐⭐⭐ |
| **Ingreso familiar mensual** | Numérica | Pesos colombianos | ⭐⭐⭐⭐ |
| **Número de hijos** | Numérica | 1, 2, 3, 4, >4 | ⭐⭐⭐ |
| **Tipo de vivienda** | Categórica | Propia, Arrendada, Familiar, Invasión | ⭐⭐⭐ |
| **Acceso a agua potable** | Binaria | Sí/No | ⭐⭐⭐⭐⭐ |
| **Acceso a alcantarillado** | Binaria | Sí/No | ⭐⭐⭐⭐ |
| **Material de la vivienda** | Categórica | Concreto, Madera, Lata, Mixto | ⭐⭐⭐ |
| **Zona de residencia** | Categórica | Urbana, Rural | ⭐⭐⭐⭐⭐ |
| **Municipio** | Categórica | 40 municipios de Norte de Santander | ⭐⭐⭐⭐ |

### 4. Datos de Acceso a Servicios

| Variable | Tipo | Opciones | Importancia |
|----------|------|----------|-------------|
| **Afiliación a salud** | Categórica | Contributivo, Subsidiado, No afiliado | ⭐⭐⭐⭐ |
| **Distancia al centro de salud** | Numérica | Kilómetros | ⭐⭐⭐⭐ |
| **Frecuencia de controles** | Categórica | Mensual, Trimestral, Irregular, Nunca | ⭐⭐⭐⭐⭐ |
| **Acceso a programas sociales** | Categórica | Familias en Acción, PAE, ICBF, Ninguno | ⭐⭐⭐⭐ |

### 5. Variables Derivadas (A Calcular)

| Variable | Fórmula/Lógica | Uso |
|----------|----------------|-----|
| **Z-score Peso/Edad** | Según tablas OMS | Clasificación desnutrición global |
| **Z-score Talla/Edad** | Según tablas OMS | Clasificación desnutrición crónica |
| **Z-score Peso/Talla** | Según tablas OMS | Clasificación desnutrición aguda |
| **Índice de vulnerabilidad** | Suma ponderada de factores socioeconómicos | Priorización de intervenciones |
| **Riesgo epidemiológico** | Clustering + reglas clínicas | Categorización de riesgo |

---

## 🗄️ ARQUITECTURA DE BASE DE DATOS PROPUESTA

### Esquema Relacional (PostgreSQL)

```sql
-- TABLA: Niños (Entidad Principal)
CREATE TABLE ninos (
    id_nino SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
    documento_identidad VARCHAR(20) UNIQUE,
    peso_nacimiento DECIMAL(5,2),
    municipio VARCHAR(50),
    zona VARCHAR(10) CHECK (zona IN ('Urbana', 'Rural')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'Activo'
);

-- TABLA: Datos Antropométricos (Historial de Mediciones)
CREATE TABLE mediciones_antropometricas (
    id_medicion SERIAL PRIMARY KEY,
    id_nino INTEGER REFERENCES ninos(id_nino) ON DELETE CASCADE,
    fecha_medicion DATE NOT NULL,
    edad_meses INTEGER NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    talla DECIMAL(5,2) NOT NULL,
    perimetro_braquial DECIMAL(4,2),
    imc DECIMAL(5,2) GENERATED ALWAYS AS (peso / ((talla/100) * (talla/100))) STORED,
    z_score_peso_edad DECIMAL(4,2),
    z_score_talla_edad DECIMAL(4,2),
    z_score_peso_talla DECIMAL(4,2),
    clasificacion_nutricional VARCHAR(30),
    observaciones TEXT,
    id_profesional INTEGER REFERENCES usuarios(id_usuario)
);

-- TABLA: Datos Clínicos
CREATE TABLE historia_clinica (
    id_historia SERIAL PRIMARY KEY,
    id_nino INTEGER REFERENCES ninos(id_nino) ON DELETE CASCADE,
    fecha_registro DATE NOT NULL,
    episodios_diarrea INTEGER DEFAULT 0,
    infecciones_respiratorias INTEGER DEFAULT 0,
    vacunacion_completa BOOLEAN DEFAULT FALSE,
    lactancia_materna VARCHAR(30),
    enfermedades_cronicas TEXT,
    suplementacion_nutricional BOOLEAN DEFAULT FALSE,
    hospitalizaciones_previas INTEGER DEFAULT 0,
    alergias TEXT
);

-- TABLA: Datos Sociodemográficos
CREATE TABLE datos_sociodemograficos (
    id_sociodem SERIAL PRIMARY KEY,
    id_nino INTEGER REFERENCES ninos(id_nino) ON DELETE CASCADE,
    nivel_educativo_madre VARCHAR(30),
    nivel_educativo_padre VARCHAR(30),
    ingreso_familiar_mensual DECIMAL(10,2),
    numero_hijos INTEGER,
    tipo_vivienda VARCHAR(30),
    material_vivienda VARCHAR(30),
    acceso_agua_potable BOOLEAN,
    acceso_alcantarillado BOOLEAN,
    acceso_energia BOOLEAN,
    tipo_afiliacion_salud VARCHAR(30),
    distancia_centro_salud DECIMAL(5,2),
    programas_sociales TEXT[],
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: Predicciones del Modelo
CREATE TABLE predicciones (
    id_prediccion SERIAL PRIMARY KEY,
    id_nino INTEGER REFERENCES ninos(id_nino) ON DELETE CASCADE,
    id_medicion INTEGER REFERENCES mediciones_antropometricas(id_medicion),
    fecha_prediccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modelo_utilizado VARCHAR(50), -- 'SVM', 'RandomForest', 'MLP'
    version_modelo VARCHAR(20),
    nivel_riesgo VARCHAR(20), -- 'Alto', 'Medio', 'Bajo'
    probabilidad_riesgo DECIMAL(5,4), -- 0.0000 a 1.0000
    factores_riesgo JSONB, -- JSON con variables que más influyeron
    recomendaciones TEXT,
    estado_validacion VARCHAR(30) DEFAULT 'Pendiente', -- 'Confirmado', 'Falso Positivo'
    validado_por INTEGER REFERENCES usuarios(id_usuario),
    fecha_validacion TIMESTAMP
);

-- TABLA: Usuarios del Sistema
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) CHECK (rol IN ('Admin', 'Médico', 'Nutricionista', 'Enfermero', 'Analista')),
    institucion VARCHAR(100),
    municipio VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- TABLA: Logs de Auditoría
CREATE TABLE auditoria (
    id_log SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario),
    accion VARCHAR(50), -- 'CREATE', 'UPDATE', 'DELETE', 'PREDICT'
    tabla_afectada VARCHAR(50),
    id_registro INTEGER,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(45),
    datos_anteriores JSONB,
    datos_nuevos JSONB
);

-- ÍNDICES para mejorar rendimiento
CREATE INDEX idx_ninos_municipio ON ninos(municipio);
CREATE INDEX idx_ninos_zona ON ninos(zona);
CREATE INDEX idx_mediciones_nino ON mediciones_antropometricas(id_nino);
CREATE INDEX idx_mediciones_fecha ON mediciones_antropometricas(fecha_medicion);
CREATE INDEX idx_predicciones_nino ON predicciones(id_nino);
CREATE INDEX idx_predicciones_riesgo ON predicciones(nivel_riesgo);
CREATE INDEX idx_predicciones_fecha ON predicciones(fecha_prediccion);
```

---

## 🏗️ ARQUITECTURA DEL SISTEMA COMPLETO

### Stack Tecnológico Recomendado

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPA FRONTEND                          │
│  - HTML5, CSS3, Tailwind CSS, JavaScript                   │
│  - Interfaz actual en Vercel (ya desplegada)               │
│  - Comunicación vía AJAX/Fetch API                         │
└─────────────────────────────────────────────────────────────┘
                            ↕️ REST API (HTTPS)
┌─────────────────────────────────────────────────────────────┐
│                     CAPA BACKEND (API)                      │
│  - Python 3.10+                                             │
│  - Framework: FastAPI o Flask                               │
│  - Autenticación: JWT (JSON Web Tokens)                     │
│  - Endpoints:                                               │
│    • POST /api/predict (predicción)                         │
│    • GET/POST /api/patients (gestión niños)                 │
│    • GET /api/reports (reportes y estadísticas)             │
│    • POST /api/train (reentrenamiento del modelo)           │
└─────────────────────────────────────────────────────────────┘
                            ↕️ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                   CAPA DE BASE DE DATOS                     │
│  - PostgreSQL 14+ (datos estructurados)                     │
│  - Redis (caché para predicciones frecuentes)               │
│  - Backup automático diario                                 │
└─────────────────────────────────────────────────────────────┘
                            ↕️ Pickle/Joblib
┌─────────────────────────────────────────────────────────────┐
│              CAPA DE MACHINE LEARNING                       │
│  - scikit-learn (SVM, Random Forest)                        │
│  - TensorFlow/Keras (MLP, redes neuronales)                 │
│  - pandas, numpy (procesamiento)                            │
│  - joblib (serialización de modelos)                        │
│  - Modelos versionados (model_v1.0.pkl)                     │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Predicción

```
1. Usuario ingresa datos → Frontend
2. Frontend envía JSON → API Backend (POST /api/predict)
3. Backend valida datos y consulta historial → PostgreSQL
4. Backend carga modelo entrenado → SVM.pkl
5. Modelo procesa variables y genera predicción
6. Backend calcula Z-scores y clasifica riesgo
7. Backend guarda predicción → Tabla 'predicciones'
8. Backend retorna JSON con resultado → Frontend
9. Frontend muestra resultado visual al usuario
```

---

## 📦 FUENTES DE DATOS REALES

### 1. Fuentes Oficiales Colombianas

#### ENSIN (Encuesta Nacional de Situación Nutricional)
- **URL:** https://www.minsalud.gov.co/salud/publica/epidemiologia/Paginas/encuesta-nacional-de-situacion-nutricional-ensin.aspx
- **Datos:** Antropométricos, clínicos, sociodemográficos
- **Formato:** Excel, CSV (microdatos públicos)
- **Ventaja:** Representativo a nivel departamental
- **Limitación:** Datos cada 5 años (última: 2015)

#### DANE (Departamento Nacional de Estadística)
- **URL:** https://www.dane.gov.co/
- **Datos:** Condiciones del hogar, ingresos, educación
- **Formato:** CSV, JSON (API disponible)
- **Ventaja:** Actualizado anualmente
- **Limitación:** No tiene datos clínicos directos

#### SISPRO (Sistema Integral de Información de Protección Social)
- **URL:** https://www.sispro.gov.co/
- **Datos:** Registros de atención en salud, morbilidad
- **Formato:** Cubos OLAP, archivos planos
- **Ventaja:** Datos en tiempo real de EPS/IPS
- **Limitación:** Requiere solicitud formal

#### ICBF (Instituto Colombiano de Bienestar Familiar)
- **URL:** https://www.icbf.gov.co/
- **Datos:** Niños en programas de nutrición, centros zonales
- **Formato:** Reportes PDF, solicitud de microdatos
- **Ventaja:** Población vulnerable identificada
- **Limitación:** Acceso restringido por privacidad

### 2. Generación de Datos Sintéticos (Opción Académica)

Si no logran acceso a datos reales, pueden generar datasets sintéticos realistas:

```python
# Generador de datos sintéticos para SIDI
import pandas as pd
import numpy as np
from faker import Faker

fake = Faker('es_CO')
np.random.seed(42)

# Generar 1000 registros de niños
n_registros = 1000

dataset = {
    'edad_meses': np.random.randint(0, 60, n_registros),
    'peso_kg': np.random.normal(12, 3, n_registros).clip(3, 25),
    'talla_cm': np.random.normal(85, 15, n_registros).clip(45, 120),
    'sexo': np.random.choice(['M', 'F'], n_registros),
    'zona': np.random.choice(['Urbana', 'Rural'], n_registros, p=[0.6, 0.4]),
    'educacion_madre': np.random.choice(['Ninguno', 'Primaria', 'Secundaria', 'Universitario'], 
                                        n_registros, p=[0.1, 0.4, 0.35, 0.15]),
    'ingreso_familiar': np.random.choice([500000, 1000000, 1500000, 2500000], n_registros),
    'acceso_agua': np.random.choice([True, False], n_registros, p=[0.7, 0.3]),
    'episodios_diarrea': np.random.poisson(2, n_registros),
    'vacunacion_completa': np.random.choice([True, False], n_registros, p=[0.8, 0.2])
}

df = pd.DataFrame(dataset)

# Calcular IMC y Z-scores (simplificado)
df['imc'] = df['peso_kg'] / ((df['talla_cm']/100) ** 2)

# Clasificación simulada de riesgo (basada en reglas)
def clasificar_riesgo(row):
    score = 0
    if row['imc'] < 14: score += 3
    if row['episodios_diarrea'] > 4: score += 2
    if row['educacion_madre'] == 'Ninguno': score += 2
    if row['zona'] == 'Rural' and not row['acceso_agua']: score += 2
    
    if score >= 6: return 'Alto'
    elif score >= 3: return 'Medio'
    else: return 'Bajo'

df['riesgo_desnutricion'] = df.apply(clasificar_riesgo, axis=1)

df.to_csv('dataset_sidi_sintetico.csv', index=False)
print(f"✅ Dataset sintético generado: {len(df)} registros")
print(df['riesgo_desnutricion'].value_counts())
```

---

## 🤖 IMPLEMENTACIÓN DE LOS MODELOS ML

### 1. Preprocesamiento de Datos

```python
# pipeline_preprocessing.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

class SIDIPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.imputer = SimpleImputer(strategy='median')
    
    def fit_transform(self, df):
        # 1. Calcular variables derivadas
        df['imc'] = df['peso_kg'] / ((df['talla_cm']/100) ** 2)
        
        # 2. Calcular Z-scores (usando tablas OMS simplificadas)
        df['z_peso_edad'] = self._calcular_z_score(df, 'peso', 'edad_meses')
        df['z_talla_edad'] = self._calcular_z_score(df, 'talla', 'edad_meses')
        
        # 3. Codificar variables categóricas
        cat_columns = ['sexo', 'zona', 'educacion_madre', 'tipo_afiliacion']
        for col in cat_columns:
            if col in df.columns:
                le = LabelEncoder()
                df[f'{col}_encoded'] = le.fit_transform(df[col].astype(str))
                self.label_encoders[col] = le
        
        # 4. Imputar valores faltantes
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = self.imputer.fit_transform(df[numeric_cols])
        
        # 5. Normalizar variables numéricas
        scale_cols = ['edad_meses', 'peso_kg', 'talla_cm', 'imc', 'ingreso_familiar']
        df[scale_cols] = self.scaler.fit_transform(df[scale_cols])
        
        return df
    
    def _calcular_z_score(self, df, tipo, edad_col):
        # Implementar cálculo según tablas OMS
        # Por ahora, versión simplificada
        if tipo == 'peso':
            media = 10 + (df[edad_col] * 0.3)
            std = 2.5
        else:  # talla
            media = 70 + (df[edad_col] * 1.2)
            std = 5
        
        return (df[f'{tipo}_kg' if tipo=='peso' else f'{tipo}_cm'] - media) / std
```

### 2. Entrenamiento del Modelo SVM

```python
# train_svm_model.py
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import pandas as pd

# Cargar datos preprocesados
df = pd.read_csv('dataset_sidi_preprocesado.csv')

# Separar features (X) y target (y)
feature_cols = ['edad_meses', 'peso_kg', 'talla_cm', 'imc', 'z_peso_edad', 'z_talla_edad',
                'sexo_encoded', 'zona_encoded', 'educacion_madre_encoded', 
                'ingreso_familiar', 'acceso_agua', 'episodios_diarrea', 'vacunacion_completa']

X = df[feature_cols]
y = df['riesgo_desnutricion']  # 'Alto', 'Medio', 'Bajo'

# División train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, 
                                                      random_state=42, stratify=y)

# Búsqueda de hiperparámetros
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.001, 0.01, 0.1],
    'kernel': ['rbf', 'poly']
}

svm = SVC(probability=True, random_state=42)
grid_search = GridSearchCV(svm, param_grid, cv=5, scoring='f1_weighted', n_jobs=-1, verbose=2)

print("🔄 Entrenando modelo SVM con Grid Search...")
grid_search.fit(X_train, y_train)

# Mejor modelo
best_svm = grid_search.best_estimator_
print(f"✅ Mejores parámetros: {grid_search.best_params_}")

# Evaluación
y_pred = best_svm.predict(X_test)
print("\n📊 REPORTE DE CLASIFICACIÓN:")
print(classification_report(y_test, y_pred))

# AUC-ROC (para clasificación multiclase)
y_proba = best_svm.predict_proba(X_test)
auc = roc_auc_score(y_test, y_proba, multi_class='ovr', average='weighted')
print(f"\n🎯 AUC-ROC: {auc:.4f}")

# Validación cruzada
cv_scores = cross_val_score(best_svm, X, y, cv=10, scoring='accuracy')
print(f"\n✅ Accuracy CV (10-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Guardar modelo
joblib.dump(best_svm, 'models/svm_sidi_v1.0.pkl')
joblib.dump(grid_search.best_params_, 'models/svm_params_v1.0.pkl')
print("\n💾 Modelo guardado en: models/svm_sidi_v1.0.pkl")
```

### 3. API Backend con FastAPI

```python
# main.py (Backend API)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="SIDI API", version="1.0")

# CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hakaton-peach-sigma.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo entrenado
MODEL = joblib.load('models/svm_sidi_v1.0.pkl')
PREPROCESSOR = joblib.load('models/preprocessor_v1.0.pkl')

# Esquema de datos de entrada
class PacienteInput(BaseModel):
    edad_meses: int
    peso_kg: float
    talla_cm: float
    sexo: str  # 'M' o 'F'
    zona: str  # 'Urbana' o 'Rural'
    educacion_madre: str
    ingreso_familiar: float
    acceso_agua: bool
    episodios_diarrea: int
    vacunacion_completa: bool

class PrediccionOutput(BaseModel):
    nivel_riesgo: str
    probabilidad_alto: float
    probabilidad_medio: float
    probabilidad_bajo: float
    imc: float
    z_peso_edad: float
    z_talla_edad: float
    recomendaciones: List[str]
    fecha_prediccion: datetime

@app.post("/api/predict", response_model=PrediccionOutput)
async def predecir_riesgo(paciente: PacienteInput):
    try:
        # 1. Convertir a DataFrame
        df = pd.DataFrame([paciente.dict()])
        
        # 2. Preprocesar
        df_procesado = PREPROCESSOR.transform(df)
        
        # 3. Predecir
        prediccion = MODEL.predict(df_procesado)[0]
        probabilidades = MODEL.predict_proba(df_procesado)[0]
        
        # 4. Calcular métricas adicionales
        imc = paciente.peso_kg / ((paciente.talla_cm/100) ** 2)
        z_peso = (paciente.peso_kg - (10 + paciente.edad_meses*0.3)) / 2.5
        z_talla = (paciente.talla_cm - (70 + paciente.edad_meses*1.2)) / 5
        
        # 5. Generar recomendaciones
        recomendaciones = generar_recomendaciones(prediccion, paciente)
        
        # 6. Retornar resultado
        return PrediccionOutput(
            nivel_riesgo=prediccion,
            probabilidad_alto=float(probabilidades[0]),
            probabilidad_medio=float(probabilidades[1]),
            probabilidad_bajo=float(probabilidades[2]),
            imc=round(imc, 2),
            z_peso_edad=round(z_peso, 2),
            z_talla_edad=round(z_talla, 2),
            recomendaciones=recomendaciones,
            fecha_prediccion=datetime.now()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")

def generar_recomendaciones(riesgo: str, paciente: PacienteInput) -> List[str]:
    recomendaciones = []
    
    if riesgo == "Alto":
        recomendaciones.append("🚨 URGENTE: Remitir inmediatamente a consulta pediátrica especializada")
        recomendaciones.append("🏥 Valoración nutricional completa en las próximas 48 horas")
        recomendaciones.append("💊 Evaluar suplementación con micronutrientes")
    elif riesgo == "Medio":
        recomendaciones.append("⚠️ Programar control nutricional en 15 días")
        recomendaciones.append("🍎 Educación nutricional a la familia")
        recomendaciones.append("📊 Seguimiento antropométrico mensual")
    else:
        recomendaciones.append("✅ Mantener controles de crecimiento y desarrollo regulares")
        recomendaciones.append("🥗 Continuar con alimentación balanceada")
    
    if paciente.episodios_diarrea > 3:
        recomendaciones.append("💧 Evaluación de parasitosis y acceso a agua potable")
    
    if not paciente.vacunacion_completa:
        recomendaciones.append("💉 Completar esquema de vacunación urgente")
    
    return recomendaciones

@app.get("/")
async def root():
    return {"message": "SIDI API v1.0 - Sistema Inteligente de Detección de Desnutrición Infantil"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": MODEL is not None}
```

---

## 🔄 INTEGRACIÓN FRONTEND-BACKEND

### Modificación del script.js actual

```javascript
// Agregar al final de script.js

async function enviarPrediccionReal(formData) {
    const API_URL = 'https://tu-api-sidi.herokuapp.com/api/predict';
    // O para desarrollo local: 'http://localhost:8000/api/predict'
    
    try {
        // Mostrar loading
        resultadoDiv.innerHTML = `
            <div class="text-center py-8">
                <div class="spinner"></div>
                <p class="text-gray-600 mt-4">Analizando datos con inteligencia artificial...</p>
            </div>
        `;
        resultadoDiv.classList.remove('hidden');
        
        // Preparar datos según el esquema de la API
        const payload = {
            edad_meses: formData.tipo === 'bebe' ? parseInt(formData.edad) : parseInt(formData.edad) * 12,
            peso_kg: parseFloat(formData.peso),
            talla_cm: parseFloat(formData.talla),
            sexo: 'M', // Agregar campo al formulario
            zona: formData.zona === 'urbana' ? 'Urbana' : 'Rural',
            educacion_madre: 'Secundaria', // Agregar campo al formulario
            ingreso_familiar: parseFloat(formData.nivel) || 1000000,
            acceso_agua: formData.acceso === 'bueno',
            episodios_diarrea: 0, // Agregar campo al formulario
            vacunacion_completa: true // Agregar campo al formulario
        };
        
        // Llamar a la API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        // Mostrar resultado real del modelo
        mostrarResultadoReal(resultado, formData.tipo);
        
    } catch (error) {
        console.error('❌ Error en predicción:', error);
        resultadoDiv.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 class="text-red-800 font-bold text-xl mb-2">⚠️ Error en la Predicción</h3>
                <p class="text-red-700">
                    No se pudo conectar con el servidor de inteligencia artificial. 
                    Por favor, intente nuevamente o contacte al administrador.
                </p>
                <p class="text-red-600 text-sm mt-2">Detalles técnicos: ${error.message}</p>
            </div>
        `;
    }
}

function mostrarResultadoReal(resultado, tipo) {
    const colorRiesgo = {
        'Alto': 'red',
        'Medio': 'yellow',
        'Bajo': 'green'
    };
    
    const color = colorRiesgo[resultado.nivel_riesgo];
    
    resultadoContenido.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
            <!-- Encabezado -->
            <div class="text-center mb-8">
                <div class="inline-block bg-${color}-100 text-${color}-800 px-6 py-3 rounded-full text-2xl font-bold mb-4">
                    ${resultado.nivel_riesgo === 'Alto' ? '🔴' : resultado.nivel_riesgo === 'Medio' ? '🟡' : '🟢'} 
                    RIESGO ${resultado.nivel_riesgo.toUpperCase()}
                </div>
                <p class="text-gray-600">Análisis realizado con Inteligencia Artificial (SVM)</p>
                <p class="text-gray-500 text-sm">Fecha: ${new Date(resultado.fecha_prediccion).toLocaleString('es-CO')}</p>
            </div>
            
            <!-- Probabilidades -->
            <div class="grid md:grid-cols-3 gap-4 mb-8">
                <div class="bg-red-50 p-4 rounded-lg text-center">
                    <p class="text-red-600 font-semibold">Riesgo Alto</p>
                    <p class="text-3xl font-bold text-red-700">${(resultado.probabilidad_alto * 100).toFixed(1)}%</p>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg text-center">
                    <p class="text-yellow-600 font-semibold">Riesgo Medio</p>
                    <p class="text-3xl font-bold text-yellow-700">${(resultado.probabilidad_medio * 100).toFixed(1)}%</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                    <p class="text-green-600 font-semibold">Riesgo Bajo</p>
                    <p class="text-3xl font-bold text-green-700">${(resultado.probabilidad_bajo * 100).toFixed(1)}%</p>
                </div>
            </div>
            
            <!-- Indicadores Nutricionales -->
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-lg">
                <h4 class="text-blue-800 font-bold text-lg mb-3">
                    <i class="fas fa-chart-line mr-2"></i>Indicadores Nutricionales
                </h4>
                <div class="grid md:grid-cols-3 gap-4">
                    <div>
                        <p class="text-blue-600 font-semibold">IMC</p>
                        <p class="text-2xl font-bold text-blue-800">${resultado.imc}</p>
                    </div>
                    <div>
                        <p class="text-blue-600 font-semibold">Z-Score Peso/Edad</p>
                        <p class="text-2xl font-bold text-blue-800">${resultado.z_peso_edad}</p>
                    </div>
                    <div>
                        <p class="text-blue-600 font-semibold">Z-Score Talla/Edad</p>
                        <p class="text-2xl font-bold text-blue-800">${resultado.z_talla_edad}</p>
                    </div>
                </div>
            </div>
            
            <!-- Recomendaciones -->
            <div class="bg-${color}-50 border-l-4 border-${color}-500 p-6 rounded-lg mb-6">
                <h4 class="text-${color}-800 font-bold text-lg mb-4">
                    <i class="fas fa-stethoscope mr-2"></i>Recomendaciones Médicas
                </h4>
                <ul class="space-y-3">
                    ${resultado.recomendaciones.map(rec => `
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-${color}-600 mr-3 mt-1"></i>
                            <span class="text-${color}-800">${rec}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <!-- Nota Legal -->
            <div class="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>Nota importante:</strong> Este resultado es generado por un modelo de inteligencia artificial 
                y debe ser validado por un profesional de la salud. No reemplaza el diagnóstico médico.
            </div>
            
            <!-- Botón Nueva Predicción -->
            <div class="text-center mt-6">
                <button onclick="location.reload()" 
                        class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all">
                    <i class="fas fa-redo mr-2"></i>Nueva Predicción
                </button>
            </div>
        </div>
    `;
}
```

---

## 📈 MÉTRICAS Y VALIDACIÓN (Objetivo 4)

### Implementación de Validación Cruzada

```python
# validation.py
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import make_scorer, precision_score, recall_score, f1_score, roc_auc_score
import numpy as np

def validar_modelo_completo(modelo, X, y):
    """
    Realiza validación cruzada estratificada de 10 particiones
    Calcula múltiples métricas de rendimiento
    """
    
    # Definir métricas
    scoring = {
        'accuracy': 'accuracy',
        'precision_weighted': make_scorer(precision_score, average='weighted', zero_division=0),
        'recall_weighted': make_scorer(recall_score, average='weighted', zero_division=0),
        'f1_weighted': make_scorer(f1_score, average='weighted', zero_division=0),
        'roc_auc_ovr': make_scorer(roc_auc_score, multi_class='ovr', average='weighted', needs_proba=True)
    }
    
    # Validación cruzada estratificada (10-fold)
    skf = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
    
    print("🔄 Ejecutando validación cruzada estratificada (10-fold)...")
    cv_results = cross_validate(modelo, X, y, cv=skf, scoring=scoring, 
                                 return_train_score=True, n_jobs=-1, verbose=1)
    
    # Resumen de resultados
    print("\n" + "="*60)
    print("📊 RESULTADOS DE VALIDACIÓN CRUZADA (10-FOLD)")
    print("="*60)
    
    for metric in ['accuracy', 'precision_weighted', 'recall_weighted', 'f1_weighted', 'roc_auc_ovr']:
        test_scores = cv_results[f'test_{metric}']
        train_scores = cv_results[f'train_{metric}']
        
        print(f"\n{metric.upper()}:")
        print(f"  Test:  {test_scores.mean():.4f} ± {test_scores.std():.4f}")
        print(f"  Train: {train_scores.mean():.4f} ± {train_scores.std():.4f}")
        print(f"  Folds: {', '.join([f'{s:.4f}' for s in test_scores])}")
    
    print("\n" + "="*60)
    
    # Verificar sobreajuste
    accuracy_diff = cv_results['train_accuracy'].mean() - cv_results['test_accuracy'].mean()
    if accuracy_diff > 0.10:
        print("⚠️  ADVERTENCIA: Posible sobreajuste (diferencia train-test > 10%)")
    else:
        print("✅ Modelo con buen balance (sin sobreajuste significativo)")
    
    return cv_results

# Usar en el script de entrenamiento:
cv_results = validar_modelo_completo(best_svm, X, y)
```

---

## 📋 PRÓXIMOS PASOS RECOMENDADOS

### Fase 1: Obtención de Datos (2 semanas)

- [ ] **Solicitar acceso a ENSIN 2015** (microdatos públicos)
- [ ] **Descargar datos DANE** sobre Norte de Santander
- [ ] **Contactar Secretaría de Salud** de Norte de Santander para datos anonimizados
- [ ] **Alternativa:** Generar dataset sintético realista (1000+ registros)

### Fase 2: Preparación de Datos (1 semana)

- [ ] Limpiar y consolidar datos de múltiples fuentes
- [ ] Crear tabla maestra con todas las variables
- [ ] Calcular Z-scores según tablas OMS
- [ ] Balancear clases con SMOTE o técnicas similares
- [ ] Guardar dataset procesado en formato CSV y PostgreSQL

### Fase 3: Desarrollo Backend (2 semanas)

- [ ] Instalar PostgreSQL y crear esquema de BD
- [ ] Entrenar modelos SVM, Random Forest, MLP con datos reales
- [ ] Implementar API REST con FastAPI
- [ ] Crear endpoints de predicción y gestión de pacientes
- [ ] Implementar autenticación JWT

### Fase 4: Integración Frontend-Backend (1 semana)

- [ ] Modificar formulario para capturar todas las variables necesarias
- [ ] Conectar `script.js` con la API real
- [ ] Implementar manejo de errores y loading states
- [ ] Probar flujo completo end-to-end

### Fase 5: Validación y Documentación (1 semana)

- [ ] Ejecutar validación cruzada de 10 particiones
- [ ] Generar matrices de confusión y curvas ROC
- [ ] Documentar resultados finales (Objetivo 4)
- [ ] Preparar informe técnico para el profesor
- [ ] Crear video demo del sistema funcionando

---

## 💡 RECOMENDACIONES FINALES

### Para el Informe Académico

1. **Incluir en Objetivo 3:**
   - Diagrama de arquitectura del sistema
   - Pseudocódigo de preprocesamiento
   - Código Python de entrenamiento del modelo SVM
   - Esquema de base de datos PostgreSQL

2. **Incluir en Objetivo 4:**
   - Tabla comparativa: SVM vs Random Forest vs MLP
   - Matriz de confusión del modelo final
   - Curvas ROC para cada clase (Alto/Medio/Bajo)
   - Análisis de importancia de variables
   - Validación cruzada 10-fold con resultados estadísticos

### Para la Presentación

- **Demo en vivo:** Mostrar predicción con datos reales desde el frontend
- **Visualizaciones:** Gráficos de rendimiento del modelo
- **Casos de uso:** Ejemplos de predicciones correctas/incorrectas
- **Impacto:** Estadísticas de cuántos niños podrían beneficiarse

### Consideraciones Legales

- **Anonimización:** Nunca usar nombres reales en la BD pública
- **Consentimiento:** Mencionar que datos reales requieren consentimiento informado
- **Ley 1581 de 2012:** Cumplir con protección de datos personales
- **Disclaimer:** Siempre aclarar que el sistema es de apoyo, no diagnóstico definitivo

---

## 🎓 CONCLUSIÓN

El proyecto SIDI tiene **fundamentos académicos sólidos** y es completamente viable técnicamente. Han completado exitosamente los objetivos 1 y 2. Para finalizar el proyecto como requisito de Sistemas Inteligentes, necesitan:

1. **Implementar backend real** con Python + FastAPI + PostgreSQL
2. **Entrenar modelos con datos reales o sintéticos** de Norte de Santander
3. **Validar con métricas robustas** (validación cruzada 10-fold)
4. **Integrar frontend actual** con el backend mediante API REST

El sistema actual (frontend) es profesional y funcional. El siguiente paso crítico es **construir el backend con ML real** para que las predicciones sean generadas por modelos entrenados, no por lógica hardcodeada.

---

**Desarrollado con rigor académico para:**  
📘 Sistemas Inteligentes - Universidad de Pamplona  
👨‍🏫 Asesor: José Gerardo Chacón Rangel  
👨‍💻 Autores: Daniel Contreras & Jefferson Mejia  
📅 2025
