'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';

interface MetricsData {
  activeCandidates: number;
  lessonsCompleted: number;
  averageReadiness: number;
  baptismsThisYear: number;
}

interface InstructorMetricsProps {
  metrics: MetricsData;
}

export function InstructorMetrics({ metrics }: InstructorMetricsProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card variant="outlined" padding="md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.instructor.activeCandidates}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.activeCandidates}</p>
          </div>
        </div>
      </Card>

      <Card variant="outlined" padding="md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
            <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.instructor.lessonsCompleted}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.lessonsCompleted}</p>
          </div>
        </div>
      </Card>

      <Card variant="outlined" padding="md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.instructor.avgReadiness}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.averageReadiness}%</p>
          </div>
        </div>
      </Card>

      <Card variant="outlined" padding="md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.instructor.baptismsThisYear}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metrics.baptismsThisYear}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}