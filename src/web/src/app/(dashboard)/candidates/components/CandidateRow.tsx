'use client';

import Link from 'next/link';
import { Badge, Button } from '@/components/ui';
import { useI18n } from '@/i18n';
import { getCandidateStatusVariant } from '@/lib/utils';

interface CandidateRowProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'registered' | 'in_progress' | 'ready' | 'baptized';
  localChurch: string;
  instructor: string;
}

export function CandidateRow({
  id,
  fullName,
  email,
  phone,
  status,
  localChurch,
  instructor,
}: CandidateRowProps) {
  const { t } = useI18n();

  const getStatusBadge = () => {
    switch (status) {
      case 'registered':
        return <Badge variant="info">{t.candidate.statusRegistered}</Badge>;
      case 'in_progress':
        return <Badge variant="warning">{t.candidate.statusInProgress}</Badge>;
      case 'ready':
        return <Badge variant="success">{t.candidate.statusReady}</Badge>;
      case 'baptized':
        return <Badge variant="default">{t.candidate.statusBaptized}</Badge>;
      default:
        return null;
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
            <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
              {fullName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {phone}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
        {email}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
        {localChurch}
      </td>
      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
        {instructor}
      </td>
      <td className="px-4 py-4">
        {getStatusBadge()}
      </td>
      <td className="px-4 py-4">
        <Link href={`/candidates/${id}`}>
          <Button variant="ghost" size="sm">
            {t.common.view}
          </Button>
        </Link>
      </td>
    </tr>
  );
}
