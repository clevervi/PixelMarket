import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = Router();

/**
 * GET /api/products - Obtener todos los productos
 */
router.get('/', getAllProducts);

/**
 * GET /api/products/:id - Obtener producto por ID
 */
router.get('/:id', getProductById);

/**
 * POST /api/products - Crear nuevo producto
 */
router.post('/', createProduct);

/**
 * PUT /api/products/:id - Actualizar producto
 */
router.put('/:id', updateProduct);

/**
 * DELETE /api/products/:id - Eliminar producto
 */
router.delete('/:id', deleteProduct);

export default router;
