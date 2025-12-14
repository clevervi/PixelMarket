import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} from '../controllers/orderController';

const router = Router();

/**
 * GET /api/orders - Obtener todas las órdenes
 */
router.get('/', getAllOrders);

/**
 * GET /api/orders/stats - Obtener estadísticas de órdenes
 */
router.get('/stats', getOrderStats);

/**
 * GET /api/orders/:id - Obtener orden por ID
 */
router.get('/:id', getOrderById);

/**
 * GET /api/orders/user/:userId - Obtener órdenes de un usuario
 */
router.get('/user/:userId', getOrdersByUser);

/**
 * POST /api/orders - Crear nueva orden
 */
router.post('/', createOrder);

/**
 * PUT /api/orders/:id/status - Actualizar estado de la orden
 */
router.put('/:id/status', updateOrderStatus);

/**
 * DELETE /api/orders/:id/cancel - Cancelar orden
 */
router.delete('/:id/cancel', cancelOrder);

export default router;
