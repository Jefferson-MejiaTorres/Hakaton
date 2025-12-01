# 🏥 SIDI - Sistema Inteligente de Detección de Desnutrición Infantil

**Universidad de Pamplona - Sistemas Inteligentes**  
**Autores:** Daniel Felipe Contreras Caballero, Jefferson David Mejia Torres  
**Asesor:** José Gerardo Chacón Rangel  
**Año:** 2025

---

## 📋 Descripción del Proyecto

SIDI es un sistema inteligente de detección temprana de desnutrición infantil en Norte de Santander, que aplica **minería de datos** y **aprendizaje supervisado** para apoyar políticas públicas y generar acciones preventivas de salud.

### 🎯 Objetivos

1. ✅ **Objetivo 1:** Estudiar datos sociodemográficos mediante minería de datos
2. ✅ **Objetivo 2:** Seleccionar técnicas de aprendizaje supervisado (SVM seleccionado)
3. ⚠️ **Objetivo 3:** Crear modelo predictivo (EN DESARROLLO)
4. ⚠️ **Objetivo 4:** Validar el sistema (PENDIENTE)

### 🚀 Estado Actual

- ✅ **Frontend:** Completo y desplegado en Vercel
- 🔄 **Backend:** En desarrollo (Fase 1 iniciada)
- 📊 **Base de Datos:** PostgreSQL configurado
- 🤖 **ML Models:** SVM, Random Forest, MLP (en entrenamiento)

---

## 📁 Estructura del Proyecto

```
Hakaton/
├── frontend/               # Aplicación web (HTML, CSS, JS)
│   ├── index.html         # Página principal
│   ├── css/               # Estilos
│   │   └── styles.css
│   ├── js/                # Scripts
│   │   └── script.js
│   ├── vercel.json        # Configuración de Vercel
│   └── README.md          # Documentación del frontend
│
├── backend/               # API y modelos ML (Python/FastAPI)
│   ├── app/              # Aplicación FastAPI
│   ├── data/             # Datasets y modelos entrenados
│   ├── notebooks/        # Jupyter notebooks para análisis
│   ├── tests/            # Tests unitarios
│   └── requirements.txt  # Dependencias Python
│
├── docs/                 # Documentación del proyecto
│   ├── ANALISIS_PROYECTO_ACADEMICO.md
│   ├── HOJA_DE_RUTA_COMPLETA.md
│   ├── PROYECTO_COMPLETO.md
│   ├── MEJORAS.md
│   ├── MEJORAS_FRONTEND.md
│   ├── FIX_MOBILE.md
│   └── DEPLOY.md
│
├── .gitignore
├── .vercelignore
└── README.md             # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS
- Font Awesome
- Vercel (deployment)

### Backend
- Python 3.10+
- FastAPI
- PostgreSQL 14+
- SQLAlchemy
- scikit-learn, TensorFlow
- pandas, numpy

---

## 🚀 Inicio Rápido

### Frontend (Producción)
🌐 **URL:** [https://hakaton-peach-sigma.vercel.app/](https://hakaton-peach-sigma.vercel.app/)

### Backend (Desarrollo Local)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jefferson-MejiaTorres/Hakaton.git
cd Hakaton/backend

# 2. Crear entorno virtual
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# 5. Inicializar base de datos
python app/init_db.py

# 6. Ejecutar servidor
uvicorn app.main:app --reload
```

---

## 📊 Progreso del Proyecto

### ✅ Completado
- [x] Frontend completo con diseño responsive
- [x] Sistema de predicción simulado
- [x] Análisis teórico de datos
- [x] Selección de algoritmos ML
- [x] Despliegue en Vercel
- [x] Estructura de carpetas organizada

### 🔄 En Desarrollo
- [ ] Backend FastAPI con endpoints
- [ ] Base de datos PostgreSQL con datos reales
- [ ] Entrenamiento de modelos ML
- [ ] Integración frontend-backend
- [ ] API de predicción en tiempo real

### ⏳ Pendiente
- [ ] Validación cruzada de modelos
- [ ] Métricas finales (Precisión, Recall, AUC-ROC)
- [ ] Documentación técnica completa
- [ ] Despliegue de backend en Railway/Heroku

---

## 📖 Documentación

Consulta la carpeta `docs/` para documentación detallada:

- **[HOJA_DE_RUTA_COMPLETA.md](docs/HOJA_DE_RUTA_COMPLETA.md):** Guía paso a paso de implementación
- **[ANALISIS_PROYECTO_ACADEMICO.md](docs/ANALISIS_PROYECTO_ACADEMICO.md):** Análisis completo del proyecto
- **[PROYECTO_COMPLETO.md](docs/PROYECTO_COMPLETO.md):** Contexto académico y objetivos

---

## 👥 Equipo

- **Daniel Felipe Contreras Caballero** - Desarrollador
- **Jefferson David Mejia Torres** - Desarrollador
- **José Gerardo Chacón Rangel** - Asesor académico

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la Universidad de Pamplona.

---

## 🙏 Agradecimientos

- Universidad de Pamplona - Programa de Sistemas Inteligentes
- Comunidad de Norte de Santander
- Instituciones de salud que inspiraron este proyecto

---

**Última actualización:** 30 de noviembre de 2025
