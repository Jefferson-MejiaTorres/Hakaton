# 🗑️ Instrucciones - Eliminar Pacientes

## ✅ Cambios Implementados

Se ha mejorado el sistema de eliminación de pacientes con:

1. **Modal bonito de confirmación** (reemplaza el `confirm()` nativo)
2. **Feedback visual durante la eliminación** (loading spinner)
3. **Notificaciones elegantes** (éxito/error con animaciones)
4. **Advertencias claras** sobre la eliminación de datos relacionados

---

## 🔐 PASO 1: Configurar Permisos en Supabase

**IMPORTANTE:** Ejecuta estas queries en el **SQL Editor de Supabase** antes de probar la eliminación.

```sql
-- ========================================
-- POLÍTICAS DE ELIMINACIÓN - TABLA NINOS
-- ========================================

-- 1. Habilitar Row Level Security
ALTER TABLE ninos ENABLE ROW LEVEL SECURITY;

-- 2. Política para ELIMINAR (DELETE)
CREATE POLICY "Usuarios autenticados pueden eliminar niños"
ON ninos
FOR DELETE
TO authenticated
USING (true);

-- 3. Política para VER (SELECT)
CREATE POLICY "Usuarios autenticados pueden ver niños"
ON ninos
FOR SELECT
TO authenticated
USING (true);

-- 4. Política para INSERTAR (INSERT)
CREATE POLICY "Usuarios autenticados pueden crear niños"
ON ninos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Política para ACTUALIZAR (UPDATE)
CREATE POLICY "Usuarios autenticados pueden actualizar niños"
ON ninos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ========================================
-- VERIFICAR QUE LAS POLÍTICAS SE CREARON
-- ========================================
SELECT * FROM pg_policies WHERE tablename = 'ninos';
```

### ¿Qué hace esto?

- **Row Level Security (RLS):** Activa el sistema de seguridad a nivel de fila
- **Políticas:** Define quién puede hacer qué con los datos
- **`authenticated`:** Solo usuarios que iniciaron sesión pueden eliminar

---

## 🎨 PASO 2: Probar la Nueva Funcionalidad

### 1. **Modal de Confirmación Bonito**

Cuando intentas eliminar un paciente:

- ✅ Modal con diseño profesional (degradado rojo)
- ✅ Ícono de advertencia grande
- ✅ Nombre del paciente destacado
- ✅ Mensaje de advertencia amarillo
- ✅ Botones grandes: "Cancelar" y "Eliminar"
- ✅ Se puede cerrar clickeando fuera del modal

### 2. **Loading Durante la Eliminación**

- ✅ Spinner animado mientras se elimina
- ✅ Mensaje: "Eliminando paciente..."

### 3. **Notificación de Éxito**

- ✅ Banner verde en la esquina superior derecha
- ✅ Ícono de check ✓
- ✅ Mensaje: "Paciente [nombre] eliminado exitosamente"
- ✅ Se auto-cierra después de 3 segundos
- ✅ Animación de entrada/salida suave

### 4. **Notificación de Error**

- ✅ Banner rojo en caso de error
- ✅ Ícono de X
- ✅ Mensaje descriptivo del error
- ✅ Se auto-cierra después de 5 segundos

---

## 🧪 Cómo Probar

### Paso 1: Verificar Permisos
```bash
# En Supabase SQL Editor:
SELECT * FROM pg_policies WHERE tablename = 'ninos';

# Deberías ver 4 políticas:
# - SELECT
# - INSERT
# - UPDATE
# - DELETE
```

### Paso 2: Probar Eliminación Exitosa

1. **Iniciar sesión** como médico
2. **Ir a "Gestionar Pacientes"**
3. **Clickear el ícono de basura** 🗑️ en cualquier paciente
4. **Ver el modal bonito** con:
   - Nombre del paciente
   - Advertencia en amarillo
   - Botones grandes
5. **Clickear "Eliminar"**
6. **Ver el loading** (spinner)
7. **Ver notificación verde** de éxito
8. **Verificar** que el paciente desapareció de la tabla

### Paso 3: Probar Cancelación

1. **Clickear el ícono de basura** 🗑️
2. **Clickear "Cancelar"** en el modal
3. **Verificar** que el modal se cerró y el paciente sigue ahí

### Paso 4: Cerrar Modal con Click Afuera

1. **Clickear el ícono de basura** 🗑️
2. **Clickear fuera del modal** (en el fondo oscuro)
3. **Verificar** que el modal se cerró

---

## 🔧 Archivos Modificados

### 1. `frontend/js/dashboard.js`

**Cambios:**
- ✅ Función `confirmarEliminar()` ahora muestra modal bonito
- ✅ Función `eliminarPaciente()` mejorada con loading y notificaciones
- ✅ Nueva función `mostrarNotificacion()` para feedback visual

**Líneas modificadas:**
- Líneas 560-635: Modal de confirmación
- Líneas 637-710: Eliminación con feedback

### 2. `frontend/css/styles.css`

**Cambios:**
- ✅ Agregadas animaciones `slideInRight` y `slideOutRight`

**Líneas modificadas:**
- Líneas 176-203: Nuevas animaciones

---

## 🚨 Errores Comunes y Soluciones

### Error: "new row violates row-level security policy"

**Causa:** No se ejecutaron las políticas de Supabase

**Solución:**
```sql
-- Ejecutar en Supabase SQL Editor:
ALTER TABLE ninos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden eliminar niños"
ON ninos FOR DELETE TO authenticated USING (true);
```

---

### Error: "Failed to delete: No rows deleted"

**Causa:** El ID del paciente no existe o ya fue eliminado

**Solución:** Recargar la página (F5) y verificar que el paciente existe

---

### Error: "Network error"

**Causa:** Sin conexión a internet o Supabase caído

**Solución:** Verificar conexión y estado de Supabase

---

## 📊 Comparación: Antes vs Después

| Característica | Antes | Después |
|---------------|-------|---------|
| **Confirmación** | `confirm()` nativo feo | Modal bonito con gradiente |
| **Advertencia** | Texto simple | Cuadro amarillo con ícono |
| **Loading** | Ninguno | Spinner animado |
| **Feedback éxito** | `alert()` nativo | Notificación verde animada |
| **Feedback error** | `alert()` nativo | Notificación roja con detalles |
| **Animaciones** | Ninguna | Entrada/salida suaves |
| **Accesibilidad** | Básica | Mejorada (botones grandes) |

---

## ✅ Checklist de Verificación

Antes de dar por terminado, verifica:

- [ ] Ejecutaste las políticas SQL en Supabase
- [ ] El modal de confirmación se muestra correctamente
- [ ] El botón "Cancelar" funciona
- [ ] Se puede cerrar clickeando fuera del modal
- [ ] Aparece el loading al eliminar
- [ ] Se muestra notificación verde de éxito
- [ ] Se muestra notificación roja si hay error
- [ ] Las notificaciones se auto-cierran
- [ ] La tabla se recarga automáticamente
- [ ] Las animaciones son suaves

---

## 🎯 Funcionalidades Futuras (Opcional)

- [ ] Agregar "Papelera" para recuperar pacientes eliminados
- [ ] Registro de auditoría (quién eliminó qué y cuándo)
- [ ] Confirmación doble para casos de alto riesgo
- [ ] Exportar datos antes de eliminar

---

## 📞 Soporte

Si algo no funciona:

1. **Verifica la consola** del navegador (F12 → Console)
2. **Revisa los errores** de Supabase en la pestaña "Logs"
3. **Comprueba que las políticas** existen: `SELECT * FROM pg_policies WHERE tablename = 'ninos';`

---

**✅ Listo para usar!**
