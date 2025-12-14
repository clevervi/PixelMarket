import { Request, Response } from 'express';
import { User, LoginDTO, RegisterDTO, ApiResponse, AuthResponse } from '../types';

// Simulamos una base de datos en memoria
let users: User[] = [
  {
    id: 1,
    email: 'admin@tienda.com',
    password: 'hashed_password_123', // En producción usar bcrypt
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date(),
  },
];

/**
 * POST - Registrar usuario
 */
export const register = async (
  req: Request,
  res: Response<ApiResponse<AuthResponse>>
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body as RegisterDTO;

    // Validar campos requeridos
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos',
      });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'El email ya está registrado',
      });
      return;
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      email,
      password, // En producción: bcrypt.hash(password, 10)
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'customer',
      createdAt: new Date(),
    };

    users.push(newUser);

    // Simular generación de token JWT
    const token = `jwt_token_${newUser.id}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      data: {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      } as AuthResponse,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST - Login de usuario
 */
export const login = async (
  req: Request,
  res: Response<ApiResponse<AuthResponse>>
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginDTO;

    // Validar campos requeridos
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos',
      });
      return;
    }

    // Buscar usuario
    const user = users.find((u) => u.email === email);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
      return;
    }

    // Verificar contraseña (en producción usar bcrypt.compare)
    if (user.password !== password) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      });
      return;
    }

    // Simular generación de token JWT
    const token = `jwt_token_${user.id}_${Date.now()}`;

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      } as AuthResponse,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET - Verificar token (verificar autenticación)
 */
export const verifyToken = async (
  req: Request,
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      });
      return;
    }

    // Extraer ID del token simulado
    const userId = parseInt(token.split('_')[2]);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST - Logout
 */
export const logout = async (
  _req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    res.json({
      success: true,
      message: 'Logout exitoso',
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
