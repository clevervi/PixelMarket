import { Request, Response } from 'express';
import { User, CreateUserDTO, UpdateUserDTO, ApiResponse } from '../types';

// Simulamos una base de datos en memoria
let users: User[] = [
  {
    id: 1,
    email: 'user@example.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    password: 'hashed_password',
    role: 'customer',
    createdAt: new Date(),
  },
];

/**
 * GET todos los usuarios
 */
export const getAllUsers = async (
  _req: Request,
  res: Response<ApiResponse<User[]>>
): Promise<void> => {
  try {
    // No incluir passwords en la respuesta
    const usersWithoutPasswords = users.map((u) => ({
      ...u,
      password: undefined,
    }));

    res.json({
      success: true,
      count: users.length,
      data: usersWithoutPasswords,
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
 * GET usuario por ID
 */
export const getUserById = async (
  req: Request,
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = users.find((u) => u.id === parseInt(id));

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
      return;
    }

    // No incluir password
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword as User,
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
 * POST crear nuevo usuario
 */
export const createUser = async (
  req: Request,
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const { name, email, password } = req.body as CreateUserDTO;

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

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      email,
      password,
      name,
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // No incluir password en la respuesta
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: userWithoutPassword as User,
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
 * PUT actualizar usuario
 */
export const updateUser = async (
  req: Request,
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateUserDTO;

    const user = users.find((u) => u.id === parseInt(id));

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
      return;
    }

    // Actualizar solo campos permitidos (no password, no role)
    Object.assign(user, updates, { updatedAt: new Date() });

    // No incluir password en la respuesta
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: userWithoutPassword as User,
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
 * DELETE eliminar usuario
 */
export const deleteUser = async (
  req: Request,
  res: Response<ApiResponse<User>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const index = users.findIndex((u) => u.id === parseInt(id));

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
      return;
    }

    const deletedUser = users.splice(index, 1)[0];

    // No incluir password en la respuesta
    const { password, ...userWithoutPassword } = deletedUser;

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: userWithoutPassword as User,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
