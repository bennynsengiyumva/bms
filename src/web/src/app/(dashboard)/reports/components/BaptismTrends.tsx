'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface BaptismTrendsProps {
  data: any;
}

export function BaptismTrends({ data }: BaptismTrendsProps) {
  const { t } = useI18n();

  // Transform byMonth object into array for Recharts
  const chartData = Object.entries(data.byMonth || {}).map(([month, count]) => ({
    name: month,
    count,
  })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.reports.baptismStats}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]} 
              name="Baptisms"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
