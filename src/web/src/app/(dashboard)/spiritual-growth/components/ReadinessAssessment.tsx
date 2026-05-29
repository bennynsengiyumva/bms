'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Badge } from '@/components/ui';

interface ReadinessData {
  score: number;
  notes: string;
  isReady: boolean;
  lastUpdated: string;
}

interface ReadinessAssessmentProps {
  candidateId: string;
  readiness: ReadinessData;
  onUpdateReadiness: (data: { score: number; notes: string; isReady: boolean }) => void;
}

export function ReadinessAssessment({ candidateId, readiness, onUpdateReadiness }: ReadinessAssessmentProps) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [editScore, setEditScore] = useState(readiness.score);
  const [editNotes, setEditNotes] = useState(readiness.notes);

  const handleSave = () => {
    onUpdateReadiness({
      score: editScore,
      notes: editNotes,
      isReady: editScore >= 75,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditScore(readiness.score);
    setEditNotes(readiness.notes);
    setIsEditing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBadge = () => {
    if (readiness.isReady) {
      return <Badge variant="success">{t.spiritual.readyForBaptism}</Badge>;
    }
    if (readiness.score >= 50) {
      return <Badge variant="warning">{t.spiritual.inProgress}</Badge>;
    }
    return <Badge variant="danger">{t.spiritual.notReady}</Badge>;
  };

  return (
    <Card title={t.spiritual.candidateReadiness} className="h-full">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          {getStatusBadge()}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {readiness.lastUpdated}
          </span>
        </div>

        {/* Score Display / Edit */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.spiritual.readinessScore} ({editScore}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editScore}
                onChange={e => setEditScore(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.spiritual.assessmentNotes}
              </label>
              <textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder={t.spiritual.assessmentNotes}
                className="w-full p-3 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCancel} className="flex-1">
                {t.common.cancel}
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {t.common.save}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Score Circle */}
            <div className="flex items-center justify-center">
              <div className={`text-6xl font-bold ${getScoreColor(readiness.score)}`}>
                {readiness.score}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  readiness.score >= 80 
                    ? 'bg-green-500' 
                    : readiness.score >= 60 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${readiness.score}%` }}
              />
            </div>

            {/* Notes */}
            {readiness.notes && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.candidate.notes}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {readiness.notes}
                </p>
              </div>
            )}

            {/* Edit Button */}
            <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
              {t.candidate.notes}
            </Button>
          </>
        )}

        {/* Criteria Breakdown */}
        <div className="border-t dark:border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t.spiritual.candidateReadiness}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t.spiritual.attendance}</span>
              <span className={readiness.score >= 75 ? 'text-green-600' : 'text-gray-500'}>✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t.spiritual.prayerLife}</span>
              <span className={readiness.score >= 60 ? 'text-green-600' : 'text-gray-500'}>✓</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t.spiritual.character}</span>
              <span className={readiness.score >= 50 ? 'text-green-600' : 'text-gray-500'}>✓</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}