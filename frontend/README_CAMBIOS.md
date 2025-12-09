# 🎯 SIDI - Nueva Estructura Frontend

## ✅ Cambios Realizados

### 📄 Páginas Creadas/Actualizadas

1. **`index.html`** - Landing page con selector de rol
   - Personal Médico
   - Investigación
   - Institución Educativa
   
2. **`login.html`** - Sistema de autenticación con Supabase Auth

3. **`dashboard.html`** - Dashboard principal con:
   - Estadísticas en tiempo real
   - Gráficas (Chart.js): distribución de riesgo y tendencias
   - Tabla de casos recientes
   - Navegación lateral
   - Formulario de registro de pacientes integrado

4. **`about.html`** - Página informativa del proyecto (simplificada, sin pilares TIC innecesarios)

### 📜 JavaScript Creado

1. **`js/auth.js`** - Módulo de autenticación
   - Login/Logout
   - Protección de páginas
   - Gestión de sesiones

2. **`js/dashboard.js`** - Lógica del dashboard
   - Carga de datos
   - Gráficas interactivas
   - Navegación entre secciones
   - Formularios

3. **`js/supabase-integration.js`** - Integración completa con Supabase
   - CRUD de pacientes
   - Predicciones ML
   - Estadísticas
   - Funciones reutilizables

### 🗑️ Archivos Respaldados

- `index_old.html` - Versión anterior del index (respaldo)

---

## 🚀 Próximos Pasos

### 1. Configurar Supabase

Debes actualizar las credenciales en estos 3 archivos:

**`js/auth.js`** (líneas 7-8):
```javascript
const SUPABASE_URL = 'https://TU_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
```

**`js/dashboard.js`** (líneas 7-8):
```javascript
const SUPABASE_URL = 'https://TU_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
```

**`js/supabase-integration.js`** (líneas 6-7):
```javascript
const SUPABASE_URL = 'https://TU_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
```

### 2. Crear Tablas en Supabase

Ejecuta estos SQL en tu base de datos Supabase:

```sql
-- Tabla de Pacientes
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    edad_meses INT NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    talla DECIMAL(5,2) NOT NULL,
    zona VARCHAR(50) CHECK (zona IN ('urbana', 'rural')),
    nivel_socioeconomico VARCHAR(50) CHECK (nivel_socioeconomico IN ('bajo', 'medio', 'alto')),
    acceso_agua BOOLEAN DEFAULT true,
    vacunacion BOOLEAN DEFAULT true,
    educacion_madre VARCHAR(100),
    ingreso_familiar DECIMAL(10,2),
    nivel_riesgo VARCHAR(20),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de Predicciones
CREATE TABLE predicciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
    nivel_riesgo VARCHAR(20) NOT NULL,
    probabilidad DECIMAL(5,4),
    modelo_usado VARCHAR(100),
    parametros JSONB,
    fecha_prediccion TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- Índices para mejor rendimiento
CREATE INDEX idx_pacientes_riesgo ON pacientes(nivel_riesgo);
CREATE INDEX idx_pacientes_zona ON pacientes(zona);
CREATE INDEX idx_predicciones_fecha ON predicciones(fecha_prediccion);

-- Habilitar Row Level Security
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (los usuarios solo ven sus propios datos)
CREATE POLICY "Users can view own data" ON pacientes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON pacientes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON pacientes
    FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Habilitar Supabase Auth

En tu panel de Supabase:
1. Ve a **Authentication** > **Providers**
2. Habilita **Email**
3. Configura las URL de redirección:
   - `http://localhost:5500/dashboard.html` (desarrollo)
   - `https://hakaton-peach-sigma.vercel.app/dashboard.html` (producción)

### 4. Actualizar Vercel

Actualiza `vercel.json` si es necesario para las nuevas rutas.

---

## 📊 Flujo de la Aplicación

```
index.html (Landing - Selector de Rol)
    ↓
login.html (Autenticación)
    ↓
dashboard.html (Dashboard Principal)
    ├── Vista: Dashboard (estadísticas y gráficas)
    ├── Vista: Pacientes (lista completa)
    ├── Vista: Predicciones (historial)
    └── Vista: Registrar (nuevo paciente)
    
about.html (Información - accesible desde cualquier lado)
```

---

## 🎨 Diseño y UX

- **Responsivo**: Funciona en móvil, tablet y desktop
- **Colores**: Azul (#2563EB) y Verde (#10B981) para coherencia
- **Iconos**: Font Awesome 6
- **Tipografía**: Inter (Google Fonts)
- **Gráficas**: Chart.js para visualizaciones

---

## 🔐 Seguridad

- Autenticación con Supabase Auth
- Row Level Security en tablas
- Protección de rutas en cliente
- Validación de sesiones

---

## 📝 Notas Importantes

1. **Los datos del dashboard son simulados** hasta que conectes con Supabase real
2. **El formulario de pacientes** guarda en localStorage hasta conectar BD
3. **Las gráficas** usan datos de ejemplo, cambiarán con datos reales
4. **Falta crear página de registro** (`register.html`) si quieres que usuarios nuevos se registren

---

## 🐛 Depuración

Para ver logs de Supabase en consola del navegador:
```javascript
console.log(window.sidiDB); // Ver funciones disponibles
console.log(await window.sidiDB.getCurrentSession()); // Ver sesión actual
```

---

## ✨ Lo que se eliminó

- ❌ Sección de "Pilares TIC" excesiva
- ❌ Contenido innecesario sobre tecnología
- ❌ Múltiples secciones informativas redundantes
- ❌ Demo simulado sin conexión real

## ✅ Lo que se agregó

- ✅ Selector de rol como página principal
- ✅ Sistema de login real con Supabase
- ✅ Dashboard funcional con gráficas
- ✅ CRUD de pacientes preparado
- ✅ Estructura modular y escalable
- ✅ Código limpio y documentado

---

¿Necesitas algo más? Solo dime y lo implemento! 🚀
