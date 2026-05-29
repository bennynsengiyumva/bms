'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DemographicsReportProps {
  data: any;
}

export function DemographicsReport({ data }: DemographicsReportProps) {
  const { t } = useI18n();

  // Mock demographic data since API doesn't fully provide it yet
  const chartData = [
    { name: '18-25', value: 12 },
    { name: '26-35', value: 25 },
    { name: '36-45', value: 18 },
    { name: '46-60', value: 10 },
    { name: '60+', value: 5 },
  ];

  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.reports.demographics}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none' }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
