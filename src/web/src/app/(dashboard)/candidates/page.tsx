'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Select } from '@/components/ui';
import { CandidateRow } from './components/CandidateRow';

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'registered' | 'in_progress' | 'ready' | 'baptized';
  localChurch: string;
  instructor: string;
  registrationDate: string;
}

export default function CandidatesPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock data - replace with actual API calls
  const candidates: Candidate[] = [
    {
      id: '1',
      fullName: 'Jean Pierre',
      email: 'jean@example.com',
      phone: '+250 788 123 456',
      status: 'in_progress',
      localChurch: 'Kigali Central',
      instructor: 'Pastor Marie',
      registrationDate: '2025-04-15',
    },
    {
      id: '2',
      fullName: 'Marie Mukamana',
      email: 'marie@example.com',
      phone: '+250 788 234 567',
      status: 'ready',
      localChurch: 'Kigali Central',
      instructor: 'Pastor Jean',
      registrationDate: '2025-03-20',
    },
    {
      id: '3',
      fullName: 'Claude Habimana',
      email: 'claude@example.com',
      phone: '+250 788 345 678',
      status: 'registered',
      localChurch: 'Ruhengeri',
      instructor: 'Pastor Alice',
      registrationDate: '2025-05-01',
    },
    {
      id: '4',
      fullName: 'Grace Uwimana',
      email: 'grace@example.com',
      phone: '+250 788 456 789',
      status: 'baptized',
      localChurch: 'Kigali Central',
      instructor: 'Pastor Marie',
      registrationDate: '2025-02-10',
    },
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: '', label: t.common.all },
    { value: 'registered', label: t.candidate.statusRegistered },
    { value: 'in_progress', label: t.candidate.statusInProgress },
    { value: 'ready', label: t.candidate.statusReady },
    { value: 'baptized', label: t.candidate.statusBaptized },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.candidate.directory}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.candidate.manageCandidates}
          </p>
        </div>
        <Link href="/candidates/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.candidate.newCandidate}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card variant="outlined" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t.candidate.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Candidates Table */}
      <Card variant="outlined" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.name}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.candidate.email}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.candidate.localChurch}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.candidate.instructor}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.status}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <CandidateRow
                    key={candidate.id}
                    id={candidate.id}
                    fullName={candidate.fullName}
                    email={candidate.email}
                    phone={candidate.phone}
                    status={candidate.status}
                    localChurch={candidate.localChurch}
                    instructor={candidate.instructor}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t.candidate.noCandidatesFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
