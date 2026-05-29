'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { Button, Input, Card, Alert } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      
      if (response.mfaRequired) {
        router.push(`/verify-mfa?userId=${response.userId}`);
        return;
      }

      login(response.token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

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
              {t.auth.loginTitle}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.auth.loginSubtitle}
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
              autoComplete="email"
            />

            <Input
              type="password"
              name="password"
              label={t.auth.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link 
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {t.auth.forgotPassword}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {t.auth.loginButton}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.auth.noAccount}{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
              >
                {t.auth.signUp}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
