'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Badge } from '@/components/ui';

interface LessonProgress {
  id: string;
  lessonId: string;
  lessonTitle: string;
  status: 'not_started' | 'in_progress' | 'completed';
  understandingLevel?: number; // 1-5
  completedDate?: string;
  notes?: string;
}

interface Candidate {
  id: string;
  name: string;
}

interface ProgressTrackerProps {
  candidateId: string;
  candidateName: string;
  progress: LessonProgress[];
  onLogCompletion: (data: { lessonId: string; understandingLevel: number; notes?: string }) => void;
  onUpdateProgress: (progressId: string, data: { understandingLevel?: number; notes?: string; completed?: boolean }) => void;
}

export function ProgressTracker({ candidateId, candidateName, progress, onLogCompletion, onUpdateProgress }: ProgressTrackerProps) {
  const { t } = useI18n();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [understandingLevel, setUnderstandingLevel] = useState(3);
  const [notes, setNotes] = useState('');

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const inProgressCount = progress.filter(p => p.status === 'in_progress').length;
  const notStartedCount = progress.filter(p => p.status === 'not_started').length;
  const percentage = progress.length > 0 ? Math.round((completedCount / progress.length) * 100) : 0;

  const handleSubmit = () => {
    if (selectedLesson) {
      onLogCompletion({
        lessonId: selectedLesson,
        understandingLevel,
        notes: notes || undefined,
      });
      setSelectedLesson(null);
      setUnderstandingLevel(3);
      setNotes('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">{t.bibleStudy.completed}</Badge>;
      case 'in_progress':
        return <Badge variant="warning">{t.bibleStudy.inProgress}</Badge>;
      default:
        return <Badge variant="secondary">{t.bibleStudy.notStarted}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return 'text-green-600 dark:text-green-400';
    if (score >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{candidateName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.bibleStudy.candidateProgress}</p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.progressPercentage}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.completed}</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.inProgress}</p>
          </div>
          <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{notStartedCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.notStarted}</p>
          </div>
        </div>
      </Card>

      {/* Lesson List */}
      <Card title={t.bibleStudy.lessonProgress}>
        <div className="space-y-3">
          {progress.map(p => (
            <div
              key={p.id}
              className={`p-4 rounded-lg border ${
                p.status === 'completed'
                  ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20'
                  : p.status === 'in_progress'
                  ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">{p.lessonTitle}</span>
                  {getStatusBadge(p.status)}
                </div>
                {p.understandingLevel && (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span
                        key={s}
                        className={`w-5 h-5 rounded-full ${
                          s <= p.understandingLevel!
                            ? 'bg-blue-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        style={{ fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {p.status !== 'not_started' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t.bibleStudy.assessmentScore}: {p.understandingLevel}/5
                  </span>
                  {p.completedDate && (
                    <span className="text-gray-400 text-xs">{p.completedDate}</span>
                  )}
                </div>
              )}

              {p.status !== 'completed' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSelectedLesson(p.lessonId)}
                >
                  {t.bibleStudy.markAsComplete}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Log Completion Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.bibleStudy.logCompletion}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.bibleStudy.understandingLevel}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUnderstandingLevel(level)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        understandingLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.bibleStudy.notes}
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t.bibleStudy.notes}
                  className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[80px]"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setSelectedLesson(null)}>
                  {t.common.cancel}
                </Button>
                <Button onClick={handleSubmit}>
                  {t.bibleStudy.markComplete}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}