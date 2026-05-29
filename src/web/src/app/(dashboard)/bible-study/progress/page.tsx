'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Badge } from '@/components/ui';

interface CandidateProgress {
  id: string;
  name: string;
  church: string;
  lessons: {
    lessonId: string;
    lessonTitle: string;
    completed: boolean;
    dateCompleted?: string;
    understanding: number;
  }[];
  overallProgress: number;
  nextLesson: string;
}

export default function LessonProgressPage() {
  const { t } = useI18n();
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');

  const progressData: CandidateProgress[] = [
    {
      id: '1',
      name: 'Jean Pierre',
      church: 'Kigali Central',
      lessons: [
        { lessonId: '1', lessonTitle: "God's Love", completed: true, dateCompleted: '2025-04-20', understanding: 5 },
        { lessonId: '2', lessonTitle: 'Sin and Salvation', completed: true, dateCompleted: '2025-04-27', understanding: 4 },
        { lessonId: '3', lessonTitle: 'The Bible', completed: true, dateCompleted: '2025-05-04', understanding: 4 },
        { lessonId: '4', lessonTitle: "Jesus' Return", completed: false, understanding: 0 },
        { lessonId: '5', lessonTitle: 'The Church', completed: false, understanding: 0 },
      ],
      overallProgress: 60,
      nextLesson: '2025-05-15',
    },
    {
      id: '2',
      name: 'Marie Mukamana',
      church: 'Kigali Central',
      lessons: [
        { lessonId: '1', lessonTitle: "God's Love", completed: true, dateCompleted: '2025-04-15', understanding: 5 },
        { lessonId: '2', lessonTitle: 'Sin and Salvation', completed: true, dateCompleted: '2025-04-22', understanding: 5 },
        { lessonId: '3', lessonTitle: 'The Bible', completed: true, dateCompleted: '2025-04-29', understanding: 5 },
        { lessonId: '4', lessonTitle: "Jesus' Return", completed: true, dateCompleted: '2025-05-06', understanding: 4 },
        { lessonId: '5', lessonTitle: 'The Church', completed: false, understanding: 0 },
      ],
      overallProgress: 80,
      nextLesson: '2025-05-13',
    },
    {
      id: '3',
      name: 'Claude Habimana',
      church: 'Ruhengeri',
      lessons: [
        { lessonId: '1', lessonTitle: "God's Love", completed: true, dateCompleted: '2025-05-01', understanding: 4 },
        { lessonId: '2', lessonTitle: 'Sin and Salvation', completed: false, understanding: 0 },
        { lessonId: '3', lessonTitle: 'The Bible', completed: false, understanding: 0 },
        { lessonId: '4', lessonTitle: "Jesus' Return", completed: false, understanding: 0 },
        { lessonId: '5', lessonTitle: 'The Church', completed: false, understanding: 0 },
      ],
      overallProgress: 20,
      nextLesson: '2025-05-12',
    },
  ];

  const selected = selectedCandidate
    ? progressData.find((p) => p.id === selectedCandidate)
    : null;

  const getUnderstandingColor = (level: number) => {
    if (level >= 4) return 'text-green-600 dark:text-green-400';
    if (level >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.bibleStudy.lessonProgress}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.bibleStudy.candidateProgress}
          </p>
        </div>
        <Link href="/bible-study/lessons/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t.bibleStudy.logCompletion}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title={t.candidate.title + 's'} className="lg:col-span-1">
          <div className="space-y-2">
            {progressData.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCandidate === candidate.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.church}</p>
                  </div>
                  <Badge variant={candidate.overallProgress >= 80 ? 'success' : candidate.overallProgress >= 50 ? 'warning' : 'info'}>
                    {candidate.overallProgress}%
                  </Badge>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full"
                    style={{ width: `${candidate.overallProgress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title={selected ? `${selected.name}'s ${t.bibleStudy.progress}` : t.bibleStudy.candidateProgress} className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.bibleStudy.overallProgress}</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selected.overallProgress}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.bibleStudy.nextLesson}</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{selected.nextLesson}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selected.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.lessonId}
                    className={`p-4 rounded-lg border ${
                      lesson.completed
                        ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-green-100 dark:bg-green-900'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {lesson.completed ? (
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">{idx + 1}</span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{lesson.lessonTitle}</span>
                      </div>
                      {lesson.completed && (
                        <div className="text-right">
                          <span className={`text-lg font-semibold ${getUnderstandingColor(lesson.understanding)}`}>
                            {lesson.understanding}/5
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.dateCompleted}</p>
                        </div>
                      )}
                    </div>
                    {!lesson.completed && (
                      <p className="ml-11 text-sm text-gray-500 dark:text-gray-400">{t.bibleStudy.notStarted}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">{t.bibleStudy.candidateProgress}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}