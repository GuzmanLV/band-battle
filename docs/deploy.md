# Guía de Despliegue: Band Battle (Vercel + Supabase)

Esta guía explica cómo desplegar la aplicación en producción utilizando Vercel para el frontend/backend y Supabase para la base de datos PostgreSQL.

## 1. Configurar Supabase (Base de Datos)

1. Crea una cuenta en [Supabase](https://supabase.com/).
2. Crea un nuevo proyecto.
3. Ve a **Project Settings -> Database**.
4. Copia el **Connection string (URI)**. Asegúrate de que termine con los parámetros adecuados (por ejemplo, `?pgbouncer=true&connection_limit=1` si usas Prisma con pgbouncer, o directamente usa la URL normal). Con Prisma 5+ y Supabase, a menudo es mejor usar la "Transaction connection pooler" URL como `DATABASE_URL` y la "Session connection pooler" URL como `DIRECT_URL`.

*Importante:* En `prisma/schema.prisma` ahora está configurado para `postgresql`. Si necesitas `DIRECT_URL` para las migraciones, deberás agregarlo al bloque `datasource`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Para aplicar tu esquema a la base de datos de Supabase desde tu computadora, corre:
`npx prisma db push` o `npx prisma migrate deploy` (si usas migraciones).

## 2. Configurar el Storage Multimedia

En lugar de subir los archivos MP3/MP4 directamente al servidor web (lo cual no es óptimo), usarás un servicio CDN.

1. **Opción Recomendada (Supabase Storage):** En tu panel de Supabase, ve a "Storage" y crea un nuevo bucket (ej. `band-audio`). Asegúrate de que sea **Público**.
2. Sube tus archivos de audio allí.
3. Copia la **URL Pública** del archivo y pégala en el campo "URL del Audio" en el Panel de Administrador de Band Battle.

## 3. Despliegue en Vercel

1. Sube tu código a un repositorio en GitHub.
2. Crea una cuenta en [Vercel](https://vercel.com/).
3. Haz clic en **Add New -> Project** y selecciona tu repositorio de GitHub.
4. En **Environment Variables**, debes configurar exactamente las siguientes:

- `DATABASE_URL`: La URL de conexión de Supabase.
- `NEXTAUTH_SECRET`: Un string aleatorio seguro (puedes generar uno corriendo `openssl rand -base64 32` en la terminal).
- `NEXTAUTH_URL`: La URL final de tu aplicación en Vercel (ej. `https://mi-band-battle.vercel.app`).
- `GOOGLE_CLIENT_ID`: Tu ID de cliente de Google Cloud Console.
- `GOOGLE_CLIENT_SECRET`: Tu secreto de Google Cloud Console.

5. En el panel de Google Cloud (donde creaste tu OAuth), **debes actualizar las URLs autorizadas** para agregar la URL de producción (ej. `https://mi-band-battle.vercel.app` y `https://mi-band-battle.vercel.app/api/auth/callback/google`).
6. Haz clic en **Deploy**.

¡Eso es todo! La aplicación se construirá automáticamente ejecutando Prisma Generate y estará lista para producción.
