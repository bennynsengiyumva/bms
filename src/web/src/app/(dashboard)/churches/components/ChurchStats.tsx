'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChurchStatsProps {
  data: any;
}

export function ChurchStats({ data }: ChurchStatsProps) {
  const { t } = useI18n();

  const chartData = data?.regionalGrowth || [
    { name: 'Kigali', candidates: 45, baptized: 20 },
    { name: 'Eastern', candidates: 30, baptized: 15 },
    { name: 'Western', candidates: 25, baptized: 10 },
    { name: 'Northern', candidates: 20, baptized: 8 },
    { name: 'Southern', candidates: 35, baptized: 18 },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {t.churches.statsTitle || 'Regional Statistics'}
      </h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar 
              name="Candidates" 
              dataKey="candidates" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              name="Baptized" 
              dataKey="baptized" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">{t.churches.totalChurches || 'Total Churches'}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{data?.totalChurches || 154}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">{t.churches.activeInstructors || 'Active Instructors'}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{data?.activeInstructors || 342}</p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">{t.churches.avgGrowth || 'Avg. Growth'}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">+{data?.avgGrowth || '12%'}</p>
        </div>
      </div>
    </Card>
  );
}
