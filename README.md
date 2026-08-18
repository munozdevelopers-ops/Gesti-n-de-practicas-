# Gestión de Prácticas CUL

Sitio estático para consultar ofertas de práctica publicado con GitHub Pages y conectado a Supabase.

## Antes de publicar

1. Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` en `script.js` correspondan a tu proyecto. La clave debe ser de tipo **anon / publishable**; la encuentras en **Supabase Dashboard → Project Settings → API**.
2. No uses ni publiques la clave `service_role`: permite acceso administrativo total y debe permanecer solo en un servidor seguro.
3. En Supabase, habilita RLS y crea una política `SELECT` pública únicamente para las tablas y columnas de ofertas que desees mostrar (`ofertas_practicas`, `empresas` y `programas`).
4. Las postulaciones, entrevistas, documentos y datos de estudiantes deben requerir inicio de sesión; una página pública no debe consultar esa información.

## Publicar en GitHub Pages

Esta carpeta debe ser un repositorio independiente. Actualmente el repositorio Git detectado está en `D:/`, por lo que no ejecutes `git add .` desde allí: incluiría archivos ajenos al proyecto.

1. Crea un repositorio nuevo en GitHub, por ejemplo `Gestion-Practicas-CUL`.
2. Sube solamente el contenido de esta carpeta (`index.html`, `styles.css`, `script.js` y este README).
3. En GitHub abre **Settings → Pages**, selecciona **Deploy from a branch**, la rama `main` y la carpeta `/(root)`.
4. Guarda los cambios y abre la URL que GitHub mostrará en esa misma pantalla.

No se necesita compilación: GitHub Pages servirá directamente `index.html`.
