'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { Button, Input, Select, Card, Alert } from '@/components/ui';
import { UserRole } from '@/types';

const roleOptions = [
  { value: 'candidate', label: '' },
  { value: 'instructor', label: '' },
  { value: 'pastor', label: '' },
  { value: 'church_admin', label: '' },
  { value: 'district_admin', label: '' },
  { value: 'field_admin', label: '' },
  { value: 'union_admin', label: '' },
];

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
    churchId: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    
    // Simple password strength calculation
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t.validation.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return t.passwordStrength.veryWeak;
      case 1: return t.passwordStrength.weak;
      case 2: return t.passwordStrength.fair;
      case 3: return t.passwordStrength.strong;
      case 4: return t.passwordStrength.veryStrong;
      default: return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-400';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  // Update role options with translated labels
  const translatedRoleOptions = [
    { value: 'candidate', label: t.roles.candidate },
    { value: 'instructor', label: t.roles.instructor },
    { value: 'pastor', label: t.roles.pastor },
    { value: 'church_admin', label: t.roles.church_admin },
    { value: 'district_admin', label: t.roles.district_admin },
    { value: 'field_admin', label: t.roles.field_admin },
    { value: 'union_admin', label: t.roles.union_admin },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
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
              {t.auth.registerTitle}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.auth.registerSubtitle}
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
              name="fullName"
              label={t.auth.fullName}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />

            <Input
              type="email"
              name="email"
              label={t.auth.email}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              type="tel"
              name="phone"
              label={t.auth.phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              name="role"
              label={t.auth.role}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              options={translatedRoleOptions}
              placeholder={t.auth.selectRole}
              required
            />

            <Input
              type="password"
              name="password"
              label={t.auth.password}
              value={formData.password}
              onChange={handlePasswordChange}
              required
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${passwordStrength >= level ? getPasswordStrengthColor() : 'bg-gray-200 dark:bg-gray-700'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {getPasswordStrengthLabel()}
                </p>
              </div>
            )}

            <Input
              type="password"
              name="confirmPassword"
              label={t.auth.confirmPassword}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {t.auth.signUp}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.auth.hasAccount}{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
              >
                {t.auth.signIn}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
