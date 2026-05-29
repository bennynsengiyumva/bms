'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';

interface KpiCardsProps {
  data: any;
}

export function KpiCards({ data }: KpiCardsProps) {
  const { t } = useI18n();

  const kpis = [
    {
      title: t.reports.totalCandidates,
      value: data.candidateProgress.total,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-blue-50',
    },
    {
      title: t.reports.baptizedTotal,
      value: data.baptismStats.total,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h8" />
        </svg>
      ),
      color: 'bg-green-50',
    },
    {
      title: t.reports.avgCompletion,
      value: `${Math.round(data.candidateProgress.averageCompletion)}%`,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-purple-50',
    },
    {
      title: t.reports.growthAnalytics,
      value: `${Math.round(data.growthAnalytics.percentageBaptism)}%`,
      subtitle: 'From Baptisms',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} padding="md">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {kpi.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {kpi.value}
              </h3>
              {kpi.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {kpi.subtitle}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
