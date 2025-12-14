# Backend API - Tienda Virtual

Backend API completo para la Tienda Virtual, construido con Express.js y Node.js.

## 📦 Estructura del Proyecto

```
backend/
├── src/
│   ├── index.js                 # Punto de entrada principal
│   ├── config/
│   │   └── config.js           # Configuración de variables de entorno
│   ├── routes/
│   │   ├── products.js         # Rutas de productos
│   │   ├── wishlist.js         # Rutas de favoritos
│   │   ├── recommended.js      # Rutas de productos recomendados
│   │   ├── users.js            # Rutas de usuarios
│   │   ├── auth.js             # Rutas de autenticación
│   │   └── orders.js           # Rutas de órdenes
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── wishlistController.js
│   │   ├── recommendedController.js
│   │   ├── userController.js
│   │   ├── authController.js
│   │   └── orderController.js
│   ├── middleware/             # Middleware (autenticación, etc)
│   └── utils/                  # Utilidades
├── package.json
└── .env.example
```

## 🚀 Inicio Rápido

### Instalación

1. Navega a la carpeta backend:
```bash
cd backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Inicia el servidor:
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:4000`

## 📚 Endpoints Disponibles

### Productos
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Favoritos (Wishlist)
- `GET /api/wishlist/:userId` - Obtener lista de favoritos
- `POST /api/wishlist/:userId/add` - Agregar a favoritos
- `DELETE /api/wishlist/:userId/:productId` - Eliminar de favoritos
- `GET /api/wishlist/:userId/:productId/check` - Verificar si está en favoritos

### Productos Recomendados
- `GET /api/recommended` - Obtener productos recomendados generales
- `GET /api/recommended/product/:productId` - Obtener recomendados para un producto
- `GET /api/recommended/user/:userId` - Obtener recomendados para un usuario

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refrescar token

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Órdenes
- `GET /api/orders/user/:userId` - Obtener órdenes de un usuario
- `GET /api/orders/:id` - Obtener orden por ID
- `POST /api/orders` - Crear nueva orden
- `PUT /api/orders/:id/status` - Actualizar estado de orden
- `DELETE /api/orders/:id` - Cancelar orden

## 🔌 Integración con Frontend

Para conectar el frontend con este backend, modifica las URLs en tu frontend:

```javascript
// Ejemplo en React/Next.js
const API_BASE_URL = 'http://localhost:4000/api';

// Obtener productos
const response = await fetch(`${API_BASE_URL}/products`);

// Agregar a favoritos
const response = await fetch(`${API_BASE_URL}/wishlist/userId/add`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: 1 })
});
```

## 🛠️ Próximas Mejoras

- [ ] Integrar base de datos MySQL real
- [ ] Implementar autenticación JWT
- [ ] Agregar validaciones robustas
- [ ] Implementar paginación
- [ ] Agregar filtros avanzados
- [ ] Implementar sistema de reviews
- [ ] Agregar manejo de pagos
- [ ] Agregar sistema de logs
- [ ] Tests unitarios

## 📝 Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta backend:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mysql://usuario:contraseña@localhost:3306/tienda_virtual
JWT_SECRET=tu_secret_key_aqui
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 🤝 Contribuciones

Para hacer cambios en el backend:

1. Crea una nueva rama
2. Realiza tus cambios
3. Prueba los endpoints
4. Haz un commit con descripción clara

## 📧 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.
