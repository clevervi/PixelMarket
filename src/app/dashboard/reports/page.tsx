'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-storage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { FileText, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  const reports = [
    { id: 1, name: 'Sales Report - January 2024', type: 'Sales', date: '2024-02-01', size: '2.4 MB' },
    { id: 2, name: 'Inventory Report - Q4 2023', type: 'Inventory', date: '2024-01-05', size: '1.8 MB' },
    { id: 3, name: 'Customer Analytics - 2023', type: 'Analytics', date: '2024-01-01', size: '3.2 MB' },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Reports" 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports' }
        ]} 
      />

      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <FileText className="w-5 h-5" />
            Generate New Report
          </button>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <div key={report.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-brown transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark dark:text-dark-text">{report.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{report.type}</span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {report.date}
                      </span>
                      <span className="text-sm text-gray-500">{report.size}</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
