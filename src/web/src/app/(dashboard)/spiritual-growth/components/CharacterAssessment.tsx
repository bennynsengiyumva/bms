'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card } from '@/components/ui';

interface CharacterTrait {
  id: string;
  trait: string;
  score: number; // 1-5
  notes?: string;
}

interface CharacterAssessmentProps {
  candidateId: string;
  traits: CharacterTrait[];
  onUpdateTrait: (trait: string, score: number, notes?: string) => void;
}

export function CharacterAssessment({ candidateId, traits, onUpdateTrait }: CharacterAssessmentProps) {
  const { t } = useI18n();
  const [editingTrait, setEditingTrait] = useState<string | null>(null);
  const [editScore, setEditScore] = useState(3);
  const [editNotes, setEditNotes] = useState('');

  const characterTraits = [
    { key: 'honesty', label: t.spiritual.honesty },
    { key: 'kindness', label: t.spiritual.kindness },
    { key: 'patience', label: t.spiritual.patience },
    { key: 'humility', label: t.spiritual.humility },
    { key: 'service', label: t.spiritual.service },
  ];

  const handleSave = (traitKey: string) => {
    onUpdateTrait(traitKey, editScore, editNotes);
    setEditingTrait(null);
  };

  const handleEdit = (traitKey: string, currentScore: number, currentNotes?: string) => {
    setEditingTrait(traitKey);
    setEditScore(currentScore);
    setEditNotes(currentNotes || '');
  };

  const getTraitEntry = (traitKey: string) => traits.find(t => t.trait === traitKey);

  const averageScore = traits.length > 0 
    ? (traits.reduce((sum, t) => sum + t.score, 0) / traits.length).toFixed(1)
    : '0';

  return (
    <Card title={t.spiritual.characterAssessment} className="h-full">
      <div className="space-y-4">
        {/* Overall Score */}
        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageScore}/5</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t.spiritual.overallReadiness}</p>
        </div>

        {/* Trait List */}
        <div className="space-y-3">
          {characterTraits.map(ct => {
            const entry = getTraitEntry(ct.key);
            const score = entry?.score || 0;
            const isEditing = editingTrait === ct.key;

            return (
              <div key={ct.key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {ct.label}
                  </span>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editScore}
                        onChange={e => setEditScore(parseInt(e.target.value))}
                        className="p-1 rounded border dark:bg-gray-900 dark:border-gray-700"
                      >
                        {[1, 2, 3, 4, 5].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Button size="sm" variant="ghost" onClick={() => handleSave(ct.key)}>
                        ✓
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <span
                            key={s}
                            className={`w-5 h-5 rounded-full ${
                              s <= score 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            style={{ fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(ct.key, score, entry?.notes)}
                      >
                        ✎
                      </Button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {isEditing ? (
                  <textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder={t.spiritual.assessmentNotes}
                    className="w-full p-2 rounded border dark:bg-gray-900 dark:border-gray-700 text-sm min-h-[60px]"
                  />
                ) : (
                  entry?.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {entry.notes}
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}