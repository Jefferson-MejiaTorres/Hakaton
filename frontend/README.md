# 🏥 SIDI - Frontend

**Sistema Inteligente de Detección de Desnutrición Infantil**  
Universidad de Pamplona - Norte de Santander, Colombia

---

## 📁 Estructura de Archivos

```
frontend/
├── index.html              # Landing page con selector de rol
├── login.html              # Página de inicio de sesión
├── register.html           # Página de registro
├── dashboard.html          # Dashboard principal (protegido)
├── about.html              # Información del proyecto
│
├── css/
│   └── styles.css          # Estilos personalizados
│
└── js/
    ├── auth.js             # Módulo de autenticación
    ├── dashboard.js        # Lógica del dashboard
    └── supabase-integration.js  # Integración con Supabase
```

---

## 🚀 Sistema de Roles

El sistema implementa **3 roles diferentes** con funcionalidades específicas:

### 👨‍⚕️ Personal Médico (`role=medico`)
**Funcionalidades:**
- ✅ Gestionar pacientes (CRUD completo)
- ✅ Registrar nuevos pacientes
- ✅ Realizar predicciones ML
- ✅ Editar información de pacientes

**Menú visible:**
- Dashboard
- Gestionar Pacientes
- Registrar Paciente

---

### 🔬 Investigación (`role=investigador`)
**Funcionalidades:**
- ✅ Análisis avanzado de datos
- ✅ Gráficas y estadísticas detalladas
- ✅ Exportar datos (CSV/JSON/Excel)
- ❌ NO puede registrar ni editar pacientes

**Menú visible:**
- Dashboard
- Análisis Avanzado
- Exportar Datos

---

### 🏫 Institución Educativa (`role=institucion`)
**Funcionalidades:**
- ✅ Generar reportes PDF
- ✅ Monitorear alertas de alto riesgo
- ✅ Vista de solo lectura
- ❌ NO puede registrar ni editar pacientes

**Menú visible:**
- Dashboard
- Reportes
- Alertas de Riesgo

---

## 🔗 Flujo de Navegación

```
1. index.html (selecciona rol)
   ↓
2. login.html?role={medico|investigador|institucion}
   ↓
3. dashboard.html (menú filtrado por rol)
```

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| HTML5 | - | Estructura |
| Tailwind CSS | CDN | Estilos |
| JavaScript | Vanilla | Lógica |
| Chart.js | 4.4.0 | Gráficas |
| Supabase | 2.x | Backend & Auth |
| Font Awesome | 6.4.0 | Iconos |

---

## 🌐 Despliegue

### Producción
- **URL:** https://hakaton-peach-sigma.vercel.app/
- **Plataforma:** Vercel
- **Backend:** Supabase (PostgreSQL + Auth)

### Credenciales (Configuradas)
- **Supabase URL:** https://hfeixwjdgvmrackugnsr.supabase.co
- **Anon Key:** Configurada en auth.js, dashboard.js, supabase-integration.js

---

## 📚 Documentación

- **Sistema de Roles:** [`docs/ROLES_SISTEMA.md`](../docs/ROLES_SISTEMA.md)
- **Proyecto Completo:** [`docs/PROYECTO_COMPLETO.md`](../docs/PROYECTO_COMPLETO.md)
- **Hoja de Ruta:** [`docs/HOJA_DE_RUTA_COMPLETA.md`](../docs/HOJA_DE_RUTA_COMPLETA.md)

---

## 🔧 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jefferson-MejiaTorres/Hakaton.git
cd Hakaton/frontend

# 2. Abrir con Live Server (VS Code) o servidor local
# Archivo de entrada: index.html

# 3. Asegúrate de tener configuradas las credenciales de Supabase
```

---

## 📋 Estado del Proyecto

### ✅ Completado
- [x] Sistema de autenticación con Supabase
- [x] Sistema de roles dinámico
- [x] Dashboard con gráficas (Chart.js)
- [x] Landing page y páginas de auth
- [x] Errores de accesibilidad corregidos
- [x] Estructura de archivos limpia

### 🔄 En Desarrollo
- [ ] Conexión con datos reales de Supabase
- [ ] Implementar CRUD de pacientes
- [ ] Implementar exportación de datos
- [ ] Implementar generación de reportes PDF
- [ ] Predicciones ML desde el frontend

---

## 👥 Equipo

- **Daniel Felipe Contreras Caballero** - Desarrollador
- **Jefferson David Mejía Torres** - Desarrollador
- **José Gerardo Chacón Rangel** - Asesor Académico

---

## 📄 Licencia

Proyecto académico - Universidad de Pamplona © 2025
