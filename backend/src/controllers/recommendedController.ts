import { Request, Response } from 'express';
import { RecommendedProduct, ApiResponse } from '../types';

// Base de datos simulada de productos recomendados
const recommendedProducts: RecommendedProduct[] = [
  {
    id: 1,
    name: 'Producto Destacado 1',
    category: 'artesanias',
    rating: 4.5,
    price: 49.99,
  },
  {
    id: 2,
    name: 'Producto Destacado 2',
    category: 'ancestral',
    rating: 4.8,
    price: 59.99,
  },
  {
    id: 3,
    name: 'Producto Destacado 3',
    category: 'inspiration',
    rating: 4.3,
    price: 39.99,
  },
  {
    id: 4,
    name: 'Producto Destacado 4',
    category: 'essence',
    rating: 4.9,
    price: 69.99,
  },
];

/**
 * GET productos recomendados
 * Puede filtrar por categoría u obtener un número limitado
 */
export const getRecommendedProducts = async (
  req: Request,
  res: Response<ApiResponse<RecommendedProduct[]>>
): Promise<void> => {
  try {
    const { category, limit = '4' } = req.query;
    let filtered = [...recommendedProducts];

    // Filtrar por categoría si se proporciona
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Limitar resultados
    const limitNumber = parseInt(limit as string);
    const result = filtered.slice(0, limitNumber);

    res.json({
      success: true,
      count: result.length,
      data: result,
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
 * GET productos recomendados para un usuario específico
 * Basado en su historial o preferencias
 */
export const getPersonalizedRecommendations = async (
  req: Request,
  res: Response<ApiResponse<RecommendedProduct[]>>
): Promise<void> => {
  try {
    const { userId, limit = '6' } = req.query;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
      return;
    }

    // Simular recomendaciones basadas en userId (en producción: usar ML/historial)
    const limitNumber = parseInt(limit as string);
    const recommendations = recommendedProducts.slice(0, limitNumber);

    res.json({
      success: true,
      count: recommendations.length,
      message: `Recomendaciones personalizadas para usuario ${userId}`,
      data: recommendations,
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
 * GET productos relacionados a un producto específico
 */
export const getRelatedProducts = async (
  req: Request,
  res: Response<ApiResponse<RecommendedProduct[]>>
): Promise<void> => {
  try {
    const { productId, limit = '3' } = req.query;

    if (!productId) {
      res.status(400).json({
        success: false,
        error: 'productId es requerido',
      });
      return;
    }

    // Simular búsqueda de productos relacionados
    const limitNumber = parseInt(limit as string);
    const related = recommendedProducts
      .filter((p) => p.id !== parseInt(productId as string))
      .slice(0, limitNumber);

    res.json({
      success: true,
      count: related.length,
      message: `Productos relacionados a ${productId}`,
      data: related,
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
 * GET productos por tendencia (trending)
 */
export const getTrendingProducts = async (
  req: Request,
  res: Response<ApiResponse<RecommendedProduct[]>>
): Promise<void> => {
  try {
    const { limit = '5' } = req.query;

    // Ordenar por rating (simulando tendencia)
    const trending = [...recommendedProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      count: trending.length,
      message: 'Productos en tendencia',
      data: trending,
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
 * POST agregar un producto a recomendados
 */
export const addRecommendedProduct = async (
  req: Request,
  res: Response<ApiResponse<RecommendedProduct>>
): Promise<void> => {
  try {
    const { name, category, price, rating } = req.body;

    if (!name || !category) {
      res.status(400).json({
        success: false,
        error: 'name y category son requeridos',
      });
      return;
    }

    const newProduct: RecommendedProduct = {
      id: Math.max(...recommendedProducts.map((p) => p.id)) + 1,
      name,
      category,
      price,
      rating: rating || 4.0,
    };

    recommendedProducts.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Producto agregado a recomendados',
      data: newProduct,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
