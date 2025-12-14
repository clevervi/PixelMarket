# Cambios Realizados en el Backend

## Resumen
El backend ha sido actualizado para alinearse correctamente con el esquema de la base de datos definido en `database/supabase.sql`.

## Cambios Principales

### 1. Tipos Actualizados (`src/types/index.ts`)

#### Cambios de IDs
- **Antes**: IDs eran `number`
- **Ahora**: IDs son `string` (UUIDs) para coincidir con PostgreSQL/Supabase

#### Enums Actualizados
```typescript
// Roles de usuario actualizados
UserRole = 'customer' | 'admin' | 'vendor' | 'moderator' | 'provider'

// Estados de pedidos completos
OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

// Métodos de pago actualizados
PaymentMethod = 'card' | 'paypal' | 'transfer' | 'cash_on_delivery' | 'cryptocurrency'
```

#### Nuevas Interfaces
- `Usuario` - Reemplaza `User`, con campos alineados a `public.usuarios`
- `Producto` - Reemplaza `Product`, con campos alineados a `public.productos`
- `Pedido` - Reemplaza `Order`, con campos alineados a `public.pedidos`
- `Direccion` - Nueva interfaz para direcciones
- `Categoria` - Nueva interfaz para categorías
- `Vendor` - Nueva interfaz para vendedores
- `Cupon` - Nueva interfaz para cupones
- `Reseña` - Nueva interfaz para reseñas
- `Notificacion` - Nueva interfaz para notificaciones
- `Pago` - Nueva interfaz para pagos
- `Variante` - Nueva interfaz para variantes de productos
- `ImagenProducto` - Nueva interfaz para imágenes de productos
- `DetallePedido` - Nueva interfaz para detalles de pedidos

### 2. Cliente Supabase (`src/config/supabase.ts`)

Nuevo archivo que configura el cliente de Supabase para conectarse a la base de datos:

```typescript
import { createClient } from '@supabase/supabase-js';
import config from './config';

const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

export default supabase;
```

### 3. Configuración Actualizada (`src/config/config.ts`)

Se agregaron las siguientes variables de entorno:
- `SUPABASE_URL` - URL del proyecto de Supabase
- `SUPABASE_ANON_KEY` - Clave anónima de Supabase

### 4. Variables de Entorno (`.env.example`)

Agregadas nuevas variables requeridas:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Dependencias (`package.json`)

Se agregó la dependencia de Supabase:
```json
"@supabase/supabase-js": "^2.39.0"
```

## Próximos Pasos Recomendados

### Controladores a Actualizar

Los siguientes controladores necesitan ser actualizados para usar el cliente de Supabase y los nuevos tipos:

1. **authController.ts**
   - Usar tabla `public.usuarios`
   - Implementar autenticación con Supabase Auth
   - Manejar registro, login, logout

2. **productController.ts**
   - Consultar tabla `public.productos`
   - Incluir joins con `categorias`, `imagenes_producto`, `variantes`
   - Implementar filtros por `status`, `is_active`, `vendor_id`

3. **orderController.ts**
   - Consultar tabla `public.pedidos`
   - Incluir relaciones con `detalle_pedido`, `pagos`, `envios`
   - Manejar transacciones para crear pedidos completos

4. **userController.ts**
   - CRUD completo para `public.usuarios`
   - Incluir relaciones con `direcciones`, `metodos_pago`

5. **wishlistController.ts**
   - Consultar tabla `public.wishlist`
   - Relacionar con `usuarios` y `productos`

6. **recommendedController.ts**
   - Implementar lógica de recomendaciones
   - Basado en `sales_count`, `rating_average`, categorías

### Ejemplo de Uso del Cliente Supabase

```typescript
import supabase from '../config/supabase';

// Obtener productos
const { data, error } = await supabase
  .from('productos')
  .select('*, categorias(*), imagenes_producto(*)')
  .eq('is_active', true)
  .order('created_at', { ascending: false });

// Crear usuario
const { data: usuario, error } = await supabase
  .from('usuarios')
  .insert({
    email: 'user@example.com',
    password_hash: hashedPassword,
    role: 'customer',
    is_active: true,
    status: 'active'
  })
  .select()
  .single();

// Actualizar producto
const { data, error } = await supabase
  .from('productos')
  .update({ stock: newStock })
  .eq('id', productId)
  .select();
```

## Instalación

Para instalar las nuevas dependencias:

```bash
cd backend
npm install
```

## Configuración

1. Copia `.env.example` a `.env`
2. Actualiza las variables de Supabase con tus credenciales reales
3. Asegúrate de que el esquema de la base de datos esté aplicado (`database/supabase.sql`)

## Notas Importantes

- **UUIDs**: Todos los IDs ahora son strings (UUIDs), no números
- **Tablas en español**: Las tablas usan nombres en español (`usuarios`, `productos`, `pedidos`)
- **Campos en snake_case**: Los campos de la BD usan snake_case (`first_name`, `created_at`)
- **Supabase Auth**: Considera usar Supabase Auth para autenticación integrada
- **RLS (Row Level Security)**: Asegúrate de configurar políticas RLS en Supabase para seguridad

## Esquema de Base de Datos

El esquema completo está en `database/supabase.sql` e incluye:

- **auth**: Esquema de autenticación de Supabase
- **storage**: Esquema de almacenamiento de archivos
- **vault**: Esquema de secretos
- **public**: Esquema principal con todas las tablas del negocio
  - usuarios, roles, permisos
  - productos, categorías, variantes, imágenes
  - vendors y aplicaciones de vendors
  - pedidos, pagos, envíos
  - cupones, wishlist, reseñas
  - notificaciones, logs, analytics

## Soporte

Para más información sobre Supabase y su uso:
- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [TypeScript con Supabase](https://supabase.com/docs/guides/api/generating-types)
