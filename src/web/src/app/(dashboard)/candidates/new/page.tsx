'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Input, Select, Card, Alert } from '@/components/ui';

export default function NewCandidatePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      province: '',
      district: '',
      sector: '',
    },
    localChurch: '',
    referralSource: '',
    previousAffiliation: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to the new candidate's page or back to list
      router.push('/candidates');
    } catch (err) {
      setError(t.candidate.failedToRegister);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: '', label: t.common.select },
    { value: 'male', label: t.candidate.male },
    { value: 'female', label: t.candidate.female },
  ];

  const provinceOptions = [
    { value: '', label: t.common.select },
    { value: 'kigali', label: t.candidate.kigali },
    { value: 'northern', label: t.candidate.northernProvince },
    { value: 'southern', label: t.candidate.southernProvince },
    { value: 'eastern', label: t.candidate.easternProvince },
    { value: 'western', label: t.candidate.westernProvince },
  ];

  const churchOptions = [
    { value: '', label: t.common.select },
    { value: 'kigali-central', label: t.candidate.kigaliCentral },
    { value: 'kigali-north', label: t.candidate.kigaliNorth },
    { value: 'kigali-south', label: t.candidate.kigaliSouth },
    { value: 'ruhengeri', label: t.candidate.ruhengeri },
    { value: 'butare', label: t.candidate.butare },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/candidates">
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.back}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.candidate.registration}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.candidate.registerNewCandidate}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card title={t.candidate.personalInfo}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t.candidate.fullName}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder={t.candidate.enterFullName}
            />
            <Input
              label={t.candidate.email}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t.candidate.placeholderEmail}
            />
            <Input
              label={t.candidate.phone}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={t.candidate.placeholderPhone}
            />
            <Input
              label={t.candidate.dateOfBirth}
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <Select
              label={t.candidate.gender}
              name="gender"
              options={genderOptions}
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        {/* Address Information */}
        <Card title={t.candidate.address}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label={t.candidate.province}
              name="address.province"
              options={provinceOptions}
              value={formData.address.province}
              onChange={handleChange}
              required
            />
            <Input
              label={t.candidate.district}
              name="address.district"
              value={formData.address.district}
              onChange={handleChange}
              required
              placeholder={t.candidate.enterDistrict}
            />
            <Input
              label={t.candidate.sector}
              name="address.sector"
              value={formData.address.sector}
              onChange={handleChange}
              required
              placeholder={t.candidate.enterSector}
            />
          </div>
        </Card>

        {/* Church & Referral Information */}
        <Card title={t.candidate.churchReferralInfo}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t.candidate.localChurch}
              name="localChurch"
              options={churchOptions}
              value={formData.localChurch}
              onChange={handleChange}
              required
            />
            <Input
              label={t.candidate.referralSource}
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              placeholder={t.candidate.referralSource}
            />
            <div className="md:col-span-2">
              <Input
                label={t.candidate.previousAffiliation}
                name="previousAffiliation"
                value={formData.previousAffiliation}
                onChange={handleChange}
                placeholder={t.candidate.previousAffiliation}
              />
            </div>
          </div>
        </Card>

        {/* Additional Notes */}
        <Card title={t.candidate.additionalNotes}>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t.candidate.notes}
          />
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/candidates">
            <Button variant="outline" type="button">
              {t.common.cancel}
            </Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.candidate.submitRegistration}
          </Button>
        </div>
      </form>
    </div>
  );
}