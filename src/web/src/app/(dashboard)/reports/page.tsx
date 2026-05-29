'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { Card, Button, Select } from '@/components/ui';
import { api } from '@/lib/api';
import { KpiCards } from './components/KpiCards';
import { BaptismTrends } from './components/BaptismTrends';
import { CandidateProgressReport } from './components/CandidateProgressReport';
import { DemographicsReport } from './components/DemographicsReport';
import { ChurchComparison } from './components/ChurchComparison';
import { ReportBuilder } from './components/ReportBuilder';

export default function ReportsPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('year');

  useEffect(() => {
    async function fetchReportData() {
      try {
        const [baptismStats, candidateProgress, churchMetrics, growthAnalytics] = await Promise.all([
          api.reports.getBaptismStats(),
          api.reports.getCandidateProgress(),
          api.reports.getChurchComparison(),
          api.reports.getGrowthAnalytics(),
        ]);

        setData({
          baptismStats,
          candidateProgress,
          churchMetrics,
          growthAnalytics,
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, [timeRange]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.reports.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.reports.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: 'month', label: 'Last Month' },
              { value: 'quarter', label: 'Last Quarter' },
              { value: 'year', label: 'Last Year' },
              { value: 'all', label: 'All Time' },
            ]}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          />
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.common.export}
          </Button>
        </div>
      </div>

      <KpiCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaptismTrends data={data.baptismStats} />
        <CandidateProgressReport data={data.candidateProgress} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemographicsReport data={data} />
        <ChurchComparison data={data.churchMetrics} />
      </div>

      <ReportBuilder />
    </div>
  );
}
