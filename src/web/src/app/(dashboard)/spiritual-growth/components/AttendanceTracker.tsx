'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Badge } from '@/components/ui';

interface AttendanceEntry {
  id: string;
  type: 'worship' | 'prayer_meeting';
  date: string;
  present: boolean;
  notes?: string;
}

interface AttendanceTrackerProps {
  candidateId: string;
  entries: AttendanceEntry[];
  onLogAttendance: (entry: Omit<AttendanceEntry, 'id'>) => void;
}

export function AttendanceTracker({ candidateId, entries, onLogAttendance }: AttendanceTrackerProps) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'worship' as 'worship' | 'prayer_meeting',
    date: new Date().toISOString().split('T')[0],
    present: true,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogAttendance(formData);
    setFormData({
      type: 'worship',
      date: new Date().toISOString().split('T')[0],
      present: true,
      notes: '',
    });
    setShowForm(false);
  };

  const worshipEntries = entries.filter(e => e.type === 'worship');
  const prayerMeetingEntries = entries.filter(e => e.type === 'prayer_meeting');
  const worshipRate = worshipEntries.length > 0 
    ? Math.round((worshipEntries.filter(e => e.present).length / worshipEntries.length) * 100) 
    : 0;
  const prayerRate = prayerMeetingEntries.length > 0 
    ? Math.round((prayerMeetingEntries.filter(e => e.present).length / prayerMeetingEntries.length) * 100) 
    : 0;

  return (
    <Card title={t.spiritual.attendanceTracking} className="h-full">
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{worshipRate}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.spiritual.worshipServices}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{prayerRate}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.spiritual.prayerMeetings}</p>
          </div>
        </div>

        {/* Log Button */}
        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowForm(!showForm)}>
          {showForm ? t.common.cancel : t.spiritual.logAttendance}
        </Button>

        {/* Log Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.spiritual.disciplineType}
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as 'worship' | 'prayer_meeting' })}
                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="worship">{t.spiritual.worshipServices}</option>
                <option value="prayer_meeting">{t.spiritual.prayerMeetings}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.baptism.date}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="present"
                checked={formData.present}
                onChange={e => setFormData({ ...formData, present: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="present" className="text-sm text-gray-700 dark:text-gray-300">
                {t.common.inProgress}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.candidate.notes}
              </label>
              <textarea
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[60px]"
              />
            </div>
            <Button type="submit" size="sm" className="w-full">
              {t.spiritual.addEntry}
            </Button>
          </form>
        )}

        {/* Recent Entries */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.spiritual.viewHistory}
          </p>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t.bibleStudy.noLessonsFound}
            </p>
          ) : (
            entries.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant={entry.present ? 'success' : 'danger'}>
                    {entry.present ? '✓' : '✗'}
                  </Badge>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {entry.type === 'worship' ? t.spiritual.worshipServices : t.spiritual.prayerMeetings}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{entry.date}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}