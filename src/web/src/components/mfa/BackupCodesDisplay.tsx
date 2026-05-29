'use client';

import { useI18n } from '@/i18n';
import { Card, Button, Alert } from '@/components/ui';

interface BackupCodesDisplayProps {
  codes: string[];
  onDownload: () => void;
  onClose: () => void;
}

export function BackupCodesDisplay({ codes, onDownload, onClose }: BackupCodesDisplayProps) {
  const { t } = useI18n();

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.mfa.backupCodesTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.mfa.backupCodesSubtitle}
        </p>
      </div>

      <Alert variant="warning" className="mb-4">
        {t.mfa.backupCodesWarning}
      </Alert>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {codes.map((code, index) => (
          <div 
            key={index}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
          >
            <code className="font-mono text-lg font-medium text-gray-900 dark:text-white">
              {code}
            </code>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onDownload} className="flex-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t.mfa.downloadCodes}
        </Button>
        <Button onClick={onClose} className="flex-1">
          {t.common.done}
        </Button>
      </div>
    </Card>
  );
}