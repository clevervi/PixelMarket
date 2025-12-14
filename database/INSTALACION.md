# 🚀 Guía de Instalación - Base de Datos PostgreSQL

Esta guía te ayudará a configurar PostgreSQL y crear la base de datos para el proyecto Latido Ancestral.

## 📋 Requisitos Previos

- PostgreSQL 14 o superior
- Acceso de administrador a PostgreSQL
- Cliente psql o pgAdmin instalado

---

## 🔧 Instalación de PostgreSQL en Windows

### Opción 1: Instalador oficial

1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación:
   - Anota el **puerto** (por defecto: 5432)
   - Establece una **contraseña** para el usuario `postgres`
   - Instala **pgAdmin 4** (herramienta de administración gráfica)
   - Instala **Command Line Tools**

### Opción 2: Scoop (gestores de paquetes)

```powershell
# Si tienes Scoop instalado
scoop install postgresql

# O con Chocolatey
choco install postgresql
```

---

## 📦 Verificar la Instalación

Abre PowerShell o CMD y verifica que PostgreSQL está instalado:

```powershell
# Verificar versión
psql --version

# Debería mostrar algo como: psql (PostgreSQL) 14.x
```

---

## 🗄️ Crear la Base de Datos

### Paso 1: Conectarse a PostgreSQL

**Opción A: Usando psql (línea de comandos)**

```powershell
# Conectarse como usuario postgres
psql -U postgres

# Te pedirá la contraseña que estableciste durante la instalación
```

**Opción B: Usando pgAdmin 4**

1. Abre pgAdmin 4
2. Conecta al servidor local (localhost)
3. Ingresa la contraseña del usuario postgres

---

### Paso 2: Crear la Base de Datos

```sql
-- Crear la base de datos
CREATE DATABASE latido_ancestral
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Colombia.1252'
    LC_CTYPE = 'Spanish_Colombia.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectarse a la nueva base de datos
\c latido_ancestral
```

---

### Paso 3: Ejecutar el Schema

**Opción A: Desde psql**

```powershell
# Desde PowerShell (fuera de psql)
cd C:\Users\Slivochka\Documents\Dev_Projects\Tienda_Virtual

# Ejecutar el schema
psql -U postgres -d latido_ancestral -f database/schema.sql
```

**Opción B: Desde pgAdmin 4**

1. Selecciona la base de datos `latido_ancestral`
2. Clic derecho → "Query Tool"
3. Abre el archivo `database/schema.sql`
4. Ejecuta el script (F5)

---

### Paso 4: Cargar Datos de Prueba (Opcional)

```powershell
# Cargar datos de ejemplo
psql -U postgres -d latido_ancestral -f database/seed.sql
```

---

## 🔐 Crear Usuario de Aplicación

Por seguridad, es recomendable crear un usuario específico para la aplicación:

```sql
-- Conectarse como postgres
\c latido_ancestral

-- Crear usuario de aplicación
CREATE USER latido_app WITH PASSWORD 'tu_contraseña_segura_aqui';

-- Otorgar permisos
GRANT CONNECT ON DATABASE latido_ancestral TO latido_app;
GRANT USAGE ON SCHEMA public TO latido_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO latido_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO latido_app;

-- Permisos para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON TABLES TO latido_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON SEQUENCES TO latido_app;
```

---

## 🌐 Configurar Conexión desde Node.js

### Instalar el cliente de PostgreSQL

```powershell
# En el directorio del proyecto
npm install pg
# O si usas TypeScript
npm install pg @types/pg
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=latido_ancestral
DB_USER=latido_app
DB_PASSWORD=tu_contraseña_segura_aqui

# Pool Configuration
DB_POOL_MIN=2
DB_POOL_MAX=10

# Node Environment
NODE_ENV=development
```

### Ejemplo de Conexión

Crea un archivo `database/connection.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'latido_ancestral',
  user: process.env.DB_USER || 'latido_app',
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Probar conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en PostgreSQL:', err);
  process.exit(-1);
});

export default pool;
```

### Ejemplo de Consulta

```typescript
import pool from './database/connection';

// Ejemplo: Obtener todos los productos
async function getProducts() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.stock,
        c.name as category_name
      FROM productos p
      LEFT JOIN categorias c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 10
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

// Ejemplo con parámetros (previene SQL Injection)
async function getProductById(id: string) {
  try {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
}
```

---

## 🧪 Verificar la Instalación

### Desde psql

```sql
-- Conectarse a la base de datos
\c latido_ancestral

-- Listar todas las tablas
\dt

-- Ver estructura de una tabla
\d usuarios

-- Contar registros en cada tabla
SELECT 
  schemaname,
  tablename,
  n_tup_ins - n_tup_del as row_count
FROM pg_stat_user_tables
ORDER BY tablename;

-- O más simple (después de cargar seed.sql):
SELECT COUNT(*) as total_productos FROM productos;
SELECT COUNT(*) as total_categorias FROM categorias;
SELECT COUNT(*) as total_usuarios FROM usuarios;
```

---

## 🔒 Configuración de Seguridad

### 1. Configurar pg_hba.conf

Ubicación típica en Windows: `C:\Program Files\PostgreSQL\14\data\pg_hba.conf`

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Conexiones locales
local   all             postgres                                scram-sha-256
local   all             latido_app                              scram-sha-256

# Conexiones TCP/IP locales
host    latido_ancestral latido_app     127.0.0.1/32            scram-sha-256
host    latido_ancestral latido_app     ::1/128                 scram-sha-256

# NO permitir conexiones remotas en desarrollo
```

### 2. Reiniciar PostgreSQL

```powershell
# Desde PowerShell como administrador
Restart-Service postgresql-x64-14
# Cambia "14" por tu versión instalada
```

---

## 📊 Herramientas Recomendadas

### pgAdmin 4 (Incluido con PostgreSQL)
- Interfaz gráfica completa
- Explorador de datos
- Editor de consultas
- Generador de diagramas ER

### DBeaver (Alternativa gratuita)
- Descarga: https://dbeaver.io/
- Soporte multi-base de datos
- Generación de diagramas ER
- Exportación de datos

### VS Code Extensions
- **PostgreSQL** por Chris Kolkman
- **SQLTools** - Database tools

---

## 🛠️ Comandos Útiles de PostgreSQL

```sql
-- Ver bases de datos
\l

-- Cambiar de base de datos
\c nombre_base_datos

-- Listar tablas
\dt

-- Describir tabla
\d nombre_tabla

-- Listar usuarios
\du

-- Ver tamaño de la base de datos
SELECT pg_size_pretty(pg_database_size('latido_ancestral'));

-- Ver tamaño de tablas
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Salir de psql
\q
```

---

## 🔄 Backup y Restauración

### Crear Backup

```powershell
# Backup completo (formato custom)
pg_dump -U postgres -d latido_ancestral -F c -f backup_latido_$(Get-Date -Format 'yyyyMMdd').dump

# Backup en SQL plano
pg_dump -U postgres -d latido_ancestral -f backup_latido_$(Get-Date -Format 'yyyyMMdd').sql

# Solo esquema (sin datos)
pg_dump -U postgres -d latido_ancestral --schema-only -f schema_only.sql

# Solo datos (sin esquema)
pg_dump -U postgres -d latido_ancestral --data-only -f data_only.sql
```

### Restaurar Backup

```powershell
# Restaurar desde formato custom
pg_restore -U postgres -d latido_ancestral -c backup_latido_20250109.dump

# Restaurar desde SQL
psql -U postgres -d latido_ancestral -f backup_latido_20250109.sql
```

---

## ❗ Solución de Problemas Comunes

### Error: "psql no se reconoce como comando"

**Solución:** Agregar PostgreSQL al PATH de Windows

1. Busca la ruta de instalación: `C:\Program Files\PostgreSQL\14\bin`
2. Agrega al PATH:
   - Panel de Control → Sistema → Configuración avanzada del sistema
   - Variables de entorno → Path → Editar
   - Agregar nueva ruta: `C:\Program Files\PostgreSQL\14\bin`

### Error: "password authentication failed"

**Solución:** Verificar contraseña o resetearla

```powershell
# Conectarse como administrador de Windows
psql -U postgres

# Cambiar contraseña
ALTER USER postgres PASSWORD 'nueva_contraseña';
```

### Error: "could not connect to server"

**Solución:** Verificar que el servicio esté corriendo

```powershell
# Ver servicios de PostgreSQL
Get-Service -Name postgresql*

# Iniciar servicio
Start-Service postgresql-x64-14
```

### Error al ejecutar schema.sql

**Solución:** Asegúrate de estar en la base de datos correcta

```sql
-- Primero conectarse a la base de datos
\c latido_ancestral

-- Luego ejecutar el schema
\i database/schema.sql
```

---

## 📚 Recursos Adicionales

- **Documentación oficial:** https://www.postgresql.org/docs/
- **Tutorial interactivo:** https://www.postgresqltutorial.com/
- **SQL cheatsheet:** https://www.postgresql.org/docs/current/sql-commands.html
- **Performance tuning:** https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server

---

## 🎯 Próximos Pasos

Una vez completada la instalación:

1. ✅ Verificar que todas las tablas fueron creadas
2. ✅ Cargar datos de prueba con `seed.sql`
3. ✅ Configurar las variables de entorno en tu aplicación
4. ✅ Implementar las consultas SQL en tu backend
5. ✅ Configurar backups automáticos

---

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisa los logs de PostgreSQL en: `C:\Program Files\PostgreSQL\14\data\log\`
2. Consulta la documentación oficial
3. Verifica que todos los requisitos estén cumplidos

---

**¡Base de datos lista para usar! 🎉**
