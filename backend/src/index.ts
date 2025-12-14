import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import productsRouter from './routes/products';
import wishlistRouter from './routes/wishlist';
import recommendedRouter from './routes/recommended';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import ordersRouter from './routes/orders';

// Tipos
import { ApiResponse } from './types';

const app: Express = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS
// ============================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    status: 'OK',
    message: 'Backend funcionando correctamente',
  };
  res.json(response);
});

// Ruta raíz
app.get('/', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    message: 'Bienvenido a la API de Tienda Virtual',
  };
  res.json(response);
});

// Rutas de API
app.use('/api/products', productsRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/recommended', recommendedRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

// ============================================
// MANEJO DE ERRORES
// ============================================

// 404 - No encontrado
app.use((_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: 'Ruta no encontrada',
  };
  res.status(404).json(response);
});

// Error handler middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  const response: ApiResponse = {
    success: false,
    error: err.message || 'Error interno del servidor',
  };

  res.status(500).json(response);
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en puerto ${PORT}`);
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔌 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

export default app;
