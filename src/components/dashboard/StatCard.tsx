import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor: string;
}

export default function StatCard({ title, value, change, icon: Icon, iconColor }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-dark dark:text-dark-text">{value}</p>
      </div>
    </div>
  );
}
