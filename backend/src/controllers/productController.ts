import { Response, Request } from 'express';
import {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ApiResponse,
} from '../types';

// Simulamos una base de datos en memoria
let products: Product[] = [
  {
    id: 1,
    name: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 29.99,
    category: 'artesanias',
    image: '/assets/product1.jpg',
    stock: 10,
  },
];

/**
 * GET todos los productos
 */
export const getAllProducts = async (
  _req: Request,
  res: Response<ApiResponse<Product[]>>
): Promise<void> => {
  try {
    res.json({
      success: true,
      count: products.length,
      data: products,
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
 * GET producto por ID
 */
export const getProductById = async (
  req: Request,
  res: Response<ApiResponse<Product>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data: product,
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
 * POST crear nuevo producto
 */
export const createProduct = async (
  req: Request,
  res: Response<ApiResponse<Product>>
): Promise<void> => {
  try {
    const { name, description, price, category, image, stock } = req.body as CreateProductDTO;

    // Validar campos requeridos
    if (!name || !price) {
      res.status(400).json({
        success: false,
        error: 'Nombre y precio son requeridos',
      });
      return;
    }

    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      name,
      description,
      price,
      category,
      image: image || '',
      stock: stock || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
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

/**
 * PUT actualizar producto
 */
export const updateProduct = async (
  req: Request,
  res: Response<ApiResponse<Product>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateProductDTO;

    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
      return;
    }

    // Actualizar solo campos proporcionados
    Object.assign(product, updates, { updatedAt: new Date() });

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
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
 * DELETE eliminar producto
 */
export const deleteProduct = async (
  req: Request,
  res: Response<ApiResponse<Product>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
      return;
    }

    const deletedProduct = products.splice(index, 1)[0];

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: deletedProduct,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
