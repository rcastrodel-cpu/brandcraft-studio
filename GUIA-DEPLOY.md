# 🚀 Guía de Deploy — Brandcraft Studio
## Cómo publicar tu app en 30 minutos sin saber programación

---

## PASO 1 — Obtener la API Key de Anthropic

1. Abrí **console.anthropic.com** en tu navegador
2. Creá una cuenta (necesitás email y tarjeta de crédito)
3. Una vez adentro, andá a **"API Keys"** en el menú lateral
4. Hacé click en **"Create Key"**
5. Copiá la clave que empieza con `sk-ant-...` y guardala en un lugar seguro

> 💡 **Costo estimado:** Para un equipo de 2-5 personas usando la app moderadamente, el costo mensual es de $5-20 USD. Podés poner un límite de gasto en "Billing" para no llevarte sorpresas.

---

## PASO 2 — Subir el proyecto a GitHub

1. Creá una cuenta en **github.com** (es gratis)
2. Hacé click en el botón verde **"New"** para crear un repositorio
3. Ponele nombre: `brandcraft-studio`
4. Dejalo en **"Private"** (privado) y hacé click en **"Create repository"**
5. En la página del repositorio, hacé click en **"uploading an existing file"**
6. Arrastrá TODOS los archivos del proyecto a esa pantalla
   - Incluí todas las carpetas: `pages/`, `components/`, `lib/`, `styles/`
   - Incluí: `package.json`, `next.config.js`, `.gitignore`
   - **NO subas** `.env.local` (contiene la API key)
7. Hacé click en **"Commit changes"**

---

## PASO 3 — Deploy en Vercel

1. Abrí **vercel.com** y creá una cuenta con tu cuenta de GitHub
2. Hacé click en **"Add New Project"**
3. Seleccioná el repositorio `brandcraft-studio` de la lista
4. Vercel va a detectar automáticamente que es un proyecto Next.js
5. **IMPORTANTE — Antes de hacer deploy**, hacé click en **"Environment Variables"**
6. Agregá esta variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-TU_CLAVE_AQUI` (pegá tu clave real)
7. Hacé click en **"Deploy"**
8. Esperá 2-3 minutos mientras Vercel construye la app
9. Cuando termine, vas a ver un link como: `brandcraft-studio.vercel.app`

✅ **¡Listo! Tu app está pública.**

---

## PASO 4 — Compartir con tu equipo

Simplemente compartí la URL que te dio Vercel:

```
https://brandcraft-studio.vercel.app
```

Cualquier persona con ese link puede usar la app **sin necesidad de tener cuenta de Claude ni de Anthropic**. Solo necesitan el link.

---

## PASO 5 — Dominio personalizado (opcional)

Si querés una URL más linda como `brand.tuempresa.com`:

1. En Vercel, andá a tu proyecto → **"Settings"** → **"Domains"**
2. Escribí tu dominio personalizado
3. Seguí las instrucciones para configurar el DNS en tu proveedor de dominio

---

## Actualizaciones futuras

Para actualizar la app con nuevas versiones:

1. En GitHub, andá al repositorio
2. Editá o subí los archivos actualizados
3. Vercel detecta el cambio automáticamente y hace el re-deploy en ~2 minutos

---

## Preguntas frecuentes

**¿La API key queda expuesta al público?**
No. Vercel guarda las variables de entorno de forma segura en el servidor. Los usuarios nunca ven la clave.

**¿Se puede romper algo si muchos la usan a la vez?**
No se rompe, pero si hay mucho uso el costo de la API puede subir. Podés poner un límite mensual en Anthropic Console.

**¿Los datos del historial y biblioteca se comparten entre usuarios?**
El historial y la biblioteca se guardan en el navegador de cada usuario (localStorage). Para compartir activos entre el equipo, cada persona necesita cargar los suyos.

**¿Puedo agregar contraseña para que no cualquiera acceda?**
Sí. En Vercel podés activar **"Password Protection"** en Settings → Security. Con eso, la app pide una contraseña antes de entrar.

---

## Soporte

Si algo no funciona, revisá:
1. Que la `ANTHROPIC_API_KEY` esté bien cargada en Vercel (Settings → Environment Variables)
2. Que la cuenta de Anthropic tenga crédito disponible (console.anthropic.com → Billing)
3. Los logs de error en Vercel (tu proyecto → Deployments → Functions)
