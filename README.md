# SIDI - Sistema Inteligente de Detección de Desnutrición Infantil

![SIDI Banner](https://img.shields.io/badge/SIDI-Salud%20Infantil-blue?style=for-the-badge)
![Pilar](https://img.shields.io/badge/Pilar-TIC%20Incluyente%20y%20Seguro-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Hackathon-orange?style=for-the-badge)

## � Demo en Vivo

**🚀 Accede al sistema aquí:** [https://hakaton-peach-sigma.vercel.app/](https://hakaton-peach-sigma.vercel.app/)

---

## �🎯 Descripción del Proyecto

**SIDI** es un sistema inteligente de detección temprana de desnutrición infantil en Norte de Santander, que aplica minería de datos y aprendizaje supervisado para apoyar políticas públicas y generar acciones preventivas de salud en la región.

## 🤝 Pilar del Hackathon

### **Herramientas TIC para el Trabajo Incluyente y Seguro**

SIDI es una herramienta TIC diseñada específicamente para:

- ✅ **Trabajo Incluyente**: Acceso universal desde cualquier dispositivo, capacitación integrada, democratización del conocimiento
- ✅ **Trabajo Seguro**: Reducción de errores médicos, decisiones basadas en datos, protección de información sensible

## 🎯 Objetivos

### Objetivo General
Desarrollar un sistema inteligente de detección temprana de desnutrición infantil en Norte de Santander, aplicando minería de datos y aprendizaje supervisado, para apoyar políticas públicas y generar acciones preventivas de salud en la región.

### Objetivos Específicos
1. Estudiar datos sociodemográficos y de salud mediante minería de datos
2. Seleccionar técnicas de aprendizaje supervisado (SVM, redes neuronales, Random Forest)
3. Crear un modelo predictivo de desnutrición infantil
4. Validar el sistema mediante métricas de precisión, recall y AUC

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Framework CSS**: Tailwind CSS (CDN)
- **Iconos**: Font Awesome 6
- **IA/ML (Backend - en desarrollo)**: 
  - Support Vector Machines (SVM)
  - Redes Neuronales
  - Random Forest
  - Python/Scikit-learn/TensorFlow

## 📋 Características

- ✨ Diseño responsive y moderno
- 🎨 Interfaz intuitiva y accesible
- 📊 Simulador de predicción de riesgo nutricional
- 📱 Compatible con dispositivos móviles
- 🌐 Optimizado para despliegue en Vercel
- ♿ Enfoque en accesibilidad e inclusión

## 🛠️ Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/sidi-hackathon.git

# Navegar al directorio
cd sidi-hackathon

# Abrir con un servidor local (ejemplo con Python)
python -m http.server 8000

# O con Node.js
npx serve
```

Luego abre tu navegador en `http://localhost:8000`

## 🚀 Desplegar en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SIDI Hackathon"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/sidi-hackathon.git
   git push -u origin main
   ```

2. **Conecta con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración
   - Haz clic en "Deploy"

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

### Opción 3: Arrastrar y Soltar

1. Comprime la carpeta del proyecto en un ZIP
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Arrastra el archivo ZIP
4. ¡Listo!

## 📁 Estructura del Proyecto

```
sidi-hackathon/
│
├── index.html          # Página principal
├── styles.css          # Estilos personalizados
├── script.js           # Lógica y funcionalidades
├── README.md           # Este archivo
└── vercel.json         # Configuración de Vercel (opcional)
```

## ⚙️ Configuración de Vercel (Opcional)

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 🎨 Características de la Interfaz

### Secciones Principales

1. **Hero Section**: Presentación impactante del proyecto con estadísticas
2. **Problema**: Exposición de la problemática de desnutrición infantil
3. **Solución**: Descripción detallada del sistema SIDI
4. **Pilar TIC**: Énfasis en herramientas TIC incluyentes y seguras
5. **Tecnología**: Explicación de las técnicas de IA utilizadas
6. **Impacto**: Beneficios sociales y para políticas públicas
7. **Demo**: Simulador interactivo de predicción

## 📊 Simulador de Predicción

El simulador incluye:
- Análisis de datos antropométricos (edad, peso, talla)
- Factores socioeconómicos (zona, acceso a salud, nivel económico)
- Algoritmo de riesgo simplificado
- Recomendaciones personalizadas según nivel de riesgo

## 🌟 Impacto Social

- 👶 Detección temprana para prevenir daños irreversibles
- 🏥 Apoyo a profesionales de salud con herramientas basadas en IA
- 📈 Datos para políticas públicas efectivas
- 🌍 Reducción de inequidades entre zonas urbanas y rurales

## 🔒 Seguridad y Privacidad

- Protección de datos sensibles de pacientes
- Cumplimiento con normativas de salud
- Sistema de trazabilidad para auditorías
- Validación médica profesional requerida

## 🤝 Contribuciones

Este proyecto fue desarrollado para el Hackathon con enfoque en:
- ✅ Herramientas TIC para el trabajo incluyente y seguro
- ✅ Diversidad e inclusión digital
- ✅ Seguridad y confianza digital

## 📝 Licencia

Este proyecto fue creado con fines educativos y de demostración para el Hackathon.

## 👥 Equipo

Desarrollado con ❤️ para mejorar la salud infantil en Norte de Santander, Colombia.

## 📧 Contacto

- **Email**: contacto@sidi-salud.com
- **Ubicación**: Norte de Santander, Colombia

---

### 🎉 ¡Gracias por tu interés en SIDI!

**Juntos trabajamos por la salud infantil de Norte de Santander mediante tecnología incluyente y segura.**

---

## 🚀 Quick Start para Vercel

```bash
# Opción más rápida
vercel --prod

# O visita: https://vercel.com/new
# E importa directamente desde GitHub
```

## 📱 Demo en Vivo

Una vez desplegado, tu sitio estará disponible en:
`https://tu-proyecto.vercel.app`

---

**Nota**: Esta es una demostración con fines educativos. El sistema real requiere entrenamiento con datos reales y validación médica profesional.
