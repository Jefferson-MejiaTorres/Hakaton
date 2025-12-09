# 📝 Instrucciones - Registrar Paciente

## 🔐 PASO 1: Configurar Permisos en Supabase

**IMPORTANTE:** Como las políticas YA EXISTEN, solo necesitas verificar que estén activas.

### ✅ Opción 1: Solo Verificar (RECOMENDADO)
Ejecuta esto para confirmar que todo está bien:

```sql
-- Ver todas las políticas existentes
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('ninos', 'mediciones_antropometricas', 'historia_clinica', 'datos_sociodemograficos', 'predicciones')
ORDER BY tablename, policyname;
```

Si ves políticas listadas, **¡ya está todo listo!** No necesitas hacer nada más.

---

### 🔄 Opción 2: Recrear Todas las Políticas (Solo si algo falla)

**ADVERTENCIA:** Esto eliminará y recreará TODAS las políticas. Solo úsalo si el registro no funciona.

```sql
-- ========================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS (ANTIGUAS Y NUEVAS)
-- ========================================

-- Eliminar políticas antiguas en inglés
DROP POLICY IF EXISTS "Users can view sociodem" ON datos_sociodemograficos;
DROP POLICY IF EXISTS "Users can view historia" ON historia_clinica;
DROP POLICY IF EXISTS "Users can insert mediciones" ON mediciones_antropometricas;
DROP POLICY IF EXISTS "Users can view mediciones" ON mediciones_antropometricas;
DROP POLICY IF EXISTS "Users can insert own ninos" ON ninos;
DROP POLICY IF EXISTS "Users can view own ninos" ON ninos;

-- Eliminar políticas nuevas en español
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear niños" ON ninos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer niños" ON ninos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver niños" ON ninos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar niños" ON ninos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar niños" ON ninos;

DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar mediciones" ON mediciones_antropometricas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer mediciones" ON mediciones_antropometricas;

DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar historia clínica" ON historia_clinica;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer historia clínica" ON historia_clinica;

DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar datos sociodemográficos" ON datos_sociodemograficos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer datos sociodemográficos" ON datos_sociodemograficos;

DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar predicciones" ON predicciones;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer predicciones" ON predicciones;

-- ========================================
-- PASO 2: CREAR POLÍTICAS NUEVAS
-- ========================================

-- Habilitar RLS
ALTER TABLE ninos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediciones_antropometricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE historia_clinica ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_sociodemograficos ENABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones ENABLE ROW LEVEL SECURITY;

-- TABLA: ninos
CREATE POLICY "Usuarios autenticados pueden crear niños"
ON ninos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer niños"
ON ninos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuarios autenticados pueden actualizar niños"
ON ninos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar niños"
ON ninos FOR DELETE TO authenticated USING (true);

-- TABLA: mediciones_antropometricas
CREATE POLICY "Usuarios autenticados pueden insertar mediciones"
ON mediciones_antropometricas FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer mediciones"
ON mediciones_antropometricas FOR SELECT TO authenticated USING (true);

-- TABLA: historia_clinica
CREATE POLICY "Usuarios autenticados pueden insertar historia clínica"
ON historia_clinica FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer historia clínica"
ON historia_clinica FOR SELECT TO authenticated USING (true);

-- TABLA: datos_sociodemograficos
CREATE POLICY "Usuarios autenticados pueden insertar datos sociodemográficos"
ON datos_sociodemograficos FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer datos sociodemográficos"
ON datos_sociodemograficos FOR SELECT TO authenticated USING (true);

-- TABLA: predicciones
CREATE POLICY "Usuarios autenticados pueden insertar predicciones"
ON predicciones FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden leer predicciones"
ON predicciones FOR SELECT TO authenticated USING (true);

-- ========================================
-- PASO 3: VERIFICAR
-- ========================================

SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('ninos', 'mediciones_antropometricas', 'historia_clinica', 'datos_sociodemograficos', 'predicciones')
ORDER BY tablename, policyname;
```

---

## ✅ PASO 2: Funcionalidades Implementadas

### 1. **Formulario Mejorado**
- ✅ Diseño profesional con gradientes
- ✅ Campos organizados en 3 pasos visuales
- ✅ Iconos descriptivos para cada sección
- ✅ Validación de campos requeridos
- ✅ Placeholders informativos
- ✅ Campos con formato correcto (date, select con enums)

### 2. **Proceso de Registro**
1. **Datos Personales**: Nombre, apellido, fecha nacimiento, sexo, documento
2. **Mediciones**: Peso, talla, perímetro braquial, peso al nacer
3. **Contexto**: Zona, nivel educativo madre, ingreso familiar

### 3. **Feedback Visual**
- ✅ Loading spinner durante el registro
- ✅ Modal de éxito con resumen del paciente
- ✅ Modal de error con mensaje descriptivo
- ✅ Botón de "Ver Paciente" que redirige a Gestionar Pacientes
- ✅ Animaciones suaves

---

## 🎨 Características del Diseño

### Modal de Éxito
- **Degradado verde-azul** en el header
- **Ícono de check** grande y animado
- **Resumen del paciente** registrado
- **Botones de acción**:
  - "Registrar Otro" → Limpia el formulario
  - "Ver Paciente" → Va a Gestionar Pacientes

### Modal de Error
- **Degradado rojo** en el header
- **Ícono de error** animado
- **Mensaje descriptivo** del problema
- **Botón de reintento**

---

## 📊 Datos que se Guardan

### Tabla: `ninos`
- nombre
- apellido
- fecha_nacimiento
- sexo ('M' o 'F')
- documento_identidad

### Tabla: `mediciones_antropometricas`
- nino_id (relación)
- fecha_medicion (hoy)
- peso
- talla
- perimetro_braquial
- peso_al_nacer
- imc (calculado automáticamente)

### Tabla: `datos_sociodemograficos`
- nino_id (relación)
- zona_residencia ('urbana' o 'rural')
- nivel_educativo_madre
- ingreso_familiar_mensual

---

## 🧪 Cómo Probar

1. **Ejecuta las queries SQL** en Supabase
2. **Recarga la página** (F5)
3. **Inicia sesión** como médico
4. **Ve a "Registrar Paciente"** en el menú
5. **Llena el formulario** con datos reales
6. **Clickea "Guardar y Analizar"**
7. **Observa**:
   - Loading spinner
   - Modal de éxito
   - Datos en Supabase

---

## 🔧 Archivos Modificados

1. `frontend/dashboard.html` - Formulario rediseñado
2. `frontend/js/dashboard.js` - Lógica de registro completa
3. `docs/INSTRUCCIONES_REGISTRAR_PACIENTE.md` - Este documento

---

## ✅ Checklist de Verificación

- [ ] Ejecutaste las políticas SQL en Supabase
- [ ] El formulario se muestra correctamente
- [ ] Todos los campos son editables
- [ ] Aparece loading al enviar
- [ ] Se muestra modal de éxito
- [ ] Los datos se guardan en Supabase
- [ ] El botón "Ver Paciente" funciona
- [ ] El botón "Registrar Otro" limpia el formulario

---

**✅ Listo para registrar pacientes!**
