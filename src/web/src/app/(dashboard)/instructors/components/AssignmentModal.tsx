'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card } from '@/components/ui';

interface Candidate {
  id: string;
  fullName: string;
  localChurch: string;
  status: string;
}

interface AssignmentModalProps {
  instructorId: string;
  instructorName: string;
  unassignedCandidates: Candidate[];
  onAssign: (candidateId: string) => void;
  onClose: () => void;
}

export function AssignmentModal({
  instructorId,
  instructorName,
  unassignedCandidates,
  onAssign,
  onClose,
}: AssignmentModalProps) {
  const { t } = useI18n();
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidate) {
      onAssign(selectedCandidate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card variant="elevated" className="w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.instructor.assignCandidate}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Assign a candidate to <strong>{instructorName}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="candidate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.instructor.selectCandidate}
              </label>
              <select
                id="candidate"
                value={selectedCandidate}
                onChange={(e) => setSelectedCandidate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">{t.instructor.selectCandidatePlaceholder}</option>
                {unassignedCandidates.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.fullName} - {candidate.localChurch} ({candidate.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={!selectedCandidate}>
                {t.instructor.assignButton}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}