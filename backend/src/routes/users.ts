import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

/**
 * GET /api/users - Obtener todos los usuarios
 */
router.get('/', getAllUsers);

/**
 * GET /api/users/:id - Obtener usuario por ID
 */
router.get('/:id', getUserById);

/**
 * POST /api/users - Crear nuevo usuario
 */
router.post('/', createUser);

/**
 * PUT /api/users/:id - Actualizar usuario
 */
router.put('/:id', updateUser);

/**
 * DELETE /api/users/:id - Eliminar usuario
 */
router.delete('/:id', deleteUser);

export default router;
