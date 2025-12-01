# 🗺️ HOJA DE RUTA COMPLETA - IMPLEMENTACIÓN SIDI

## Sistema Inteligente de Detección de Desnutrición Infantil

**Proyecto:** Sistemas Inteligentes - Universidad de Pamplona  
**Autores:** Daniel Contreras & Jefferson Mejia  
**Tiempo Estimado Total:** 6-8 semanas  

---

## 📅 CRONOGRAMA GENERAL

| Fase | Duración | Entregables |
|------|----------|-------------|
| **FASE 1:** Preparación del Entorno | 3-4 días | Entorno Python, PostgreSQL instalado |
| **FASE 2:** Generación de Datos | 4-5 días | Dataset con 1000+ registros |
| **FASE 3:** Implementación Base de Datos | 3-4 días | BD PostgreSQL operativa |
| **FASE 4:** Preprocesamiento y Análisis | 5-7 días | Pipeline de datos listo |
| **FASE 5:** Entrenamiento de Modelos | 7-10 días | Modelos entrenados y evaluados |
| **FASE 6:** API Backend | 7-10 días | API REST funcional |
| **FASE 7:** Integración Frontend-Backend | 4-5 días | Sistema end-to-end |
| **FASE 8:** Validación y Documentación | 5-7 días | Informe técnico completo |

---

# 🎯 FASE 1: PREPARACIÓN DEL ENTORNO (3-4 días)

## Día 1: Instalación de Software Base

### 1.1. Instalar Python 3.10+

**Windows:**
```bash
# Descargar desde python.org/downloads (versión 3.10 o superior)
# Durante la instalación:
# ✅ Marcar "Add Python to PATH"
# ✅ Marcar "Install pip"

# Verificar instalación
python --version
# Debe mostrar: Python 3.10.x o superior

pip --version
# Debe mostrar: pip 23.x o superior
```

**Crear carpeta del proyecto backend:**
```bash
cd /c/Users/ASUS/Proyectos/Hakaton
mkdir backend
cd backend
```

### 1.2. Crear Entorno Virtual

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Git Bash/WSL:
source venv/Scripts/activate

# Verificar que está activado (debe aparecer (venv) al inicio del prompt)
which python
# Debe mostrar: .../Hakaton/backend/venv/Scripts/python
```

### 1.3. Instalar Dependencias Python

```bash
# Crear archivo requirements.txt
cat > requirements.txt << 'EOF'
# Framework Web
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0

# Base de Datos
psycopg2-binary==2.9.9
sqlalchemy==2.0.23

# Machine Learning
scikit-learn==1.3.2
numpy==1.26.2
pandas==2.1.3
imbalanced-learn==0.11.0

# Deep Learning (opcional para MLP avanzado)
tensorflow==2.15.0

# Validación y Utilidades
joblib==1.3.2
python-dotenv==1.0.0

# Visualización (para análisis)
matplotlib==3.8.2
seaborn==0.13.0

# Testing
pytest==7.4.3
httpx==0.25.2
EOF

# Instalar todas las dependencias
pip install -r requirements.txt

# Verificar instalación
pip list
```

### 1.4. Instalar PostgreSQL

**Windows:**

1. **Descargar PostgreSQL 14+:**
   - Ir a: https://www.postgresql.org/download/windows/
   - Descargar el instalador (versión 14 o superior)

2. **Durante la instalación:**
   ```
   Puerto: 5432 (dejar por defecto)
   Superusuario: postgres
   Contraseña: [ELIGE UNA CONTRASEÑA SEGURA Y ANÓTALA]
   ```

3. **Verificar instalación:**
   ```bash
   # Abrir cmd o Git Bash
   psql --version
   # Debe mostrar: psql (PostgreSQL) 14.x
   ```

4. **Crear base de datos:**
   ```bash
   # Conectarse a PostgreSQL
   psql -U postgres

   # Dentro de psql:
   CREATE DATABASE sidi_db;
   CREATE USER sidi_user WITH PASSWORD 'tu_password_seguro';
   GRANT ALL PRIVILEGES ON DATABASE sidi_db TO sidi_user;
   \q
   ```

### 1.5. Instalar Herramientas Adicionales

**pgAdmin 4 (Interfaz gráfica para PostgreSQL):**
- Ya viene incluido con PostgreSQL
- Abrir pgAdmin 4 desde el menú inicio
- Conectarse al servidor local
- Verificar que la base de datos `sidi_db` existe

**Git (si no lo tienen):**
```bash
# Verificar
git --version

# Si no está instalado, descargar de:
# https://git-scm.com/download/win
```

---

## Día 2: Estructura del Proyecto Backend

### 2.1. Crear Estructura de Carpetas

```bash
cd /c/Users/ASUS/Proyectos/Hakaton/backend

# Crear estructura completa
mkdir -p app/{models,schemas,routes,services,utils}
mkdir -p data/{raw,processed,models}
mkdir -p notebooks
mkdir -p tests
mkdir -p docs

# Crear archivos __init__.py para que sean paquetes Python
touch app/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/routes/__init__.py
touch app/services/__init__.py
touch app/utils/__init__.py

# Verificar estructura
tree -L 3
```

**Estructura final debe verse así:**
```
backend/
├── venv/                      # Entorno virtual
├── app/
│   ├── __init__.py
│   ├── main.py               # Aplicación FastAPI principal
│   ├── config.py             # Configuración
│   ├── database.py           # Conexión a BD
│   ├── models/               # Modelos SQLAlchemy
│   │   ├── __init__.py
│   │   └── paciente.py
│   ├── schemas/              # Schemas Pydantic
│   │   ├── __init__.py
│   │   └── prediccion.py
│   ├── routes/               # Endpoints API
│   │   ├── __init__.py
│   │   └── prediccion.py
│   ├── services/             # Lógica de negocio
│   │   ├── __init__.py
│   │   ├── ml_service.py
│   │   └── preprocessing.py
│   └── utils/                # Utilidades
│       ├── __init__.py
│       └── z_scores.py
├── data/
│   ├── raw/                  # Datos originales
│   ├── processed/            # Datos procesados
│   └── models/               # Modelos ML guardados
├── notebooks/                # Jupyter notebooks para análisis
├── tests/                    # Tests
├── requirements.txt
└── .env                      # Variables de entorno
```

### 2.2. Crear Archivo de Configuración

```bash
cd /c/Users/ASUS/Proyectos/Hakaton/backend

# Crear archivo .env
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://sidi_user:tu_password_seguro@localhost:5432/sidi_db

# API
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=True

# Security
SECRET_KEY=tu_clave_secreta_muy_larga_y_aleatoria_aqui
ALGORITHM=HS256

# CORS
FRONTEND_URL=https://hakaton-peach-sigma.vercel.app
FRONTEND_LOCAL=http://localhost:3000

# ML Models
MODEL_VERSION=1.0
MODEL_PATH=data/models/
EOF

# IMPORTANTE: Reemplazar 'tu_password_seguro' con tu contraseña real
# IMPORTANTE: Generar SECRET_KEY aleatoria
```

**Generar SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Copiar el resultado y pegarlo en .env
```

### 2.3. Crear app/config.py

```bash
cat > app/config.py << 'EOF'
"""
Configuración de la aplicación SIDI
"""
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    
    # CORS
    FRONTEND_URL: str
    FRONTEND_LOCAL: str
    
    # ML
    MODEL_VERSION: str = "1.0"
    MODEL_PATH: str = "data/models/"
    
    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [self.FRONTEND_URL, self.FRONTEND_LOCAL]
    
    class Config:
        env_file = ".env"

settings = Settings()
EOF
```

---

## Día 3: Configuración de Base de Datos

### 3.1. Crear app/database.py

```bash
cat > app/database.py << 'EOF'
"""
Configuración de la base de datos PostgreSQL
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Crear engine de SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=True  # Cambia a False en producción
)

# Crear SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos
Base = declarative_base()

# Dependency para obtener sesión de BD
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
EOF
```

### 3.2. Crear Modelos de Base de Datos

```bash
cat > app/models/paciente.py << 'EOF'
"""
Modelos de base de datos para SIDI
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ARRAY, JSON
from sqlalchemy.sql import func
from app.database import Base

class Nino(Base):
    __tablename__ = "ninos"
    
    id_nino = Column(Integer, primary_key=True, index=True)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    fecha_nacimiento = Column(DateTime, nullable=False)
    sexo = Column(String(1), nullable=False)  # 'M' o 'F'
    municipio = Column(String(50))
    zona = Column(String(10))  # 'Urbana' o 'Rural'
    fecha_registro = Column(DateTime, server_default=func.now())
    estado = Column(String(20), default='Activo')

class MedicionAntropometrica(Base):
    __tablename__ = "mediciones_antropometricas"
    
    id_medicion = Column(Integer, primary_key=True, index=True)
    id_nino = Column(Integer, nullable=False, index=True)
    fecha_medicion = Column(DateTime, nullable=False)
    edad_meses = Column(Integer, nullable=False)
    peso = Column(Float, nullable=False)
    talla = Column(Float, nullable=False)
    perimetro_braquial = Column(Float)
    imc = Column(Float)
    z_score_peso_edad = Column(Float)
    z_score_talla_edad = Column(Float)
    z_score_peso_talla = Column(Float)
    clasificacion_nutricional = Column(String(30))

class HistoriaClinica(Base):
    __tablename__ = "historia_clinica"
    
    id_historia = Column(Integer, primary_key=True, index=True)
    id_nino = Column(Integer, nullable=False, index=True)
    fecha_registro = Column(DateTime, nullable=False)
    episodios_diarrea = Column(Integer, default=0)
    infecciones_respiratorias = Column(Integer, default=0)
    vacunacion_completa = Column(Boolean, default=False)
    lactancia_materna = Column(String(30))
    enfermedades_cronicas = Column(Text)
    suplementacion_nutricional = Column(Boolean, default=False)

class DatosSociodemograficos(Base):
    __tablename__ = "datos_sociodemograficos"
    
    id_sociodem = Column(Integer, primary_key=True, index=True)
    id_nino = Column(Integer, nullable=False, index=True)
    nivel_educativo_madre = Column(String(30))
    nivel_educativo_padre = Column(String(30))
    ingreso_familiar_mensual = Column(Float)
    numero_hijos = Column(Integer)
    tipo_vivienda = Column(String(30))
    acceso_agua_potable = Column(Boolean)
    acceso_alcantarillado = Column(Boolean)
    tipo_afiliacion_salud = Column(String(30))
    distancia_centro_salud = Column(Float)

class Prediccion(Base):
    __tablename__ = "predicciones"
    
    id_prediccion = Column(Integer, primary_key=True, index=True)
    id_nino = Column(Integer, index=True)
    fecha_prediccion = Column(DateTime, server_default=func.now())
    modelo_utilizado = Column(String(50))  # 'SVM', 'RandomForest', 'MLP'
    version_modelo = Column(String(20))
    nivel_riesgo = Column(String(20), index=True)  # 'Alto', 'Medio', 'Bajo'
    probabilidad_riesgo = Column(Float)
    factores_riesgo = Column(JSON)
    recomendaciones = Column(Text)
    estado_validacion = Column(String(30), default='Pendiente')
EOF
```

### 3.3. Crear Script de Inicialización de BD

```bash
cat > app/init_db.py << 'EOF'
"""
Script para inicializar la base de datos
"""
from app.database import engine, Base
from app.models.paciente import Nino, MedicionAntropometrica, HistoriaClinica, DatosSociodemograficos, Prediccion

def init_database():
    """Crear todas las tablas en la base de datos"""
    print("🔄 Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas exitosamente!")

if __name__ == "__main__":
    init_database()
EOF

# Ejecutar script
python app/init_db.py
```

**Verificar en pgAdmin:**
1. Abrir pgAdmin 4
2. Conectarse a localhost
3. Expandir: Servers > PostgreSQL 14 > Databases > sidi_db > Schemas > public > Tables
4. Deberías ver las 5 tablas creadas

---

## Día 4: Esquemas Pydantic y Validación

### 4.1. Crear app/schemas/prediccion.py

```bash
cat > app/schemas/prediccion.py << 'EOF'
"""
Esquemas Pydantic para validación de datos
"""
from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime

class PacienteInput(BaseModel):
    """Datos de entrada para predicción"""
    edad_meses: int = Field(..., ge=0, le=216, description="Edad en meses (0-18 años)")
    peso_kg: float = Field(..., gt=0, le=150, description="Peso en kilogramos")
    talla_cm: float = Field(..., gt=0, le=250, description="Talla en centímetros")
    sexo: str = Field(..., pattern="^[MF]$", description="M o F")
    zona: str = Field(..., description="Urbana o Rural")
    educacion_madre: str = Field(..., description="Nivel educativo de la madre")
    ingreso_familiar: float = Field(..., ge=0, description="Ingreso mensual en pesos")
    acceso_agua: bool = Field(..., description="Acceso a agua potable")
    episodios_diarrea: int = Field(0, ge=0, le=50, description="Episodios en últimos 6 meses")
    vacunacion_completa: bool = Field(True, description="Esquema de vacunación completo")
    
    @validator('zona')
    def validar_zona(cls, v):
        if v not in ['Urbana', 'Rural']:
            raise ValueError('Zona debe ser Urbana o Rural')
        return v
    
    @validator('educacion_madre')
    def validar_educacion(cls, v):
        opciones = ['Ninguno', 'Primaria', 'Secundaria', 'Técnico', 'Universitario']
        if v not in opciones:
            raise ValueError(f'Educación debe ser una de: {", ".join(opciones)}')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "edad_meses": 24,
                "peso_kg": 10.5,
                "talla_cm": 82.0,
                "sexo": "M",
                "zona": "Urbana",
                "educacion_madre": "Secundaria",
                "ingreso_familiar": 1000000.0,
                "acceso_agua": True,
                "episodios_diarrea": 2,
                "vacunacion_completa": True
            }
        }

class PrediccionOutput(BaseModel):
    """Resultado de la predicción"""
    nivel_riesgo: str
    probabilidad_alto: float
    probabilidad_medio: float
    probabilidad_bajo: float
    imc: float
    z_peso_edad: float
    z_talla_edad: float
    clasificacion_nutricional: str
    recomendaciones: List[str]
    fecha_prediccion: datetime
    modelo_utilizado: str
    version_modelo: str
    
    class Config:
        from_attributes = True

class HealthCheck(BaseModel):
    """Estado del sistema"""
    status: str
    model_loaded: bool
    database_connected: bool
    version: str
EOF
```

---

# 🎯 FASE 2: GENERACIÓN DE DATOS (4-5 días)

## Día 5: Crear Generador de Datos Sintéticos

### 5.1. Instalar Faker

```bash
pip install Faker
pip freeze > requirements.txt
```

### 5.2. Crear Script Generador

```bash
cat > data/generar_datos_sinteticos.py << 'EOF'
"""
Generador de datos sintéticos realistas para SIDI
Basado en estadísticas reales de Norte de Santander
"""
import pandas as pd
import numpy as np
from faker import Faker
from datetime import datetime, timedelta
import random

fake = Faker('es_CO')
np.random.seed(42)
random.seed(42)

# Configuración
N_REGISTROS = 1200  # Generar 1200 registros

def calcular_imc(peso_kg, talla_cm):
    """Calcular IMC"""
    return peso_kg / ((talla_cm / 100) ** 2)

def calcular_z_score_simplificado(valor, tipo, edad_meses, sexo):
    """
    Cálculo simplificado de Z-scores
    En producción, usar tablas OMS reales
    """
    if tipo == 'peso':
        # Media aproximada: 3.5kg al nacer + 0.5kg/mes primeros 6 meses, luego más lento
        if edad_meses <= 6:
            media = 3.5 + (edad_meses * 0.5)
            std = 1.0
        elif edad_meses <= 24:
            media = 7.0 + ((edad_meses - 6) * 0.3)
            std = 1.5
        else:
            media = 12.4 + ((edad_meses - 24) * 0.2)
            std = 2.0
    else:  # talla
        if edad_meses <= 6:
            media = 50 + (edad_meses * 4)
            std = 3.0
        elif edad_meses <= 24:
            media = 74 + ((edad_meses - 6) * 1.5)
            std = 4.0
        else:
            media = 101 + ((edad_meses - 24) * 0.8)
            std = 5.0
    
    # Ajuste por sexo (los niños tienden a ser ligeramente más grandes)
    if sexo == 'M':
        media *= 1.02
    
    z_score = (valor - media) / std
    return round(z_score, 2)

def clasificar_estado_nutricional(z_peso, z_talla, z_peso_talla):
    """Clasificar estado nutricional según Z-scores"""
    if z_peso < -3 or z_talla < -3:
        return 'Desnutrición Severa'
    elif z_peso < -2 or z_talla < -2:
        return 'Desnutrición Moderada'
    elif z_peso < -1:
        return 'Riesgo de Desnutrición'
    elif z_peso > 2:
        return 'Sobrepeso'
    else:
        return 'Normal'

def generar_dataset():
    """Generar dataset completo"""
    print(f"🔄 Generando {N_REGISTROS} registros sintéticos...")
    
    datos = []
    
    for i in range(N_REGISTROS):
        # Edad (0-18 años = 0-216 meses)
        edad_meses = np.random.randint(0, 217)
        
        # Sexo
        sexo = random.choice(['M', 'F'])
        
        # Zona (40% rural, 60% urbana - refleja Norte de Santander)
        zona = np.random.choice(['Urbana', 'Rural'], p=[0.6, 0.4])
        
        # Municipio (algunos municipios de Norte de Santander)
        municipios = ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 
                      'Chinácota', 'Tibú', 'El Zulia', 'Sardinata', 'Convención']
        municipio = random.choice(municipios)
        
        # Educación madre (distribución realista)
        educacion_madre = np.random.choice(
            ['Ninguno', 'Primaria', 'Secundaria', 'Técnico', 'Universitario'],
            p=[0.08, 0.35, 0.38, 0.12, 0.07]
        )
        
        # Educación padre
        educacion_padre = np.random.choice(
            ['Ninguno', 'Primaria', 'Secundaria', 'Técnico', 'Universitario'],
            p=[0.10, 0.38, 0.35, 0.11, 0.06]
        )
        
        # Ingreso familiar (salarios mínimos colombianos - aprox 1,300,000 en 2025)
        salario_minimo = 1300000
        if educacion_madre in ['Técnico', 'Universitario']:
            ingreso = np.random.uniform(2, 5) * salario_minimo
        elif educacion_madre == 'Secundaria':
            ingreso = np.random.uniform(1, 2.5) * salario_minimo
        else:
            ingreso = np.random.uniform(0.5, 1.5) * salario_minimo
        
        # Número de hijos (más hijos en familias con menor educación)
        if educacion_madre in ['Ninguno', 'Primaria']:
            numero_hijos = np.random.randint(2, 6)
        else:
            numero_hijos = np.random.randint(1, 4)
        
        # Tipo vivienda
        tipo_vivienda = np.random.choice(
            ['Propia', 'Arrendada', 'Familiar', 'Invasión'],
            p=[0.45, 0.35, 0.15, 0.05]
        )
        
        # Acceso a servicios (mejor en zona urbana)
        if zona == 'Urbana':
            acceso_agua = np.random.choice([True, False], p=[0.85, 0.15])
            acceso_alcantarillado = np.random.choice([True, False], p=[0.80, 0.20])
        else:
            acceso_agua = np.random.choice([True, False], p=[0.50, 0.50])
            acceso_alcantarillado = np.random.choice([True, False], p=[0.30, 0.70])
        
        # Afiliación a salud
        afiliacion_salud = np.random.choice(
            ['Contributivo', 'Subsidiado', 'No afiliado'],
            p=[0.25, 0.65, 0.10]
        )
        
        # Distancia a centro de salud (mayor en rural)
        if zona == 'Urbana':
            distancia_salud = np.random.uniform(0.5, 5)
        else:
            distancia_salud = np.random.uniform(5, 30)
        
        # Datos clínicos (correlacionados con condiciones socioeconómicas)
        # Más episodios de diarrea si no hay agua potable
        if not acceso_agua:
            episodios_diarrea = np.random.poisson(4)
        else:
            episodios_diarrea = np.random.poisson(1)
        
        # Infecciones respiratorias
        infecciones_resp = np.random.poisson(2)
        
        # Vacunación (mejor en zona urbana y con afiliación)
        if zona == 'Urbana' and afiliacion_salud != 'No afiliado':
            vacunacion_completa = np.random.choice([True, False], p=[0.85, 0.15])
        else:
            vacunacion_completa = np.random.choice([True, False], p=[0.60, 0.40])
        
        # Lactancia materna
        lactancia = np.random.choice(
            ['Exclusiva <6m', 'Mixta', 'No lactó'],
            p=[0.40, 0.45, 0.15]
        )
        
        # Suplementación
        suplementacion = np.random.choice([True, False], p=[0.30, 0.70])
        
        # PESO Y TALLA (correlacionados con factores de riesgo)
        # Base según edad
        if edad_meses <= 6:
            peso_base = 3.5 + (edad_meses * 0.7)
            talla_base = 50 + (edad_meses * 4)
        elif edad_meses <= 24:
            peso_base = 8.0 + ((edad_meses - 6) * 0.4)
            talla_base = 74 + ((edad_meses - 6) * 1.5)
        elif edad_meses <= 60:
            peso_base = 12.0 + ((edad_meses - 24) * 0.25)
            talla_base = 101 + ((edad_meses - 24) * 0.9)
        else:
            peso_base = 21.0 + ((edad_meses - 60) * 0.3)
            talla_base = 133 + ((edad_meses - 60) * 0.6)
        
        # Factores de riesgo que reducen peso/talla
        factor_riesgo = 1.0
        
        if educacion_madre == 'Ninguno':
            factor_riesgo -= 0.15
        elif educacion_madre == 'Primaria':
            factor_riesgo -= 0.08
        
        if zona == 'Rural':
            factor_riesgo -= 0.05
        
        if not acceso_agua:
            factor_riesgo -= 0.08
        
        if episodios_diarrea > 4:
            factor_riesgo -= 0.10
        
        if ingreso < salario_minimo:
            factor_riesgo -= 0.07
        
        if not vacunacion_completa:
            factor_riesgo -= 0.05
        
        # Aplicar factor de riesgo con algo de aleatoriedad
        factor_riesgo += np.random.normal(0, 0.05)
        factor_riesgo = max(0.6, min(1.2, factor_riesgo))  # Limitar entre 60% y 120%
        
        peso_kg = peso_base * factor_riesgo
        talla_cm = talla_base * factor_riesgo
        
        # Agregar variación natural
        peso_kg += np.random.normal(0, peso_kg * 0.05)
        talla_cm += np.random.normal(0, talla_cm * 0.02)
        
        # Asegurar valores positivos
        peso_kg = max(2.0, peso_kg)
        talla_cm = max(40.0, talla_cm)
        
        # Calcular métricas
        imc = calcular_imc(peso_kg, talla_cm)
        z_peso = calcular_z_score_simplificado(peso_kg, 'peso', edad_meses, sexo)
        z_talla = calcular_z_score_simplificado(talla_cm, 'talla', edad_meses, sexo)
        z_peso_talla = (z_peso + z_talla) / 2  # Simplificación
        
        clasificacion = clasificar_estado_nutricional(z_peso, z_talla, z_peso_talla)
        
        # Determinar riesgo (target para ML)
        if z_peso < -2 or z_talla < -2 or episodios_diarrea > 5:
            riesgo = 'Alto'
        elif z_peso < -1 or z_talla < -1 or episodios_diarrea > 3:
            riesgo = 'Medio'
        else:
            riesgo = 'Bajo'
        
        # Agregar registro
        datos.append({
            'id_registro': i + 1,
            'edad_meses': edad_meses,
            'peso_kg': round(peso_kg, 2),
            'talla_cm': round(talla_cm, 2),
            'sexo': sexo,
            'zona': zona,
            'municipio': municipio,
            'educacion_madre': educacion_madre,
            'educacion_padre': educacion_padre,
            'ingreso_familiar': round(ingreso, 2),
            'numero_hijos': numero_hijos,
            'tipo_vivienda': tipo_vivienda,
            'acceso_agua': acceso_agua,
            'acceso_alcantarillado': acceso_alcantarillado,
            'afiliacion_salud': afiliacion_salud,
            'distancia_salud_km': round(distancia_salud, 2),
            'episodios_diarrea': min(episodios_diarrea, 20),  # Limitar
            'infecciones_respiratorias': min(infecciones_resp, 15),
            'vacunacion_completa': vacunacion_completa,
            'lactancia_materna': lactancia,
            'suplementacion_nutricional': suplementacion,
            'imc': round(imc, 2),
            'z_score_peso_edad': z_peso,
            'z_score_talla_edad': z_talla,
            'z_score_peso_talla': round(z_peso_talla, 2),
            'clasificacion_nutricional': clasificacion,
            'riesgo_desnutricion': riesgo
        })
        
        if (i + 1) % 200 == 0:
            print(f"  ✅ Generados {i + 1}/{N_REGISTROS} registros...")
    
    df = pd.DataFrame(datos)
    return df

if __name__ == "__main__":
    print("🚀 Iniciando generación de datos sintéticos SIDI\n")
    
    # Generar dataset
    df = generar_dataset()
    
    # Guardar
    output_path = 'raw/dataset_sidi_sintetico.csv'
    df.to_csv(output_path, index=False, encoding='utf-8')
    
    print(f"\n✅ Dataset generado exitosamente!")
    print(f"📁 Guardado en: {output_path}")
    print(f"📊 Total de registros: {len(df)}")
    print(f"\n📈 Distribución de riesgo:")
    print(df['riesgo_desnutricion'].value_counts())
    print(f"\n📈 Estadísticas descriptivas:")
    print(df[['edad_meses', 'peso_kg', 'talla_cm', 'imc', 'z_score_peso_edad']].describe())
EOF

# Ejecutar generador
cd /c/Users/ASUS/Proyectos/Hakaton/backend
python data/generar_datos_sinteticos.py
```

---

## Día 6-7: Análisis Exploratorio de Datos (EDA)

### 6.1. Crear Jupyter Notebook para EDA

```bash
# Instalar Jupyter
pip install jupyter ipykernel
pip freeze > requirements.txt

# Crear notebook
jupyter notebook
```

### 6.2. En Jupyter, crear notebook: `notebooks/01_analisis_exploratorio.ipynb`

**Contenido del notebook:**

```python
# Celda 1: Importaciones
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Configuración de visualización
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['font.size'] = 10

# Celda 2: Cargar datos
df = pd.read_csv('../data/raw/dataset_sidi_sintetico.csv')
print(f"📊 Datos cargados: {df.shape[0]} registros, {df.shape[1]} variables")
df.head()

# Celda 3: Información general
df.info()

# Celda 4: Estadísticas descriptivas
df.describe()

# Celda 5: Valores faltantes
print("Valores faltantes por columna:")
print(df.isnull().sum())

# Celda 6: Distribución del target
fig, ax = plt.subplots(1, 2, figsize=(14, 5))

df['riesgo_desnutricion'].value_counts().plot(kind='bar', ax=ax[0], color=['green', 'orange', 'red'])
ax[0].set_title('Distribución de Riesgo de Desnutrición')
ax[0].set_xlabel('Nivel de Riesgo')
ax[0].set_ylabel('Frecuencia')

df['riesgo_desnutricion'].value_counts().plot(kind='pie', ax=ax[1], autopct='%1.1f%%')
ax[1].set_title('Proporción de Riesgo')

plt.tight_layout()
plt.show()

# Celda 7: Distribución de variables numéricas
variables_num = ['edad_meses', 'peso_kg', 'talla_cm', 'imc', 'z_score_peso_edad', 'z_score_talla_edad']

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
axes = axes.flatten()

for i, var in enumerate(variables_num):
    df[var].hist(bins=30, ax=axes[i], edgecolor='black')
    axes[i].set_title(f'Distribución de {var}')
    axes[i].set_xlabel(var)
    axes[i].set_ylabel('Frecuencia')

plt.tight_layout()
plt.show()

# Celda 8: Z-scores por nivel de riesgo
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

df.boxplot(column='z_score_peso_edad', by='riesgo_desnutricion', ax=axes[0])
axes[0].set_title('Z-Score Peso/Edad por Riesgo')
axes[0].set_xlabel('Nivel de Riesgo')

df.boxplot(column='z_score_talla_edad', by='riesgo_desnutricion', ax=axes[1])
axes[1].set_title('Z-Score Talla/Edad por Riesgo')

df.boxplot(column='imc', by='riesgo_desnutricion', ax=axes[2])
axes[2].set_title('IMC por Riesgo')

plt.suptitle('')
plt.tight_layout()
plt.show()

# Celda 9: Correlaciones
correlacion = df[variables_num].corr()

plt.figure(figsize=(10, 8))
sns.heatmap(correlacion, annot=True, cmap='coolwarm', center=0)
plt.title('Matriz de Correlación - Variables Numéricas')
plt.show()

# Celda 10: Factores socioeconómicos
fig, axes = plt.subplots(2, 2, figsize=(15, 12))

# Educación madre vs riesgo
pd.crosstab(df['educacion_madre'], df['riesgo_desnutricion']).plot(kind='bar', ax=axes[0, 0], stacked=True)
axes[0, 0].set_title('Educación Madre vs Riesgo')
axes[0, 0].legend(title='Riesgo')

# Zona vs riesgo
pd.crosstab(df['zona'], df['riesgo_desnutricion']).plot(kind='bar', ax=axes[0, 1], stacked=True)
axes[0, 1].set_title('Zona vs Riesgo')

# Acceso agua vs riesgo
pd.crosstab(df['acceso_agua'], df['riesgo_desnutricion']).plot(kind='bar', ax=axes[1, 0], stacked=True)
axes[1, 0].set_title('Acceso Agua vs Riesgo')

# Vacunación vs riesgo
pd.crosstab(df['vacunacion_completa'], df['riesgo_desnutricion']).plot(kind='bar', ax=axes[1, 1], stacked=True)
axes[1, 1].set_title('Vacunación vs Riesgo')

plt.tight_layout()
plt.show()

# Celda 11: Guardar resumen
print("\n📝 Resumen del Análisis Exploratorio:")
print(f"✅ Total de registros: {len(df)}")
print(f"✅ Variables: {df.shape[1]}")
print(f"✅ Valores faltantes: {df.isnull().sum().sum()}")
print(f"\n📊 Distribución de Riesgo:")
print(df['riesgo_desnutricion'].value_counts())
print(f"\n🎯 Dataset listo para entrenamiento de modelos")
```

---

**CONTINUARÁ EN LA SIGUIENTE PARTE...**

Este es solo el inicio de la hoja de ruta. ¿Quieres que continúe con las fases restantes (3-8)?

La hoja de ruta completa incluirá:
- ✅ FASE 1: Preparación (completada arriba)
- ✅ FASE 2: Datos (completada arriba)
- ⏳ FASE 3: Preprocesamiento
- ⏳ FASE 4: Entrenamiento de Modelos (SVM, RF, MLP)
- ⏳ FASE 5: API Backend
- ⏳ FASE 6: Integración Frontend
- ⏳ FASE 7: Validación
- ⏳ FASE 8: Documentación

¿Continúo con las fases restantes?
