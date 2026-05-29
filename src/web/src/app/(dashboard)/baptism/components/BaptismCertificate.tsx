'use client';

import { Button, Card } from '@/components/ui';
import { useI18n } from '@/i18n';

interface BaptismCertificateProps {
  candidateName: string;
  localChurch: string;
  baptismDate: string;
  officiatingPastor: string;
  onClose?: () => void;
}

export function BaptismCertificate({
  candidateName,
  localChurch,
  baptismDate,
  officiatingPastor,
  onClose,
}: BaptismCertificateProps) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full p-8">
        {/* Certificate Header */}
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.baptism.baptismCertificate}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Seventh-day Adventist Church
          </p>
        </div>

        {/* Certificate Content */}
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            This certifies that
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {candidateName}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            was baptized on
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {baptismDate}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            at {localChurch}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Officiated by {officiatingPastor}
          </p>
        </div>

        {/* Certificate Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-500">Pastor Signature</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-500">Date</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t.common.close}
          </Button>
          <Button onClick={() => window.print()}>
            {t.common.print}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CertificatePreviewProps {
  candidateName: string;
  localChurch: string;
  baptismDate: string;
  officiatingPastor: string;
}

export function CertificatePreview({ candidateName, localChurch, baptismDate, officiatingPastor }: CertificatePreviewProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-6">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {candidateName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {baptismDate} • {localChurch}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {officiatingPastor}
        </p>
      </div>
    </Card>
  );
}