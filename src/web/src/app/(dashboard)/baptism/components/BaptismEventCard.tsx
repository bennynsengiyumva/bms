'use client';

import { Button, Badge } from '@/components/ui';
import { useI18n } from '@/i18n';

interface BaptismEventCardProps {
  id: string;
  candidateName: string;
  localChurch: string;
  instructor: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed';
  onConfirm?: (id: string) => void;
  onView?: (id: string) => void;
  onGenerateCertificate?: (id: string) => void;
}

export function BaptismEventCard({
  id,
  candidateName,
  localChurch,
  instructor,
  scheduledDate,
  status,
  onConfirm,
  onView,
  onGenerateCertificate,
}: BaptismEventCardProps) {
  const { t } = useI18n();

  if (status === 'completed') {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {candidateName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {localChurch} • {instructor} • {scheduledDate}
            </p>
          </div>
        </div>
        {onGenerateCertificate && (
          <Button variant="ghost" size="sm" onClick={() => onGenerateCertificate(id)}>
            {t.baptism.generateCertificate}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-300 font-bold">
            {candidateName.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {candidateName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {localChurch} • {instructor} • {scheduledDate}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {onConfirm && (
          <Button variant="outline" size="sm" onClick={() => onConfirm(id)}>
            {t.baptism.confirmBaptism}
          </Button>
        )}
        {onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(id)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}