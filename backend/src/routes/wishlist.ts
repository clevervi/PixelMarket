import { Router } from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  clearWishlist,
} from '../controllers/wishlistController';

const router = Router();

/**
 * GET /api/wishlist - Obtener favoritos del usuario
 * Query: userId
 */
router.get('/', getWishlist);

/**
 * GET /api/wishlist/check - Verificar si un producto está en favoritos
 * Query: userId, productId
 */
router.get('/check', isInWishlist);

/**
 * POST /api/wishlist - Agregar producto a favoritos
 * Query: userId
 * Body: { productId }
 */
router.post('/', addToWishlist);

/**
 * DELETE /api/wishlist - Eliminar producto de favoritos
 * Query: userId
 * Body: { productId }
 */
router.delete('/', removeFromWishlist);

/**
 * DELETE /api/wishlist/clear - Limpiar todos los favoritos
 * Query: userId
 */
router.delete('/clear', clearWishlist);

export default router;
