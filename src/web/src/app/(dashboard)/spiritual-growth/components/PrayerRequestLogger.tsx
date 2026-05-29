'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card } from '@/components/ui';

interface PrayerRequest {
  id: string;
  request: string;
  date: string;
  answered: boolean;
}

interface Testimony {
  id: string;
  testimony: string;
  date: string;
}

interface PrayerRequestLoggerProps {
  candidateId: string;
  prayerRequests: PrayerRequest[];
  testimonies: Testimony[];
  onLogPrayerRequest: (data: { request: string }) => void;
  onLogTestimony: (data: { testimony: string }) => void;
}

export function PrayerRequestLogger({
  candidateId,
  prayerRequests,
  testimonies,
  onLogPrayerRequest,
  onLogTestimony,
}: PrayerRequestLoggerProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'prayer' | 'testimony'>('prayer');
  const [prayerForm, setPrayerForm] = useState({ request: '' });
  const [testimonyForm, setTestimonyForm] = useState({ testimony: '' });

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prayerForm.request.trim()) {
      onLogPrayerRequest(prayerForm);
      setPrayerForm({ request: '' });
    }
  };

  const handleTestimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (testimonyForm.testimony.trim()) {
      onLogTestimony(testimonyForm);
      setTestimonyForm({ testimony: '' });
    }
  };

  const answeredCount = prayerRequests.filter(p => p.answered).length;

  return (
    <Card title={t.spiritual.prayerRequests} className="h-full">
      <div className="space-y-4">
        {/* Tab Switcher */}
        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('prayer')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'prayer'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.spiritual.prayerRequest}
          </button>
          <button
            onClick={() => setActiveTab('testimony')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'testimony'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t.spiritual.testimony}
          </button>
        </div>

        {/* Prayer Requests Tab */}
        {activeTab === 'prayer' && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {answeredCount}/{prayerRequests.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.baptism.confirmBaptism}</p>
            </div>

            {/* Log Form */}
            <form onSubmit={handlePrayerSubmit} className="space-y-3">
              <textarea
                value={prayerForm.request}
                onChange={e => setPrayerForm({ request: e.target.value })}
                placeholder={t.spiritual.prayerRequest}
                className="w-full p-3 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[80px]"
              />
              <Button type="submit" variant="outline" size="sm" className="w-full">
                {t.spiritual.logPrayerRequest}
              </Button>
            </form>

            {/* Prayer Request List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {prayerRequests.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t.bibleStudy.noLessonsFound}
                </p>
              ) : (
                prayerRequests.map(pr => (
                  <div key={pr.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-900 dark:text-white flex-1">{pr.request}</p>
                      {pr.answered && (
                        <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{pr.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Testimony Tab */}
        {activeTab === 'testimony' && (
          <div className="space-y-4">
            {/* Log Form */}
            <form onSubmit={handleTestimonySubmit} className="space-y-3">
              <textarea
                value={testimonyForm.testimony}
                onChange={e => setTestimonyForm({ testimony: e.target.value })}
                placeholder={t.spiritual.testimony}
                className="w-full p-3 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[100px]"
              />
              <Button type="submit" variant="outline" size="sm" className="w-full">
                {t.spiritual.logTestimony}
              </Button>
            </form>

            {/* Testimony List */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {testimonies.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t.bibleStudy.noLessonsFound}
                </p>
              ) : (
                testimonies.map(ts => (
                  <div key={ts.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-900 dark:text-white">{ts.testimony}</p>
                    <p className="text-xs text-gray-500 mt-1">{ts.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}