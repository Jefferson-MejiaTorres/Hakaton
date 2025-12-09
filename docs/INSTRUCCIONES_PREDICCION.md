# 🔬 Instrucciones - Sistema de Predicción Automática

## ✅ Funcionalidad Implementada

Ahora cuando registres un paciente, el sistema **automáticamente**:
1. ✅ Calcula el IMC
2. ✅ Calcula la edad en meses
3. ✅ Ejecuta el modelo de predicción SQL
4. ✅ Determina el nivel de riesgo (alto/medio/bajo)
5. ✅ Calcula la probabilidad
6. ✅ Identifica factores de riesgo
7. ✅ Genera recomendaciones médicas
8. ✅ Guarda la predicción en la base de datos
9. ✅ Muestra un modal profesional con todos los resultados

---

## 🔧 PASO 1: Verificar Función SQL en Supabase

### Opción A: Verificar si ya existe

Ejecuta este query en el **SQL Editor** de Supabase:

```sql
-- Ver si la función existe
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('predecir_simple', 'predecir_desnutricion', 'guardar_prediccion');
```

**Si ves resultados:** ¡La función ya está creada! Puedes pasar al Paso 2.

**Si NO ves resultados:** Continúa con la Opción B.

---

### Opción B: Crear la Función SQL

Si la función NO existe, ejecuta **TODO** el contenido del archivo:

📄 `backend/funcion_prediccion.sql`

**Pasos:**
1. Ve a https://supabase.com/dashboard
2. Abre tu proyecto
3. Ve a **SQL Editor**
4. Crea un nuevo query
5. Copia y pega **TODO** el contenido de `backend/funcion_prediccion.sql`
6. Haz click en **RUN**

**Resultado esperado:**
```
Success. No rows returned
```

---

## 🔐 PASO 2: Verificar Permisos RLS

La función SQL necesita permisos para que los usuarios autenticados la ejecuten:

```sql
-- Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION predecir_simple(INTEGER, NUMERIC, NUMERIC, VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION predecir_desnutricion(INTEGER, NUMERIC, NUMERIC, INTEGER, INTEGER, VARCHAR, VARCHAR, NUMERIC, BOOLEAN, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION guardar_prediccion(INTEGER, INTEGER, NUMERIC, NUMERIC, INTEGER, INTEGER, VARCHAR, VARCHAR, NUMERIC, BOOLEAN, BOOLEAN) TO authenticated;
```

---

## 🧪 PASO 3: Probar la Función

Ejecuta este test en el SQL Editor:

```sql
-- Test básico de predicción
SELECT * FROM predecir_simple(
    24,      -- edad en meses (2 años)
    10.5,    -- peso en kg
    82.0,    -- talla en cm
    'urbana', -- zona
    'secundaria' -- educación madre
);
```

**Resultado esperado:**
Deberías ver un JSON con:
- `nivel_riesgo`: "alto", "medio" o "bajo"
- `probabilidad`: número entre 0 y 1
- `clasificacion`: texto descriptivo
- `imc`: valor calculado
- `z_scores`: puntajes Z
- `factores_riesgo`: array de factores
- `recomendaciones`: array de recomendaciones

---

## 📊 PASO 4: Verificar Tabla de Predicciones

Asegúrate de que la tabla `predicciones` exista:

```sql
-- Ver estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'predicciones';
```

**Columnas esperadas:**
- `id` (SERIAL PRIMARY KEY)
- `nino_id` (INTEGER, FK a ninos)
- `nivel_riesgo` (VARCHAR)
- `probabilidad` (NUMERIC)
- `modelo_usado` (VARCHAR)
- `fecha_prediccion` (DATE)
- `factores_principales` (TEXT)

**Si NO existe**, ejecuta el esquema en `backend/supabase_schema.sql`

---

## 🚀 PASO 5: Probar en el Frontend

1. **Iniciar sesión** como médico
2. Ir a **"Registrar Paciente"**
3. Llenar el formulario completo:
   - Nombre: Juan
   - Apellido: Pérez
   - Fecha de nacimiento: 2022-01-15
   - Sexo: Masculino
   - Documento: TEST001
   - **Peso: 10.5 kg** (bajo para la edad)
   - **Talla: 80 cm** (baja para la edad)
   - Zona: Rural
   - Educación madre: Primaria
4. Hacer click en **"Registrar Paciente"**

---

## ✅ Resultado Esperado

Después de unos segundos, deberías ver un **modal profesional** con:

### 1. Datos del Paciente
- Nombre completo
- Documento
- Fecha de nacimiento
- Sexo
- IMC calculado

### 2. Diagnóstico Automático
- **Nivel de riesgo** con color:
  - 🔴 ALTO (rojo)
  - 🟠 MEDIO (naranja)
  - 🟢 BAJO (verde)
- **Probabilidad en %**

### 3. Factores Identificados
Lista de factores de riesgo detectados:
- Peso muy bajo para la edad
- Talla baja para la edad
- Zona rural con acceso limitado
- Nivel educativo materno bajo
- etc.

### 4. Recomendaciones
Lista de acciones recomendadas:
- Intervención médica urgente
- Evaluación nutricional
- Seguimiento
- etc.

---

## 🎯 Cómo Funciona el Sistema

### Flujo Completo:

```
1. Usuario llena formulario
   ↓
2. Se registra el niño en tabla 'ninos'
   ↓
3. Se registra medición en 'mediciones_antropometricas'
   ↓
4. Se registran datos en 'datos_sociodemograficos'
   ↓
5. ⭐ SE EJECUTA FUNCIÓN SQL DE PREDICCIÓN ⭐
   ↓
6. Función calcula:
   - IMC
   - Z-scores (peso/edad, talla/edad)
   - Score de riesgo (0-100)
   - Nivel de riesgo
   - Probabilidad
   - Factores de riesgo
   - Recomendaciones
   ↓
7. Se guarda predicción en tabla 'predicciones'
   ↓
8. Se muestra modal con resultados completos
```

### Algoritmo de Predicción:

El modelo SQL calcula un **score de riesgo** basado en:

| Factor | Peso | Criterio |
|--------|------|----------|
| Z-score peso/edad | 30% | < -3: 30 pts, < -2: 20 pts, < -1: 10 pts |
| Z-score talla/edad | 25% | < -3: 25 pts, < -2: 18 pts, < -1: 8 pts |
| Episodios de diarrea | 15% | ≥6: 15 pts, ≥3: 8 pts |
| Infecciones respiratorias | 10% | ≥5: 10 pts, ≥3: 5 pts |
| Zona rural | 5% | Rural: 5 pts |
| Educación materna | 5% | Primaria/ninguna: 5 pts |
| Ingreso familiar | 5% | <500k: 5 pts, <800k: 3 pts |
| Agua potable | 3% | No: 3 pts |
| Vacunación | 2% | Incompleta: 2 pts |

**Clasificación:**
- **Score ≥ 60**: RIESGO ALTO
- **Score 30-59**: RIESGO MEDIO
- **Score < 30**: RIESGO BAJO

---

## 🐛 Troubleshooting

### Error: "function predecir_simple does not exist"
**Solución:** La función SQL no está creada. Ejecuta `backend/funcion_prediccion.sql`

### Error: "permission denied for function"
**Solución:** Ejecuta los comandos GRANT del Paso 2

### La predicción muestra "sin evaluar"
**Causas posibles:**
1. Error en la función SQL (revisar logs)
2. Datos incompletos (peso, talla, edad)
3. Error de permisos

**Verificar:**
```sql
-- Ver errores recientes
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%predecir_simple%' 
ORDER BY calls DESC LIMIT 10;
```

### Modal no muestra factores/recomendaciones
**Causa:** La función SQL retornó null o vacío
**Solución:** Verificar que todos los parámetros se pasen correctamente

---

## 📈 Ventajas del Sistema

✅ **Automático**: No requiere intervención manual
✅ **Rápido**: Predicción en < 1 segundo
✅ **Consistente**: Mismos criterios para todos
✅ **Transparente**: Muestra factores y recomendaciones
✅ **Sin Backend**: Todo en SQL (no requiere Python)
✅ **Auditado**: Todas las predicciones se guardan
✅ **Escalable**: Puede manejar miles de predicciones

---

## 🔄 Próximos Pasos

Una vez que funcione la predicción básica, puedes mejorar:

1. **Agregar más factores** al formulario:
   - Historia clínica (enfermedades previas)
   - Episodios de diarrea
   - Infecciones respiratorias
   - Acceso a agua potable
   - Vacunación completa

2. **Mejorar el modelo** con datos reales del norte de Santander

3. **Agregar gráficas** de evolución del riesgo en el tiempo

4. **Exportar reportes** con predicciones

5. **Alertas automáticas** para casos de alto riesgo

---

## ✅ Checklist de Verificación

- [ ] Función SQL `predecir_simple` existe
- [ ] Función SQL `predecir_desnutricion` existe
- [ ] Permisos GRANT ejecutados
- [ ] Test SQL funciona correctamente
- [ ] Tabla `predicciones` existe
- [ ] Políticas RLS configuradas
- [ ] Frontend ejecuta predicción al registrar
- [ ] Modal muestra resultados completos
- [ ] Predicción se guarda en BD
- [ ] Navegación a "Ver Pacientes" funciona

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs del navegador (F12 → Console)
2. Revisa los logs de Supabase (Dashboard → Logs)
3. Verifica que tengas datos de ejemplo
4. Prueba con diferentes valores (peso alto, bajo, etc.)

---

🎉 **¡Listo! Ahora tienes un sistema completo de predicción automática de desnutrición infantil.**
