'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card } from '@/components/ui';
import { MfaStatusCard, MfaSetupForm, BackupCodesDisplay } from '@/components/mfa';

export default function SecuritySettingsPage() {
  const { t } = useI18n();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  // Mock data - replace with API calls
  const mockQrCode = 'data:image/png;base64,mock-qr-code';
  const mockSecret = 'JBSWY3DPEHPK3PXP';
  const mockBackupCodes = [
    'ABCD-1234', 'EFGH-5678', 'IJKL-9012', 'MNOP-3456',
    'QRST-7890', 'UVWX-1234', 'YZAB-5678', 'CDEF-9012',
  ];

  const handleEnableMfa = async () => {
    setShowSetup(true);
  };

  const handleVerifyMfa = async (code: string) => {
    // API call to verify and enable MFA
    console.log('Verifying MFA code:', code);
    // On success:
    setMfaEnabled(true);
    setShowSetup(false);
    setShowBackupCodes(true);
  };

  const handleDisableMfa = async () => {
    // API call to disable MFA
    console.log('Disabling MFA');
    setMfaEnabled(false);
  };

  const handleDownloadCodes = () => {
    const content = mockBackupCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mfa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showSetup) {
    return (
      <div className="max-w-md mx-auto">
        <MfaSetupForm
          qrCode={mockQrCode}
          secret={mockSecret}
          onVerify={handleVerifyMfa}
          onCancel={() => setShowSetup(false)}
        />
      </div>
    );
  }

  if (showBackupCodes) {
    return (
      <div className="max-w-md mx-auto">
        <BackupCodesDisplay
          codes={mockBackupCodes}
          onDownload={handleDownloadCodes}
          onClose={() => setShowBackupCodes(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.settings.security}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.settings.securitySubtitle}
        </p>
      </div>

      <Card variant="outlined" padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.mfa.twoFactorAuth}
        </h2>
        
        <div className="space-y-4">
          <MfaStatusCard
            isEnabled={mfaEnabled}
            onEnable={handleEnableMfa}
            onDisable={handleDisableMfa}
            onManageBackupCodes={() => setShowBackupCodes(true)}
          />
        </div>
      </Card>

      <Card variant="outlined" padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.settings.loginHistory}
        </h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Chrome on Windows</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">192.168.1.1 • Kigali, Rwanda</p>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400">{t.settings.currentSession}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Safari on iPhone</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">192.168.1.2 • Kigali, Rwanda</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
        </div>
      </Card>

      <Card variant="outlined" padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.settings.sessions}
        </h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t.settings.sessionsDescription}
        </p>
        
        <div className="mt-4">
          <Button variant="outline" size="sm">
            {t.settings.manageSessions}
          </Button>
        </div>
      </Card>
    </div>
  );
}