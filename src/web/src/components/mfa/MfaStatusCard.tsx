'use client';

import { useI18n } from '@/i18n';
import { Card, Button } from '@/components/ui';

interface MfaStatusCardProps {
  isEnabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onManageBackupCodes: () => void;
}

export function MfaStatusCard({ isEnabled, onEnable, onDisable, onManageBackupCodes }: MfaStatusCardProps) {
  const { t } = useI18n();

  return (
    <Card variant="outlined" padding="md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-full mr-4 ${
            isEnabled 
              ? 'bg-green-100 dark:bg-green-900' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <svg 
              className={`w-6 h-6 ${
                isEnabled 
                  ? 'text-green-600 dark:text-green-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {t.mfa.twoFactorAuth}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEnabled ? t.mfa.enabled : t.mfa.disabled}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEnabled ? (
            <>
              <Button variant="outline" size="sm" onClick={onManageBackupCodes}>
                {t.mfa.backupCodes}
              </Button>
              <Button variant="outline" size="sm" onClick={onDisable}>
                {t.mfa.disableButton}
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onEnable}>
              {t.mfa.enableButton}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}