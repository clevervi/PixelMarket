import { Request, Response } from 'express';
import { WishlistItem, AddToWishlistDTO, ApiResponse } from '../types';

// Simulamos una base de datos en memoria
let wishlist: WishlistItem[] = [];

/**
 * GET todos los favoritos del usuario
 */
export const getWishlist = async (
  req: Request,
  res: Response<ApiResponse<WishlistItem[]>>
): Promise<void> => {
  try {
    const { userId } = req.query as { userId: string };

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
      return;
    }

    const userWishlist = wishlist.filter((item) => item.userId === userId);

    res.json({
      success: true,
      count: userWishlist.length,
      data: userWishlist,
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
 * POST añadir producto a favoritos
 */
export const addToWishlist = async (
  req: Request,
  res: Response<ApiResponse<WishlistItem>>
): Promise<void> => {
  try {
    const { userId } = req.query as { userId: string };
    const { productId } = req.body as AddToWishlistDTO;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
      return;
    }

    if (!productId) {
      res.status(400).json({
        success: false,
        error: 'productId es requerido',
      });
      return;
    }

    // Verificar si el producto ya está en favoritos
    const existingItem = wishlist.find(
      (item) => item.userId === userId && item.productId === productId
    );

    if (existingItem) {
      res.status(400).json({
        success: false,
        error: 'El producto ya está en tus favoritos',
      });
      return;
    }

    const newWishlistItem: WishlistItem = {
      productId,
      userId,
      addedAt: new Date(),
    };

    wishlist.push(newWishlistItem);

    res.status(201).json({
      success: true,
      message: 'Producto añadido a favoritos',
      data: newWishlistItem,
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
 * DELETE eliminar producto de favoritos
 */
export const removeFromWishlist = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { userId } = req.query as { userId: string };
    const { productId } = req.body as AddToWishlistDTO;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
      return;
    }

    if (!productId) {
      res.status(400).json({
        success: false,
        error: 'productId es requerido',
      });
      return;
    }

    const index = wishlist.findIndex(
      (item) => item.userId === userId && item.productId === productId
    );

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: 'El producto no está en tus favoritos',
      });
      return;
    }

    wishlist.splice(index, 1);

    res.json({
      success: true,
      message: 'Producto eliminado de favoritos',
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
 * GET verificar si un producto está en favoritos
 */
export const isInWishlist = async (
  req: Request,
  res: Response<ApiResponse<{ inWishlist: boolean }>>
): Promise<void> => {
  try {
    const { userId, productId } = req.query as { userId: string; productId: string };

    if (!userId || !productId) {
      res.status(400).json({
        success: false,
        error: 'userId y productId son requeridos',
      });
      return;
    }

    const isInList = wishlist.some(
      (item) => item.userId === userId && item.productId === parseInt(productId)
    );

    res.json({
      success: true,
      data: { inWishlist: isInList },
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
 * DELETE limpiar todos los favoritos del usuario
 */
export const clearWishlist = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { userId } = req.query as { userId: string };

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
      return;
    }

    wishlist = wishlist.filter((item) => item.userId !== userId);

    res.json({
      success: true,
      message: 'Favoritos limpiados',
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
