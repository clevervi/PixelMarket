import { Router } from 'express';
import { register, login, logout, verifyToken } from '../controllers/authController';

const router = Router();

/**
 * POST /api/auth/register - Registrar nuevo usuario
 */
router.post('/register', register);

/**
 * POST /api/auth/login - Login de usuario
 */
router.post('/login', login);

/**
 * POST /api/auth/logout - Logout de usuario
 */
router.post('/logout', logout);

/**
 * GET /api/auth/verify - Verificar token y obtener usuario
 */
router.get('/verify', verifyToken);

export default router;
