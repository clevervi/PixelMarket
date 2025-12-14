import { Router } from 'express';
import {
  getRecommendedProducts,
  getPersonalizedRecommendations,
  getRelatedProducts,
  getTrendingProducts,
  addRecommendedProduct,
} from '../controllers/recommendedController';

const router = Router();

/**
 * GET /api/recommended - Obtener productos recomendados
 * Query: category, limit
 */
router.get('/', getRecommendedProducts);

/**
 * GET /api/recommended/trending - Obtener productos en tendencia
 * Query: limit
 */
router.get('/trending', getTrendingProducts);

/**
 * GET /api/recommended/personalized - Obtener recomendaciones personalizadas
 * Query: userId, limit
 */
router.get('/personalized', getPersonalizedRecommendations);

/**
 * GET /api/recommended/related - Obtener productos relacionados
 * Query: productId, limit
 */
router.get('/related', getRelatedProducts);

/**
 * POST /api/recommended - Agregar producto a recomendados
 */
router.post('/', addRecommendedProduct);

export default router;
