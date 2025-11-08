# 🚀 Instrucciones para Desplegar en Vercel

## Problema Resuelto
Los archivos JavaScript y CSS ahora tienen rutas correctas con `./` para funcionar en Vercel.

## Pasos para Actualizar en Vercel:

### 1. Subir cambios a GitHub

```bash
# Navegar al directorio
cd /c/Users/ASUS/Proyectos/Hakaton

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Fix: Actualizar rutas de archivos para Vercel - Agregar sistema de selección por tipo de persona"

# Subir a GitHub
git push origin main
```

### 2. Vercel detectará automáticamente los cambios

- Si ya tienes el proyecto conectado a Vercel, se desplegará automáticamente
- Si no, ve a [vercel.com](https://vercel.com) y conecta tu repositorio

### 3. Verificar en Vercel

Una vez desplegado, verifica que:
- ✅ Los estilos CSS se carguen correctamente
- ✅ El JavaScript funcione (menú móvil, formulario de pasos)
- ✅ Las animaciones funcionen
- ✅ El simulador de predicción funcione

## Archivos Actualizados:

- ✅ `index.html` - Rutas actualizadas a `./styles.css` y `./script.js`
- ✅ `vercel.json` - Configuración mejorada para servir archivos estáticos
- ✅ `.vercelignore` - Archivo creado para optimizar el despliegue
- ✅ `script.js` - Sistema de pasos para tipo de persona
- ✅ `styles.css` - Estilos para botones de tipo de persona

## Si aún no funciona en Vercel:

### Opción A: Forzar nuevo despliegue
1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Click en los tres puntos del último deploy
4. Click en "Redeploy"

### Opción B: Verificar logs
1. Ve a tu proyecto en Vercel
2. Click en "Deployments"
3. Click en el último deploy
4. Revisa los logs para ver si hay errores

### Opción C: Limpiar caché
1. En tu navegador, abre las Developer Tools (F12)
2. Click derecho en el botón de recargar
3. Selecciona "Empty Cache and Hard Reload"

## Comandos Git Rápidos:

```bash
# Si es tu primera vez subiendo
git init
git add .
git commit -m "Initial commit - SIDI con sistema de tipos de persona"
git branch -M main
git remote add origin https://github.com/Jefferson-MejiaTorres/Hakaton.git
git push -u origin main

# Si ya existe el repositorio
git add .
git commit -m "Fix: Rutas de archivos para Vercel"
git push
```

## ⚠️ Nota Importante:

Las rutas ahora son:
- `./styles.css` en lugar de `styles.css`
- `./script.js` en lugar de `script.js`

Esto asegura que Vercel encuentre los archivos correctamente.

## 🎉 Una vez desplegado:

Tu sitio debería funcionar completamente con:
- ✨ Sistema de selección de tipo de persona (Bebé, Niño, Adolescente, Adulto)
- ✨ Formulario adaptativo según el tipo
- ✨ Análisis personalizado por grupo etario
- ✨ Recomendaciones específicas para cada tipo
- ✨ Todas las animaciones y efectos

---

**¿Necesitas ayuda?** Revisa los logs en Vercel o abre las Developer Tools del navegador (F12) para ver errores de consola.
