# Manager Dashboard - Estado y Configuración

## 👤 Credenciales del Manager
- **Email**: `manager@latido.com`
- **Password**: `manager123`
- **Rol**: `store_manager`
- **ID**: `2` (en mockdata)

## ✅ Funcionalidades que DEBE tener el Store Manager

### 1. **Dashboard Principal** (`/dashboard`)
- ✅ Ver estadísticas generales
- ✅ Ver Welcome banner con su nombre
- ✅ Botón "Add Product" visible
- ❌ NO debe ver "View Reports" (solo admin)

### 2. **Products** (`/dashboard/products`)
- ✅ Ver SOLO sus propios productos (filtrados por `managerId`)
- ✅ Crear nuevos productos (asignados automáticamente a su ID)
- ✅ Editar SOLO sus propios productos
- ✅ Eliminar SOLO sus propios productos
- ❌ NO puede ver/editar productos de otros managers

### 3. **Orders** (`/dashboard/orders`)
- ✅ Ver todas las órdenes
- ✅ Ver estadísticas de órdenes
- ✅ Botones View y Edit

### 4. **Analytics** (`/dashboard/analytics`)
- ✅ Ver métricas de ventas
- ✅ Ver productos más vendidos
- ✅ Ver rendimiento por categoría

### 5. **Promotions** (`/dashboard/promotions`)
- ✅ Ver promociones
- ✅ Crear nuevas promociones
- ✅ Editar promociones
- ✅ Eliminar promociones

### 6. **Settings** (`/dashboard/settings`)
- ✅ Cambiar información de perfil
- ✅ Cambiar contraseña
- ✅ Logout

## ❌ Páginas que NO debe ver el Manager

- ❌ **Users** - Solo admin
- ❌ **Reviews** - Solo admin
- ❌ **Reports** - Solo admin
- ❌ **My Orders** - Solo customer
- ❌ **Wishlist** - Solo customer

## 🔧 Configuración Actual

### Productos Mock con managerId
```typescript
{ id: 1, name: 'Vueltiao Hat', managerId: '2' }      // Manager puede editar
{ id: 2, name: 'Wayuu Bag', managerId: '2' }         // Manager puede editar
{ id: 3, name: 'Hammock Chair', managerId: undefined } // Solo admin
{ id: 4, name: 'Ceramic Vase', managerId: undefined }  // Solo admin
{ id: 5, name: 'Woven Bracelet', managerId: '2' }    // Manager puede editar
```

## 🐛 Problemas Conocidos y Soluciones

### Problema 1: Manager no ve sus productos
**Causa**: El filtro compara `managerId` (string) con `user.id` (puede ser number)
**Solución**: Convertir ambos a string: `String(user.id)`

### Problema 2: Manager no puede editar productos
**Causa**: La función `handleEdit` no permitía editar
**Solución**: ✅ Ya corregido - Admin puede editar todos, Manager solo los suyos

### Problema 3: Manager no puede eliminar productos
**Causa**: La condición del botón Delete estaba mal
**Solución**: ✅ Ya corregido - Condición: `user.role === 'admin' || (user.role === 'store_manager' && product.managerId === String(user.id))`

### Problema 4: DashboardHeader muestra "Admin User"
**Causa**: Usaba `useUserStore` en lugar de `getCurrentUser()`
**Solución**: ✅ Ya corregido - Ahora usa `getCurrentUser()` y muestra el nombre y rol correctos

### Problema 5: Logout no funciona
**Causa**: El botón no tenía función onClick
**Solución**: ✅ Ya corregido - Ahora llama a `logout()` y redirige a `/login`

## 📝 Checklist de Verificación

Para verificar que todo funciona correctamente como Manager:

1. [ ] Login con `manager@latido.com` / `manager123`
2. [ ] Verificar que el header muestra "Store Manager" como rol
3. [ ] Verificar que el sidebar muestra solo las opciones permitidas
4. [ ] Ir a Products y verificar que solo ve 3 productos (los que tienen managerId: '2')
5. [ ] Intentar editar un producto propio - debe abrir el modal
6. [ ] Intentar eliminar un producto propio - debe pedir confirmación
7. [ ] Crear un nuevo producto - debe asignarse automáticamente al manager
8. [ ] Ir a Orders - debe ver todas las órdenes
9. [ ] Ir a Analytics - debe ver las estadísticas
10. [ ] Ir a Promotions - debe poder crear/editar/eliminar
11. [ ] Ir a Settings - debe poder cambiar su información
12. [ ] Hacer logout - debe cerrar sesión y redirigir a login

## 🚀 Estado Actual

- ✅ Sidebar con filtrado por rol
- ✅ DashboardHeader con usuario correcto
- ✅ Products con filtrado y permisos
- ✅ Modal de edición/creación funcional
- ✅ Logout funcional
- ✅ Todas las páginas creadas
- ✅ Protección de rutas por rol

## 📌 Notas Importantes

1. El `managerId` en los productos debe ser STRING, no number
2. Siempre usar `String(user.id)` para comparaciones
3. El manager con ID '2' tiene 3 productos asignados en mockdata
4. Los productos sin `managerId` solo pueden ser editados por admin
