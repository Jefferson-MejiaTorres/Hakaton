# 🏥 SIDI Backend - API y Machine Learning

Backend del Sistema Inteligente de Detección de Desnutrición Infantil

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Python 3.10+** instalado
- **PostgreSQL 14+** instalado y ejecutándose
- **Git Bash** o terminal compatible

### Paso 1: Crear Entorno Virtual

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Git Bash/WSL)
source venv/Scripts/activate

# Verificar activación (debe aparecer (venv) en el prompt)
which python
```

### Paso 2: Instalar Dependencias

```bash
# Instalar todas las dependencias
pip install -r requirements.txt

# Verificar instalación
pip list | grep -E "(fastapi|sqlalchemy|scikit)"
```

### Paso 3: Configurar PostgreSQL

#### Opción A: Desde línea de comandos

```bash
# Conectar a PostgreSQL como superusuario
psql -U postgres

# Crear base de datos
CREATE DATABASE sidi_db;

# Crear usuario (opcional)
CREATE USER sidi_user WITH PASSWORD 'tu_password';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE sidi_db TO sidi_user;

# Salir
\q
```

#### Opción B: Desde pgAdmin 4

1. Abrir pgAdmin 4
2. Click derecho en "Databases" → "Create" → "Database"
3. Nombre: `sidi_db`
4. Owner: `postgres` (o tu usuario)
5. Click "Save"

### Paso 4: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env  # o usar tu editor favorito
```

**Configuración mínima en `.env`:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sidi_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_AQUI
```

### Paso 5: Inicializar Base de Datos

```bash
# Ejecutar script de inicialización
python app/init_db.py
```

**Salida esperada:**

```
============================================================
🚀 SIDI - Inicialización de Base de Datos
============================================================

📊 Base de datos: sidi_db
🖥️  Host: localhost:5432
👤 Usuario: postgres

🔍 Verificando conexión a PostgreSQL...
✅ Conexión exitosa

🏗️  Creando tablas...
✅ Base de datos inicializada correctamente

============================================================
✨ ¡Base de datos inicializada correctamente!
============================================================

Tablas creadas:
  - ninos
  - mediciones_antropometricas
  - historia_clinica
  - datos_sociodemograficos
  - predicciones

✅ Listo para usar SIDI
```

---

## 📁 Estructura del Backend

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Aplicación FastAPI principal
│   ├── config.py               # Configuración y variables de entorno
│   ├── database.py             # Conexión a PostgreSQL
│   ├── init_db.py              # Script de inicialización
│   │
│   ├── models/                 # Modelos SQLAlchemy (ORM)
│   │   ├── __init__.py
│   │   └── paciente.py         # 5 tablas: Nino, Medición, Historia, Sociodem, Predicción
│   │
│   ├── schemas/                # Schemas Pydantic (validación)
│   │   ├── __init__.py
│   │   └── prediccion.py       # (próximamente)
│   │
│   ├── routes/                 # Endpoints de la API
│   │   ├── __init__.py
│   │   └── prediction.py       # (próximamente)
│   │
│   ├── services/               # Lógica de negocio
│   │   ├── __init__.py
│   │   └── ml_service.py       # (próximamente)
│   │
│   └── utils/                  # Utilidades
│       ├── __init__.py
│       └── preprocessing.py    # (próximamente)
│
├── data/
│   ├── raw/                    # Datos sin procesar
│   ├── processed/              # Datos procesados
│   └── models/                 # Modelos ML guardados
│
├── notebooks/                  # Jupyter notebooks
│   └── 01_analisis_exploratorio.ipynb  # (próximamente)
│
├── tests/                      # Tests unitarios
│
├── .env.example               # Plantilla de variables de entorno
├── .env                       # Variables de entorno (NO subir a Git)
└── requirements.txt           # Dependencias Python
```

---

## 🗄️ Esquema de Base de Datos

### Tabla: `ninos`
- **id** (PK)
- nombre, apellido
- fecha_nacimiento
- sexo
- documento_identidad (unique)
- fecha_registro

### Tabla: `mediciones_antropometricas`
- **id** (PK)
- **nino_id** (FK → ninos)
- fecha_medicion
- peso, talla, perimetro_braquial
- peso_al_nacer
- imc, z_scores (peso/edad, talla/edad, peso/talla)

### Tabla: `historia_clinica`
- **id** (PK)
- **nino_id** (FK → ninos, unique)
- episodios_diarrea, infecciones_respiratorias
- vacunacion_completa
- enfermedades_cronicas
- lactancia_materna, suplementacion_nutricional

### Tabla: `datos_sociodemograficos`
- **id** (PK)
- **nino_id** (FK → ninos, unique)
- nivel_educativo_madre/padre
- ingreso_familiar_mensual, numero_hijos
- tipo_vivienda, material_vivienda
- acceso_agua_potable, acceso_alcantarillado
- zona_residencia, municipio

### Tabla: `predicciones`
- **id** (PK)
- **nino_id** (FK → ninos)
- fecha_prediccion
- nivel_riesgo, probabilidad
- modelo_usado
- features_json

---

## ✅ Verificación de Instalación

### 1. Verificar Python y entorno virtual

```bash
python --version  # Debe ser 3.10+
which python      # Debe apuntar a venv/Scripts/python
pip list | wc -l  # Debe mostrar ~70+ paquetes
```

### 2. Verificar PostgreSQL

```bash
psql --version    # Debe ser 14+
psql -U postgres -d sidi_db -c "\dt"  # Debe listar 5 tablas
```

### 3. Verificar configuración

```bash
python -c "from app.config import settings; print(f'DB: {settings.DB_NAME}')"
# Debe mostrar: DB: sidi_db
```

---

## 🐛 Solución de Problemas

### Error: "No module named 'app'"

```bash
# Asegúrate de estar en la carpeta backend/
cd backend
python app/init_db.py
```

### Error: "could not connect to server"

```bash
# Verificar que PostgreSQL esté ejecutándose (Windows)
# Buscar "Services" → "postgresql-x64-14" → Start

# O verificar desde terminal
psql -U postgres -c "SELECT version();"
```

### Error: "password authentication failed"

```bash
# Editar .env con la contraseña correcta de PostgreSQL
nano .env
# Cambiar: DB_PASSWORD=tu_password_real
```

### Error: "database 'sidi_db' does not exist"

```bash
# Crear la base de datos manualmente
psql -U postgres -c "CREATE DATABASE sidi_db;"
```

---

## 📊 Próximos Pasos (Fase 2)

1. ✅ **Generar datos sintéticos** (1200 registros)
2. ✅ **Análisis exploratorio** en Jupyter Notebook
3. ⏳ **Preprocesamiento** de datos
4. ⏳ **Entrenamiento** de modelos ML
5. ⏳ **API REST** con FastAPI
6. ⏳ **Integración** con frontend

---

## 📞 Soporte

Para dudas o problemas, consultar:
- **Documentación completa:** `../docs/HOJA_DE_RUTA_COMPLETA.md`
- **Análisis del proyecto:** `../docs/ANALISIS_PROYECTO_ACADEMICO.md`

---

**Última actualización:** 30 de noviembre de 2025
