'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Input, Card, Alert } from '@/components/ui';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSent(true);
    } catch (err) {
      setError(t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="w-full max-w-md">
          <Card variant="elevated" padding="lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t.auth.passwordResetSent}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                We have sent password reset instructions to your email.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  {t.auth.backToLogin}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">BMS</span>
            </div>
          </Link>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.auth.resetPassword}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.auth.resetPasswordSubtitle}
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              label={t.auth.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {t.auth.sendResetLink}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
            >
              {t.auth.backToLogin}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
