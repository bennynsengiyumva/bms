'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Select } from '@/components/ui';
import { BaptismEventCard } from './components/BaptismEventCard';
import { BaptismCertificate } from './components/BaptismCertificate';

interface BaptismEvent {
  id: string;
  candidateName: string;
  localChurch: string;
  instructor: string;
  scheduledDate: string;
  status: 'scheduled' | 'completed';
}

export default function BaptismPage() {
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showCertificate, setShowCertificate] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const baptismEvents: BaptismEvent[] = [
    {
      id: '1',
      candidateName: 'Marie Mukamana',
      localChurch: 'Kigali Central',
      instructor: 'Pastor Jean',
      scheduledDate: '2025-06-15',
      status: 'scheduled',
    },
    {
      id: '2',
      candidateName: 'Jean Pierre',
      localChurch: 'Kigali Central',
      instructor: 'Pastor Marie',
      scheduledDate: '2025-06-15',
      status: 'scheduled',
    },
    {
      id: '3',
      candidateName: 'Claude Habimana',
      localChurch: 'Ruhengeri',
      instructor: 'Pastor Alice',
      scheduledDate: '2025-05-20',
      status: 'completed',
    },
  ];

  const scheduledBaptisms = baptismEvents.filter((e) => e.status === 'scheduled');
  const completedBaptisms = baptismEvents.filter((e) => e.status === 'completed');

  const locationOptions = [
    { value: 'kigali-central', label: t.candidate.kigaliCentral },
    { value: 'kigali-north', label: t.candidate.kigaliNorth },
    { value: 'kigali-south', label: t.candidate.kigaliSouth },
    { value: 'ruhengeri', label: t.candidate.ruhengeri },
    { value: 'butare', label: t.candidate.butare },
  ];

  const selectedCertificate = showCertificate
    ? baptismEvents.find((e) => e.id === showCertificate)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.baptism.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.baptism.scheduleBaptism}
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.baptism.scheduleBaptism}
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {scheduledBaptisms.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.baptism.candidatesReady}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {completedBaptisms.length}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.baptism.baptized}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.baptism.serviceDetails}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">1</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t.baptism.scheduleBaptism}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Baptisms */}
        <Card title={t.baptism.scheduleBaptism}>
          {scheduledBaptisms.length > 0 ? (
            <div className="space-y-4">
              {scheduledBaptisms.map((event) => (
                <BaptismEventCard
                  key={event.id}
                  id={event.id}
                  candidateName={event.candidateName}
                  localChurch={event.localChurch}
                  instructor={event.instructor}
                  scheduledDate={event.scheduledDate}
                  status={event.status}
                  onConfirm={(id) => console.log('Confirm:', id)}
                  onView={(id) => console.log('View:', id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                {t.baptism.noCandidatesReady}
              </p>
            </div>
          )}
        </Card>

        {/* Baptism History */}
        <Card title={t.baptism.baptismHistory}>
          {completedBaptisms.length > 0 ? (
            <div className="space-y-4">
              {completedBaptisms.map((event) => (
                <BaptismEventCard
                  key={event.id}
                  id={event.id}
                  candidateName={event.candidateName}
                  localChurch={event.localChurch}
                  instructor={event.instructor}
                  scheduledDate={event.scheduledDate}
                  status={event.status}
                  onGenerateCertificate={(id) => setShowCertificate(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t.baptism.noCandidatesReady}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Baptism Service Scheduling */}
      <Card title={t.baptism.serviceDetails}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.baptism.selectDate}
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.baptism.selectLocation}
            </label>
            <Select
              options={locationOptions}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.baptism.officiatingPastor}
            </label>
            <Input
              type="text"
              placeholder={t.baptism.officiatingPastor}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline">
            {t.common.cancel}
          </Button>
          <Button>
            {t.baptism.scheduleBaptism}
          </Button>
        </div>
      </Card>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <BaptismCertificate
          candidateName={selectedCertificate.candidateName}
          localChurch={selectedCertificate.localChurch}
          baptismDate={selectedCertificate.scheduledDate}
          officiatingPastor={selectedCertificate.instructor}
          onClose={() => setShowCertificate(null)}
        />
      )}
    </div>
  );
}