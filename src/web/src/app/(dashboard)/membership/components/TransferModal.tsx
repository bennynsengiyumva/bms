'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Alert } from '@/components/ui';

interface TransferModalProps {
  memberId: string;
  memberName: string;
  currentChurch: string;
  onTransfer: (toChurchId: string, notes: string) => Promise<void>;
  onClose: () => void;
}

export function TransferModal({
  memberId,
  memberName,
  currentChurch,
  onTransfer,
  onClose,
}: TransferModalProps) {
  const { t } = useI18n();
  const [toChurchId, setToChurchId] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock churches for dropdown
  const churches = [
    { id: 'c1', name: 'Kigali Central Church' },
    { id: 'c2', name: 'Remera Church' },
    { id: 'c3', name: 'Musanze Church' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await onTransfer(toChurchId, notes);
    } catch (err: any) {
      setError(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card variant="elevated" className="w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.membership.requestTransfer}
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
            {t.membership.transferDescription}
          </p>

          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.membership.currentChurch}
              </p>
              <p className="text-lg text-gray-900 dark:text-white">{currentChurch}</p>
            </div>

            <div>
              <label htmlFor="toChurch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.membership.toChurch}
              </label>
              <select
                id="toChurch"
                value={toChurchId}
                onChange={(e) => setToChurchId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">{t.membership.selectChurch}</option>
                {churches.filter(c => c.id !== memberId).map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.membership.transferNotes}
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t.membership.transferNotesPlaceholder}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t.common.cancel}
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {t.membership.submitTransfer}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}