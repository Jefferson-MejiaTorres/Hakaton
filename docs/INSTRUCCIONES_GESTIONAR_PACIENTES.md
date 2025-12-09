# 📋 Instrucciones - Gestionar Pacientes

## ✅ Implementación Completada

Se ha implementado completamente la funcionalidad de **Gestionar Pacientes** para el rol de médico.

## 🎯 Funcionalidades Implementadas

### 1. **Cargar Pacientes**
- ✅ Carga automática desde Supabase al abrir la sección
- ✅ Muestra tabla con: nombre, edad, peso, talla, zona, nivel de riesgo
- ✅ Avatar con inicial del nombre
- ✅ Badges de colores según nivel de riesgo
- ✅ Estados de carga con spinner animado

### 2. **Sistema de Filtros**
- ✅ **Filtro por Nombre**: Búsqueda en nombre y apellido
- ✅ **Filtro por Zona**: Urbana/Rural
- ✅ **Filtro por Riesgo**: Alto/Medio/Bajo
- ✅ Filtros combinables
- ✅ Enter para buscar rápido

### 3. **Ver Detalles** 👁️
- ✅ Modal animado con información completa
- ✅ Datos del paciente: nombre, fecha nacimiento, sexo, documento
- ✅ Última medición: peso, talla, IMC
- ✅ Diseño profesional con gradientes y tarjetas

### 4. **Editar Paciente** ✏️
- ✅ Modal de edición con formulario
- ✅ Campos: nombre, apellido, fecha nacimiento, sexo
- ✅ Validación de campos requeridos
- ✅ Actualización en Supabase
- ✅ Recarga automática de tabla

### 5. **Eliminar Paciente** 🗑️
- ✅ Confirmación antes de eliminar
- ✅ Mensaje con nombre del paciente
- ✅ Eliminación en Supabase
- ✅ Actualización de tabla

## 🎨 Características de Diseño

- ✅ Animaciones suaves (fade-in, scale-in)
- ✅ Iconos Font Awesome para acciones
- ✅ Badges de colores según riesgo:
  - 🔴 Alto: Rojo
  - 🟡 Medio: Amarillo
  - 🟢 Bajo: Verde
  - ⚪ Sin evaluar: Gris
- ✅ Hover effects en botones y filas
- ✅ Gradientes en modales
- ✅ Responsive design

## 📊 Verificar Datos en Supabase

### Opción 1: Panel de Supabase
1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto
3. Ve a **Table Editor**
4. Verifica que tengas datos en estas tablas:
   - `ninos` (mínimo 10 registros)
   - `mediciones_antropometricas`
   - `datos_sociodemograficos`
   - `predicciones`

### Opción 2: Insertar Datos de Ejemplo
Si no tienes datos, ejecuta el archivo `backend/datos_ejemplo.sql`:

1. En Supabase, ve a **SQL Editor**
2. Copia y pega el contenido de `backend/datos_ejemplo.sql`
3. Ejecuta el query
4. Verifica que se crearon los registros

## 🚀 Probar la Funcionalidad

1. **Iniciar sesión** como médico
2. **Ir a "Gestionar Pacientes"** en el menú
3. **Verificar** que se cargue la tabla
4. **Probar filtros**:
   - Buscar por nombre
   - Filtrar por zona
   - Filtrar por riesgo
5. **Probar acciones**:
   - 👁️ Ver detalles de un paciente
   - ✏️ Editar información
   - 🗑️ Eliminar paciente (con confirmación)

## 🔧 Archivos Modificados

- ✅ `frontend/js/dashboard.js` (+400 líneas)
  - Función `cargarPacientes(filtros)`
  - Función `setupFiltros()`
  - Función `verDetallePaciente(id)`
  - Función `editarPaciente(id)`
  - Función `eliminarPaciente(id)`
  - Función `confirmarEliminar(id, nombre)`
  - Modales animados
  
- ✅ `frontend/css/styles.css`
  - Animaciones `animate-fade-in`
  - Animaciones `animate-scale-in`
  - Keyframes para modales

## ❗ Importante

- La tabla usa **SERIAL PRIMARY KEY** (integer), no UUID
- Los filtros son opcionales y combinables
- Las eliminaciones son permanentes (añadir confirmación)
- Los modales se cierran con el botón X o botones de acción

## 🐛 Solución de Problemas

### No se cargan pacientes
- Verificar que hay datos en la tabla `ninos`
- Revisar consola del navegador (F12)
- Verificar conexión a Supabase

### Error al editar/eliminar
- Verificar que el ID del paciente existe
- Revisar permisos en Supabase (RLS policies)

### Filtros no funcionan
- Verificar que los IDs de los inputs coincidan:
  - `filtro-nombre`
  - `filtro-zona`
  - `filtro-riesgo`
  - `btn-filtrar`

## 🎯 Siguiente Paso

Después de probar Gestionar Pacientes, implementaremos:
- **Registrar Paciente**: Formulario completo para nuevos pacientes

---

✅ **Estado**: Gestionar Pacientes - IMPLEMENTADO Y LISTO PARA PRUEBAS
