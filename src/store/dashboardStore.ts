import { create } from 'zustand';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  aovChange: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  sales: number;
  revenue: number;
  stock: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing' | 'cancelled';
  date: string;
}

interface DashboardStore {
  stats: DashboardStats;
  salesData: SalesData[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  isLoading: boolean;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: {
    totalRevenue: 45231.89,
    totalOrders: 342,
    totalCustomers: 289,
    averageOrderValue: 132.15,
    revenueChange: 20.1,
    ordersChange: 12.5,
    customersChange: 15.3,
    aovChange: 8.2,
  },
  salesData: [
    { month: 'Jan', sales: 4000, orders: 45 },
    { month: 'Feb', sales: 3000, orders: 38 },
    { month: 'Mar', sales: 5000, orders: 52 },
    { month: 'Apr', sales: 4500, orders: 48 },
    { month: 'May', sales: 6000, orders: 65 },
    { month: 'Jun', sales: 5500, orders: 58 },
    { month: 'Jul', sales: 7000, orders: 72 },
    { month: 'Aug', sales: 6500, orders: 68 },
    { month: 'Sep', sales: 8000, orders: 85 },
    { month: 'Oct', sales: 7500, orders: 78 },
    { month: 'Nov', sales: 9000, orders: 95 },
    { month: 'Dec', sales: 8500, orders: 88 },
  ],
  topProducts: [
    {
      id: '1',
      name: 'Vueltiao Hat',
      image: '/assets/assets11/sombrero-vueltiao.webp',
      sales: 156,
      revenue: 7800,
      stock: 45,
    },
    {
      id: '2',
      name: 'Wayuu Bag',
      image: '/assets/assets11/mochila.webp',
      sales: 134,
      revenue: 6700,
      stock: 32,
    },
    {
      id: '3',
      name: 'Hammock Chair',
      image: '/assets/assets11/hamaca.webp',
      sales: 98,
      revenue: 9800,
      stock: 18,
    },
    {
      id: '4',
      name: 'Handwoven Bracelet',
      image: '/assets/assets11/pulseras.webp',
      sales: 234,
      revenue: 4680,
      stock: 125,
    },
    {
      id: '5',
      name: 'Traditional Poncho',
      image: '/assets/assets11/ropa.webp',
      sales: 67,
      revenue: 5360,
      stock: 28,
    },
  ],
  recentOrders: [
    {
      id: 'ORD-001',
      customer: 'Sarah Johnson',
      product: 'Vueltiao Hat',
      amount: 50.0,
      status: 'completed',
      date: '2024-11-20',
    },
    {
      id: 'ORD-002',
      customer: 'Michael Brown',
      product: 'Wayuu Bag',
      amount: 75.0,
      status: 'processing',
      date: '2024-11-20',
    },
    {
      id: 'ORD-003',
      customer: 'Emily Davis',
      product: 'Hammock Chair',
      amount: 120.0,
      status: 'completed',
      date: '2024-11-19',
    },
    {
      id: 'ORD-004',
      customer: 'David Wilson',
      product: 'Handwoven Bracelet',
      amount: 20.0,
      status: 'pending',
      date: '2024-11-19',
    },
    {
      id: 'ORD-005',
      customer: 'Jessica Martinez',
      product: 'Traditional Poncho',
      amount: 95.0,
      status: 'completed',
      date: '2024-11-18',
    },
    {
      id: 'ORD-006',
      customer: 'James Anderson',
      product: 'Vueltiao Hat',
      amount: 50.0,
      status: 'cancelled',
      date: '2024-11-18',
    },
  ],
  isLoading: false,
  fetchDashboardData: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ isLoading: false });
  },
}));
