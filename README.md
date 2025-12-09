# 🏥 SIDI - Sistema Inteligente de Detección de Desnutrición Infantil

**Universidad de Pamplona - Norte de Santander, Colombia**  
**Autores:** Daniel Felipe Contreras Caballero, Jefferson David Mejia Torres  
**Año:** 2025

---

## 🌐 Demo en Vivo

**🚀 Aplicación:** [https://hakaton-peach-sigma.vercel.app/](https://hakaton-peach-sigma.vercel.app/)

Sistema web para detección temprana de desnutrición infantil mediante Machine Learning.

---

## 🎯 Características

✅ **Personal Médico**: Gestión completa de pacientes y diagnósticos automáticos  
✅ **Investigación**: Análisis avanzado y exportación de datos  
✅ **Institución**: Reportes PDF y monitoreo de alertas  
✅ **Predicción ML**: Función SQL integrada en Supabase  
✅ **Dashboard Interactivo**: Gráficas con Chart.js

---

## 📁 Estructura

```
Hakaton/
├── frontend/                    # Aplicación web (Vercel)
│   ├── index.html              # Landing page
│   ├── dashboard.html          # Dashboard principal
│   ├── css/styles.css
│   └── js/
│       ├── dashboard.js        # Lógica principal
│       └── supabase-integration.js
│
├── backend/                     # Scripts SQL
│   ├── supabase_schema.sql     # Esquema de base de datos
│   ├── funcion_prediccion.sql  # Modelo ML en SQL
│   └── datos_ejemplo.sql       # Datos de prueba (30 pacientes)
│
├── GUIA_COMPLETA.md            # Documentación completa
└── vercel.json                 # Configuración de deploy
```

---

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Jefferson-MejiaTorres/Hakaton.git
cd Hakaton
```

### 2. Abrir `frontend/index.html` en el navegador

### 3. Consultar `GUIA_COMPLETA.md` para:
- Configuración de Supabase
- Scripts SQL a ejecutar
- Despliegue en Vercel
- Roles y permisos

---

## 🛠️ Tecnologías

**Frontend:** HTML5, Tailwind CSS, JavaScript Vanilla  
**Backend:** Supabase (PostgreSQL + Auth)  
**ML:** Función SQL `predecir_simple()`  
**Deploy:** Vercel  
**Gráficas:** Chart.js 4.4.0

---

## 👥 Equipo

Daniel Felipe Contreras Caballero • Jefferson David Mejia Torres

---

## 📄 Licencia

Proyecto académico - Universidad de Pamplona

---

📖 **Documentación Completa:** Ver `GUIA_COMPLETA.md`
