# Guía de Supabase para Latido Ancestral

Este documento explica **solo la parte de Supabase** del proyecto:

- Cómo crear el proyecto en Supabase
- Cómo configurar variables de entorno
- Cómo importar el esquema `database/all.sql`
- Cómo crear y configurar los usuarios demo:
  - `katemartinez1507@gmail.com` → **admin global** de la aplicación
  - `admin@latido.com` → **dueño de una tienda de ejemplo** dentro del marketplace
  - `manager@latido.com` → **manager** de esa misma tienda
  - `user@latido.com` → **cliente** de prueba

Para una visión general de todo el proyecto (frontend, módulos, arquitectura), consulta el archivo principal `README.md`.

---

## 1. Crear el proyecto en Supabase

1. Entra en [https://supabase.com](https://supabase.com) y crea un nuevo proyecto.
2. Elige una **contraseña fuerte** para la base de datos.
3. Espera a que el proyecto termine de aprovisionarse.

---

## 2. Obtener datos de conexión y llaves

### 2.1. Datos de la base de datos

En el panel de Supabase ve a **Settings → Database → Connection info** y toma nota de:

- **Host** – suele tener forma `db.xxxxxx.supabase.co`
- **Port** – normalmente `5432`
- **Database name** – normalmente `postgres`
- **User** – normalmente `postgres`
- **Password** – la que pusiste al crear el proyecto

### 2.2. Llaves de API (Auth)

En **Project Settings → API** copia:

- **Project URL** → se usará en `NEXT_PUBLIC_SUPABASE_URL`
- **anon public key** → se usará en `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** → se usará en `SUPABASE_SERVICE_ROLE_KEY` (esta es **secreta**, solo servidor)

---

## 3. Configurar `.env.local`

En la raíz del proyecto (`Tienda_Virtual (copia)`) crea/edita el archivo `.env.local` con algo como:

```bash
# PostgreSQL: SIEMPRE el de Supabase (no Postgres local)
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_de_supabase
DB_NAME=postgres
DB_POOL_MAX=10

# Cookie interna de auth usada por el backend Next.js
AUTH_SECRET=cambia_esto_en_produccion

# Llaves de Supabase (Auth + cliente JS)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key   # SOLO servidor, no exponer

NODE_ENV=development
```

Notas importantes:

- No dejes los valores por defecto (`localhost`, `postgres/postgres`) cuando uses Supabase.
- El backend usa `src/lib/db.ts` para conectarse **directamente al PostgreSQL de Supabase** con estas variables.
- `supabaseClient.ts` utiliza `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el navegador y `SUPABASE_SERVICE_ROLE_KEY` en el servidor.

---

## 4. Importar el esquema `database/all.sql`

1. En el panel de Supabase abre **SQL Editor**.
2. Abre el archivo `database/all.sql` del proyecto y copia todo su contenido.
3. Asegúrate de que el **schema** seleccionado es `public`.
4. Ejecuta el script.

Este script:

- Crea **todas** las tablas, enums, funciones, triggers e índices.
- Inserta datos de ejemplo: roles, configuración, categorías, un vendor demo, productos demo y el cupón `BIENVENIDA10`.
- Inserta 3 usuarios de ejemplo en `public.usuarios` (con correos `admin@latidoancestral.com`, `vendor@latidoancestral.com`, `cliente@latidoancestral.com`).

Si quieres trabajar solo con tus propios usuarios (recomendado), puedes eliminar o ignorar esos usuarios de ejemplo más adelante.

---

## 5. Relación entre Supabase Auth y la tabla `usuarios`

Cada persona que usa la app debe existir en **dos sitios**:

1. **Supabase Auth** (`auth.users`) – gestiona email, contraseña y sesión.
2. **Tabla `public.usuarios`** – almacena el perfil interno de la tienda:
   - `id` (UUID) – **debe ser el mismo** que en `auth.users.id`.
   - `email`, `first_name`, `last_name`, `phone`.
   - `role` (`admin`, `vendor`, `customer`, `moderator`, `provider`).
   - `vendor_id` (si pertenece a una tienda específica).

Los endpoints de la app ya se encargan de sincronizar esto cuando registras usuarios desde la propia aplicación.

### Flujo recomendado para crear usuarios

1. Arranca el proyecto en local:

   ```bash
   npm install
   npm run dev
   ```

2. Abre `http://localhost:3000/register`.
3. Registra un usuario con el email que quieras.

Al enviar el formulario, el backend hace:

- `supabase.auth.admin.createUser` → crea el usuario en Supabase Auth.
- Inserta una fila en `public.usuarios` con **el mismo `id`** que Supabase.
- Devuelve los datos al frontend y emite la cookie `auth_token`.

Para iniciar sesión usa `http://localhost:3000/login`.

---

## 6. Configurar los usuarios demo

Tú ya tienes creados los siguientes usuarios en **Supabase Auth** (pestaña *Authentication → Users*):

- `katemartinez1507@gmail.com`
- `admin@latido.com`
- `manager@latido.com`
- `user@latido.com`

Ahora hay que asegurarse de que existan también en la tabla `usuarios` y con el rol correcto.

### 6.1. Opción recomendada (si aún estás en desarrollo)

1. Elimina estos usuarios desde **Authentication → Users**.
2. Entra a `http://localhost:3000/register` y regístralos desde la app, uno por uno:
   - `katemartinez1507@gmail.com`
   - `admin@latido.com`
   - `manager@latido.com`
   - `user@latido.com`
3. Después de crearlos, tendrás filas correspondientes en `public.usuarios` con el mismo `id`.
4. Ajusta los roles y vínculos de tienda con SQL.

### 6.2. Promocionar y asignar roles

Supongamos que ya existen las filas en `usuarios` para esos emails (porque los creaste vía `/register`). Entonces puedes ejecutar algo como:

```sql
-- 1) Admin global de la plataforma
UPDATE usuarios
SET role = 'admin'
WHERE email = 'katemartinez1507@gmail.com';

-- 2) Crear una tienda de ejemplo asociada a admin@latido.com
INSERT INTO vendors (business_name, slug, description, contact_email, status)
VALUES (
  'Tienda Latido Demo',
  'tienda-latido-demo',
  'Tienda de ejemplo dentro del marketplace Latido Ancestral.',
  'admin@latido.com',
  'active'
)
RETURNING id;
```

Anota el `id` devuelto (por ejemplo `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`). Luego ejecuta:

```sql
-- 3) Marcar admin@latido.com como vendor dueño de esa tienda
UPDATE usuarios
SET role = 'vendor', vendor_id = 'EL_ID_DE_TU_VENDOR_AQUI'
WHERE email = 'admin@latido.com';

-- 4) Manager de la misma tienda
UPDATE usuarios
SET role = 'vendor', vendor_id = 'EL_ID_DE_TU_VENDOR_AQUI'
WHERE email = 'manager@latido.com';

-- 5) Cliente de prueba
UPDATE usuarios
SET role = 'customer', vendor_id = NULL
WHERE email = 'user@latido.com';
```

Con esto queda:

- `katemartinez1507@gmail.com` → **admin global** (puede ver todo el marketplace).
- `admin@latido.com` → **dueño** de la tienda `Tienda Latido Demo`.
- `manager@latido.com` → **manager** de la misma tienda (mismo `vendor_id`).
- `user@latido.com` → **cliente** normal.

> Nota: el campo `password_hash` de `usuarios` se sigue rellenando automáticamente cuando registras usuarios desde la app. Cuando usas Supabase Auth, la verificación real de la contraseña la hace Supabase; `password_hash` sirve sobre todo para compatibilidad con versiones anteriores del backend.

### 6.3. Si los usuarios ya existen solo en Supabase Auth

Si creaste los usuarios desde el panel de Supabase (no desde `/register`), tienes que crear las filas correspondientes en `usuarios` manualmente. El patrón básico sería:

```sql
INSERT INTO usuarios (id, email, first_name, last_name, password_hash, role, is_active, status, email_verified)
VALUES (
  'ID_DE_SUPABASE_AUTH',
  'correo@example.com',
  'Nombre',
  'Apellido',
  'supabase_managed',   -- valor cualquiera no vacío
  'customer',
  true,
  'active',
  true
);
```

Repite para cada usuario y luego ajusta los `role` y `vendor_id` como en el punto anterior.

---

## 7. Probar la configuración

1. Con `.env.local` configurado y `all.sql` importado, ejecuta:

   ```bash
   npm run dev
   ```

2. Entra a `http://localhost:3000/login`.
3. Inicia sesión con uno de los usuarios:
   - `katemartinez1507@gmail.com` → deberías ver las vistas de admin global.
   - `admin@latido.com` / `manager@latido.com` → vistas de vendor/tienda.
   - `user@latido.com` → vistas de cliente normal.

Si ves errores de "User profile not found" significa que falta la fila correspondiente en `usuarios` (revisa la sección 6.3).

---

## 8. RLS (Row Level Security) opcional

Al final de `database/all.sql` hay una sección que:

- Activa RLS en `usuarios`, `wishlist`, `pedidos`, `cupones_usuarios` y `direcciones`.
- Crea políticas para que cada usuario solo pueda ver/modificar sus propios datos, y para que el rol `service_role` tenga acceso completo.

Actualmente el backend de Next.js se conecta usando credenciales de servicio (similar a `service_role`), por lo que **no se ve bloqueado por RLS**.

Recomendación:

- En desarrollo puedes dejar las políticas tal cual o comentarlas.
- En producción, si empiezas a hacer peticiones directas desde el navegador con `supabase-js`, RLS te ayudará a asegurar que cada usuario solo accede a sus propios datos.

---

## 9. Resumen rápido

1. Crear proyecto en Supabase.
2. Configurar `.env.local` con datos de DB y llaves de API.
3. Ejecutar `database/all.sql` en el SQL Editor.
4. Crear usuarios demo mediante `/register` (recomendado) o insertando filas en `usuarios`.
5. Asignar roles:
   - `katemartinez1507@gmail.com` → admin global.
   - `admin@latido.com` y `manager@latido.com` → vendor/manager de la tienda ejemplo.
   - `user@latido.com` → cliente.
6. Probar login y dashboards desde `npm run dev`.
