import { Request, Response } from 'express';
import {
  Order,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
  ApiResponse,
} from '../types';

// Simulamos una base de datos en memoria
let orders: Order[] = [];

/**
 * GET todas las órdenes
 */
export const getAllOrders = async (
  req: Request,
  res: Response<ApiResponse<Order[]>>
): Promise<void> => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '10');
    const skip = (page - 1) * limit;

    const paginatedOrders = orders.slice(skip, skip + limit);

    res.json({
      success: true,
      count: paginatedOrders.length,
      data: paginatedOrders,
    } as ApiResponse<Order[]>);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET orden por ID
 */
export const getOrderById = async (
  req: Request,
  res: Response<ApiResponse<Order>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = orders.find((o) => o.id === parseInt(id));

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Orden no encontrada',
      });
      return;
    }

    res.json({
      success: true,
      data: order,
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
 * GET órdenes por usuario
 */
export const getOrdersByUser = async (
  req: Request,
  res: Response<ApiResponse<Order[]>>
): Promise<void> => {
  try {
    const { userId } = req.params;
    const userOrders = orders.filter((o) => o.userId === parseInt(userId));

    res.json({
      success: true,
      count: userOrders.length,
      data: userOrders,
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
 * POST crear nueva orden
 */
export const createOrder = async (
  req: Request,
  res: Response<ApiResponse<Order>>
): Promise<void> => {
  try {
    const {
      userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
    } = req.body as CreateOrderDTO;

    // Validar campos requeridos
    if (!userId || !items || items.length === 0 || !total) {
      res.status(400).json({
        success: false,
        error: 'Los campos userId, items y total son requeridos',
      });
      return;
    }

    const newOrder: Order = {
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      userId,
      items,
      total,
      status: 'pending',
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: newOrder,
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
 * PUT actualizar estado de la orden
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response<ApiResponse<Order>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body as UpdateOrderStatusDTO;

    const order = orders.find((o) => o.id === parseInt(id));

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Orden no encontrada',
      });
      return;
    }

    // Actualizar estado
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    order.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Estado de la orden actualizado',
      data: order,
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
 * DELETE cancelar orden
 */
export const cancelOrder = async (
  req: Request,
  res: Response<ApiResponse<Order>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const order = orders.find((o) => o.id === parseInt(id));

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Orden no encontrada',
      });
      return;
    }

    // Solo se pueden cancelar órdenes pendientes
    if (order.status !== 'pending') {
      res.status(400).json({
        success: false,
        error: 'Solo se pueden cancelar órdenes pendientes',
      });
      return;
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      data: order,
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
 * GET obtener estadísticas de órdenes
 */
export const getOrderStats = async (
  _req: Request,
  res: Response<
    ApiResponse<{
      totalOrders: number;
      totalRevenue: number;
      averageOrderValue: number;
      ordersByStatus: Record<string, number>;
    }>
  >
): Promise<void> => {
  try {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Contar órdenes por estado
    const ordersByStatus: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      ordersByStatus[order.status]++;
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
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
