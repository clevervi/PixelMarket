'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SalesData } from '@/store/dashboardStore';

interface SalesChartProps {
  data: SalesData[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-dark dark:text-dark-text mb-1">Sales Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly sales and order trends</p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B4513" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B4513" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D2691E" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D2691E" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#8B4513" 
            fillOpacity={1}
            fill="url(#colorSales)"
            strokeWidth={2}
            name="Sales ($)"
          />
          <Area 
            type="monotone" 
            dataKey="orders" 
            stroke="#D2691E" 
            fillOpacity={1}
            fill="url(#colorOrders)"
            strokeWidth={2}
            name="Orders"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
