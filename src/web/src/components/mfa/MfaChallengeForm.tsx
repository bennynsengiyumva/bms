'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Alert } from '@/components/ui';

interface MfaChallengeFormProps {
  onVerify: (code: string) => Promise<void>;
  onUseBackupCode: () => void;
}

export function MfaChallengeForm({ onVerify, onUseBackupCode }: MfaChallengeFormProps) {
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
      setError(err.message || t.mfa.invalidCode);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.mfa.challengeTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.mfa.challengeSubtitle}
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

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

        <Button type="submit" isLoading={isLoading} className="w-full">
          {t.mfa.verifyButton}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onUseBackupCode}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t.mfa.useBackupCode}
          </button>
        </div>
      </form>
    </Card>
  );
}