# Dashboard de marketing — despliegue en Vercel

Esta es la misma app que ya usabas en Claude, lista para vivir en su propia URL pública.
El único cambio interno es de dónde vienen y a dónde van los datos: en vez de `window.storage`
(que solo existe dentro de Claude), ahora usa [Supabase](https://supabase.com) — gratis para este
uso — como base de datos compartida.

## 1. Crear el proyecto en Supabase (5 minutos)

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta gratuita.
2. Crea un **New project** (elige cualquier nombre y contraseña de base de datos, no la necesitarás).
3. Cuando el proyecto esté listo, ve a **SQL Editor → New query**, pega el contenido del archivo
   `supabase.sql` (incluido aquí) y dale **Run**. Esto crea la tabla donde vive toda la información
   del dashboard.
4. Ve a **Project Settings → API**. Ahí vas a copiar dos valores:
   - **Project URL**
   - **anon public key**

## 2. Configurar las variables de entorno

Copia el archivo `.env.example` a `.env` y pega ahí tus dos valores de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

(Este archivo `.env` es solo para probar en tu computador — no lo subas a GitHub, ya está en
`.gitignore`. Las variables reales para producción se configuran en Vercel en el paso 4.)

## 3. Subir el proyecto a GitHub

1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Desde esta carpeta, en tu terminal:

```bash
git init
git add .
git commit -m "Dashboard de marketing"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## 4. Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) con tu cuenta (puedes usar la misma de GitHub).
2. **Add New → Project** y elige el repositorio que acabas de subir.
3. Vercel detecta automáticamente que es un proyecto Vite — no necesitas tocar nada en "Build settings".
4. Antes de darle a **Deploy**, abre **Environment Variables** y agrega las mismas dos que pusiste
   en tu `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Dale **Deploy**. En un par de minutos tendrás una URL pública tipo
   `https://tu-dashboard.vercel.app` que puedes compartir con tu equipo.

## Cómo probarlo en tu computador antes de subirlo

```bash
npm install
npm run dev
```

Abre la URL que te muestre la terminal (normalmente `http://localhost:5173`).

## Nota sobre seguridad

Esta configuración usa la clave pública (`anon key`) de Supabase, que queda visible en el
navegador — es normal y es como funcionan la mayoría de apps sin backend propio. Eso significa
que **cualquier persona con la URL de la app puede ver y editar los datos**, igual que pasaba
compartiendo el artifact dentro de Claude. Si más adelante quieres que solo ciertas personas
puedan editar (por ejemplo, con usuario y contraseña por persona), se puede agregar autenticación
de Supabase — es un paso aparte, dímelo cuando quieras avanzar en eso.
