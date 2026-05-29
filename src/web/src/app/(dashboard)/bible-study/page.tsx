'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { LessonCatalogManager } from './components/LessonCatalogManager';
import { ProgressTracker } from './components/ProgressTracker';

// Types
interface Lesson {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  duration: string;
  order: number;
}

interface LessonProgress {
  id: string;
  lessonId: string;
  lessonTitle: string;
  status: 'not_started' | 'in_progress' | 'completed';
  understandingLevel?: number;
  completedDate?: string;
  notes?: string;
}

interface Candidate {
  id: string;
  name: string;
}

// Mock data for development
const mockLessons: Lesson[] = [
  {
    id: '1',
    title: "God's Love",
    description: 'Understanding the love of God for humanity',
    objectives: ['Recognize God\'s love', 'Understand salvation plan', 'Accept Christ'],
    duration: '45 min',
    order: 1,
  },
  {
    id: '2',
    title: 'Sin and Salvation',
    description: 'What is sin and how we are saved',
    objectives: ['Define sin', 'Understand confession', 'Learn about redemption'],
    duration: '60 min',
    order: 2,
  },
  {
    id: '3',
    title: 'The Bible',
    description: 'Introduction to Scripture and its authority',
    objectives: ['Understand Bible structure', 'Learn to navigate', 'Appreciate inspiration'],
    duration: '45 min',
    order: 3,
  },
  {
    id: '4',
    title: "Jesus' Return",
    description: 'Second coming and prophetic events',
    objectives: ['Study signs', 'Understand hope', 'Prepare spiritually'],
    duration: '60 min',
    order: 4,
  },
  {
    id: '5',
    title: 'The Church',
    description: 'Nature and purpose of the church',
    objectives: ['Understand fellowship', 'Learn church history', 'Appreciate unity'],
    duration: '45 min',
    order: 5,
  },
  {
    id: '6',
    title: 'Baptism',
    description: 'Meaning and significance of baptism',
    objectives: ['Understand baptism', 'Learn candidate preparation', 'Experience conversion'],
    duration: '60 min',
    order: 6,
  },
  {
    id: '7',
    title: 'Prayer and Worship',
    description: 'Developing spiritual disciplines',
    objectives: ['Practice prayer', 'Understand worship', 'Build devotional life'],
    duration: '45 min',
    order: 7,
  },
  {
    id: '8',
    title: 'Healthy Living',
    description: 'Christian lifestyle and health',
    objectives: ['Understand wellness', 'Apply principles', 'Honor body as temple'],
    duration: '45 min',
    order: 8,
  },
];

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Jean Pierre' },
  { id: '2', name: 'Marie Mukamana' },
  { id: '3', name: 'Claude Habimana' },
];

const mockProgress: LessonProgress[] = [
  { id: 'p1', lessonId: '1', lessonTitle: "God's Love", status: 'completed', understandingLevel: 5, completedDate: '2025-05-01' },
  { id: 'p2', lessonId: '2', lessonTitle: 'Sin and Salvation', status: 'completed', understandingLevel: 4, completedDate: '2025-05-05' },
  { id: 'p3', lessonId: '3', lessonTitle: 'The Bible', status: 'in_progress', understandingLevel: 3 },
  { id: 'p4', lessonId: '4', lessonTitle: "Jesus' Return", status: 'not_started' },
  { id: 'p5', lessonId: '5', lessonTitle: 'The Church', status: 'not_started' },
  { id: 'p6', lessonId: '6', lessonTitle: 'Baptism', status: 'not_started' },
  { id: 'p7', lessonId: '7', lessonTitle: 'Prayer and Worship', status: 'not_started' },
  { id: 'p8', lessonId: '8', lessonTitle: 'Healthy Living', status: 'not_started' },
];

type ViewMode = 'catalog' | 'progress';

export default function BibleStudyPage() {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [progress, setProgress] = useState<LessonProgress[]>(mockProgress);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // In production, would fetch from API:
  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await api.bibleStudy.getLessons();
  //       setLessons(data);
  //     } catch (error) {
  //       console.error('Failed to fetch lessons:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchLessons();
  // }, []);

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  // Handlers
  const handleAddLesson = (lesson: Omit<Lesson, 'id'>) => {
    const newLesson = { ...lesson, id: Date.now().toString() };
    setLessons([...lessons, newLesson]);
    // In production: api.bibleStudy.createLesson(lesson)
  };

  const handleEditLesson = (id: string, lesson: Omit<Lesson, 'id'>) => {
    setLessons(lessons.map(l => l.id === id ? { ...lesson, id } : l));
    // In production: api.bibleStudy.updateLesson(id, lesson)
  };

  const handleDeleteLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
    // In production: api.bibleStudy.deleteLesson(id)
  };

  const handleLogCompletion = (data: { lessonId: string; understandingLevel: number; notes?: string }) => {
    const newProgress: LessonProgress = {
      id: `p${Date.now()}`,
      lessonId: data.lessonId,
      lessonTitle: lessons.find(l => l.id === data.lessonId)?.title || '',
      status: 'completed',
      understandingLevel: data.understandingLevel,
      notes: data.notes,
      completedDate: new Date().toISOString().split('T')[0],
    };
    setProgress([...progress, newProgress]);
    // In production: api.bibleStudy.logCompletion({ candidateId: selectedCandidateId, ...data })
  };

  const handleUpdateProgress = (progressId: string, data: { understandingLevel?: number; notes?: string; completed?: boolean }) => {
    setProgress(progress.map(p => 
      p.id === progressId 
        ? { 
            ...p, 
            status: data.completed ? 'completed' : p.status,
            understandingLevel: data.understandingLevel || p.understandingLevel,
            notes: data.notes || p.notes,
            completedDate: data.completed ? new Date().toISOString().split('T')[0] : p.completedDate,
          } 
        : p
    ));
    // In production: api.bibleStudy.updateProgress(progressId, data)
  };

  const completedCount = progress.filter(p => p.status === 'completed').length;
  const percentage = progress.length > 0 ? Math.round((completedCount / progress.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.bibleStudy.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.bibleStudy.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'catalog' ? 'primary' : 'outline'}
            onClick={() => setViewMode('catalog')}
          >
            {t.bibleStudy.lessonCatalog}
          </Button>
          <Button 
            variant={viewMode === 'progress' ? 'primary' : 'outline'}
            onClick={() => setViewMode('progress')}
          >
            {t.bibleStudy.viewProgress}
          </Button>
        </div>
      </div>

      {/* Catalog View */}
      {viewMode === 'catalog' && (
        <>
          {/* Search */}
          <Card variant="outlined" padding="md">
            <Input
              type="search"
              placeholder={t.bibleStudy.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>

          {/* View Toggle for Admin */}
          <div className="flex justify-end">
            <Link href="/bible-study/lessons/new">
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t.bibleStudy.addLesson}
              </Button>
            </Link>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">{lesson.order}</span>
                  </div>
                  <Badge variant="info">{lesson.duration}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {lesson.description}
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    {t.bibleStudy.learningObjectives}
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {lesson.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Link href={`/bible-study/progress/${lesson.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      {t.bibleStudy.viewProgress}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {filteredLessons.length === 0 && (
            <Card className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">{t.bibleStudy.noLessonsFound}</p>
            </Card>
          )}
        </>
      )}

      {/* Progress View */}
      {viewMode === 'progress' && (
        <div className="space-y-6">
          {/* Candidate Selector */}
          <Card>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t.bibleStudy.selectCandidate}:
              </label>
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="flex-1 p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="">{t.bibleStudy.selectCandidate}</option>
                {candidates.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </Card>

          {/* Progress Overview */}
          {selectedCandidate && (
            <>
              {/* Overall Progress Card */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedCandidate.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.bibleStudy.overallProgress}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${percentage >= 75 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {percentage}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.progressPercentage}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      percentage >= 75 ? 'bg-green-600' : 'bg-blue-600'
                    }`}
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
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {progress.filter(p => p.status === 'in_progress').length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.inProgress}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {progress.filter(p => p.status === 'not_started').length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.bibleStudy.notStarted}</p>
                  </div>
                </div>
              </Card>

              {/* Lesson Progress List */}
              <Card title={t.bibleStudy.lessonProgress}>
                <div className="space-y-3">
                  {progress.map(p => {
                    const lesson = lessons.find(l => l.id === p.lessonId);
                    return (
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
                            {lesson && (
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-300 font-bold text-sm">{lesson.order}</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">{p.lessonTitle}</span>
                              {lesson && (
                                <span className="ml-2 text-xs text-gray-500">({lesson.duration})</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.status === 'completed' && (
                              <Badge variant="success">{t.bibleStudy.completed}</Badge>
                            )}
                            {p.status === 'in_progress' && (
                              <Badge variant="warning">{t.bibleStudy.inProgress}</Badge>
                            )}
                            {p.status === 'not_started' && (
                              <Badge variant="secondary">{t.bibleStudy.notStarted}</Badge>
                            )}
                          </div>
                        </div>

                        {p.understandingLevel && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">{t.bibleStudy.understandingLevel}:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span
                                  key={s}
                                  className={`w-4 h-4 rounded-full ${
                                    s <= p.understandingLevel!
                                      ? 'bg-blue-500'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {p.completedDate && (
                          <p className="text-xs text-gray-400">
                            {t.bibleStudy.lessonCompleted}: {p.completedDate}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {!selectedCandidate && (
            <Card className="text-center py-12">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                {t.bibleStudy.selectCandidate}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}