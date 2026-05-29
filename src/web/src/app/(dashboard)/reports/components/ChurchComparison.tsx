'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';

interface ChurchComparisonProps {
  data: any[];
}

export function ChurchComparison({ data }: ChurchComparisonProps) {
  const { t } = useI18n();

  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.reports.churchComparison}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-700">
              <th className="pb-2 font-medium">{t.auth.church}</th>
              <th className="pb-2 font-medium text-center">Members</th>
              <th className="pb-2 font-medium text-center">Candidates</th>
              <th className="pb-2 font-medium text-center">Baptized</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((church) => (
              <tr key={church.churchId}>
                <td className="py-3 text-gray-900 dark:text-white font-medium">
                  {church.churchName}
                </td>
                <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                  {church.memberCount}
                </td>
                <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                  {church.candidateCount}
                </td>
                <td className="py-3 text-center text-gray-600 dark:text-gray-400">
                  {church.baptizedCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
