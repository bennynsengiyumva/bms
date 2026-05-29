'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card } from '@/components/ui';

interface DisciplineEntry {
  id: string;
  type: 'prayer' | 'scripture_reading' | 'worship' | 'service';
  duration: number; // in minutes
  date: string;
  notes?: string;
}

interface DisciplineTrackerProps {
  candidateId: string;
  entries: DisciplineEntry[];
  onLogDiscipline: (entry: Omit<DisciplineEntry, 'id'>) => void;
}

export function DisciplineTracker({ candidateId, entries, onLogDiscipline }: DisciplineTrackerProps) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'prayer' as DisciplineEntry['type'],
    duration: 30,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogDiscipline(formData);
    setFormData({
      type: 'prayer',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowForm(false);
  };

  const disciplineTypes = [
    { key: 'prayer', label: t.spiritual.prayerLife },
    { key: 'scripture_reading', label: t.spiritual.character },
    { key: 'worship', label: t.spiritual.worshipAttendance },
    { key: 'service', label: t.spiritual.service },
  ];

  // Calculate totals per type
  const totalsByType = entries.reduce((acc, entry) => {
    acc[entry.type] = (acc[entry.type] || 0) + entry.duration;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card title={t.spiritual.spiritualDisciplines} className="h-full">
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          {disciplineTypes.map(dt => (
            <div key={dt.key} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round((totalsByType[dt.key] || 0) / 60)}h
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{dt.label}</p>
            </div>
          ))}
        </div>

        {/* Log Button */}
        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowForm(!showForm)}>
          {showForm ? t.common.cancel : t.spiritual.logDiscipline}
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
                onChange={e => setFormData({ ...formData, type: e.target.value as DisciplineEntry['type'] })}
                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
              >
                {disciplineTypes.map(dt => (
                  <option key={dt.key} value={dt.key}>{dt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.spiritual.duration} (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                min="1"
                max="480"
                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
              />
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
                  <span className="text-lg">
                    {entry.type === 'prayer' ? '🙏' : 
                     entry.type === 'scripture_reading' ? '📖' : 
                     entry.type === 'worship' ? '🎵' : '🤝'}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {disciplineTypes.find(dt => dt.key === entry.type)?.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {entry.duration}m
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{entry.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}