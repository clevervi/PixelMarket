# Despliegue en Vercel (Next.js)
Esta guía te lleva de **proyecto local → GitHub → Vercel** para desplegar el **frontend/servidor Next.js** que vive en la raíz del repo.

> Nota: este repositorio también tiene una carpeta `backend/` (Express). Vercel está pensado para desplegar el **Next.js de la raíz**. Si necesitas ese backend Express en producción, lo más común es desplegarlo como **otro servicio** (Render/Railway/Fly/VM) o migrar endpoints a **API Routes** de Next.

## 0) Requisitos
- Cuenta en **Vercel**.
- Un repo en **GitHub/GitLab/Bitbucket**.
- Node.js (local) para probar: recomendado **18+**.

## 1) Preparar el repo (MUY IMPORTANTE)
Antes de subir a Vercel, asegúrate de **no versionar** carpetas de build ni dependencias.

### 1.1 Verifica que `.gitignore` ignore builds y dependencias
Debes ignorar al menos:
- `node_modules/`
- `.next/`
- `.env.local`

(En este proyecto ya existe `.gitignore`, pero igual conviene revisarlo.)

### 1.2 Si `node_modules/` o `.next/` ya quedaron trackeados por Git
Aunque estén en `.gitignore`, si alguna vez se subieron al repo, Git los seguirá rastreando.

Ejecuta (en la raíz del proyecto):
```bash
# Quita del tracking (no borra tus archivos locales)
git rm -r --cached node_modules .next

# Recomendado: si existe build del backend (si no aplica, omite)
git rm -r --cached backend/dist

git add .
git commit -m "chore: remove build artifacts and dependencies from repo"
```

Luego confirma que ya no aparecen cambios masivos:
```bash
git status
```

## 2) Variables de entorno (para que funcione en Vercel)
En producción **no se sube** `.env.local`. En Vercel debes configurar las variables en el panel.

### 2.1 Variables mínimas
En **Vercel → Project → Settings → Environment Variables**, crea (según tu configuración):

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_POOL_MAX` (opcional)

- `AUTH_SECRET`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server-side; mantener secreta)

Recomendaciones:
- No configures `NODE_ENV` manualmente (Vercel lo gestiona).
- Agrega estas variables al menos para **Production** (y también para **Preview** si usarás previews).

### 2.2 Consejo para Postgres/Supabase en serverless
Si usas `pg` desde Vercel (serverless), es común tener problemas por **muchas conexiones**.
- En Supabase, considera usar el **Connection Pooler** (si tu plan lo permite) y ajustar `DB_POOL_MAX`.

## 3) Subir el proyecto a GitHub (u otro proveedor Git)
Si aún no está en un repo remoto:
```bash
git init
git add .
git commit -m "Initial commit"

# crea el repo en GitHub y agrega el remote
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

git push -u origin main
```

Si ya existe remoto, solo haz push de tu rama:
```bash
git push
```

## 4) Crear el proyecto en Vercel
1. Entra a Vercel y elige **Add New → Project**.
2. Importa el repo desde Git.
3. Vercel debería detectar **Next.js** automáticamente.

### 4.1 Configuración recomendada (Build Settings)
Normalmente Vercel configura esto solo:
- Framework Preset: **Next.js**
- Root Directory: `./`
- Install Command: `npm install` (o `npm ci` si prefieres reproducibilidad)
- Build Command: `npm run build`
- Output Directory: (déjalo vacío; para Next no se configura manualmente)

### 4.2 Node.js Version
Si el build falla por versión de Node, ve a:
**Project → Settings → General → Node.js Version**
y selecciona una versión compatible (por ejemplo 18 o 20).

## 5) Desplegar
1. Configura las **Environment Variables** (paso 2).
2. Click en **Deploy**.
3. Abre la URL que te da Vercel.

## 6) Verificación rápida después del deploy
- Prueba el home y navegación.
- Prueba login/registro (si aplica) y endpoints de `src/app/api/**`.
- Revisa logs en **Vercel → Deployments → (tu deploy) → Functions/Logs**.

## 7) Troubleshooting (los 3 errores más comunes)
### 7.1 Fallas de build por archivos enormes o basura en el repo
Solución: confirma que `node_modules/` y `.next/` NO estén trackeados (paso 1.2).

### 7.2 Errores de conexión a Postgres/Supabase en producción
- Verifica que `DB_HOST/DB_USER/DB_PASSWORD/DB_NAME` sean los de producción.
- Considera usar el **pooler** de Supabase y reducir conexiones.

### 7.3 Variables públicas vs privadas
- `NEXT_PUBLIC_*` se expone al navegador.
- `SUPABASE_SERVICE_ROLE_KEY` NO debe ser `NEXT_PUBLIC_...`.

## 8) (Opcional) Deploy con Vercel CLI
Si prefieres deploy desde terminal:
```bash
npm i -g vercel
vercel login
vercel
```
Luego, para producción:
```bash
vercel --prod
```
