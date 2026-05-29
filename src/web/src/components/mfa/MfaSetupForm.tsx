'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Alert } from '@/components/ui';

interface MfaSetupFormProps {
  qrCode: string;
  secret: string;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export function MfaSetupForm({ qrCode, secret, onVerify, onCancel }: MfaSetupFormProps) {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onVerify(code);
    } catch (err: any) {
      setError(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.mfa.setupTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.mfa.setupSubtitle}
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="flex justify-center mb-6">
        <div className="p-4 bg-white rounded-lg">
          {/* QR Code placeholder - in production this would be an actual QR code image */}
          <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-xs text-gray-500">{t.mfa.scanQRCode}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {t.mfa.manualEntry}
        </p>
        <code className="text-xs font-mono break-all text-gray-800 dark:text-gray-200">
          {secret}
        </code>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label={t.mfa.verificationCode}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          required
          autoComplete="one-time-code"
        />

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {t.common.cancel}
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            {t.mfa.enableButton}
          </Button>
        </div>
      </form>
    </Card>
  );
}