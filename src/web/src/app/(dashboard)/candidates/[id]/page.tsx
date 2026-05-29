'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Badge } from '@/components/ui';
import { CandidateVerification } from './components/CandidateVerification';

interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  dateCompleted?: string;
  understanding: number;
}

interface CandidateDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    province: string;
    district: string;
    sector: string;
  };
  localChurch: string;
  instructor: string;
  referralSource: string;
  previousAffiliation: string;
  status: 'registered' | 'in_progress' | 'ready' | 'baptized';
  registrationDate: string;
  notes: string;
  lessons: LessonProgress[];
  spiritualAssessment: {
    attendance: number;
    prayerLife: number;
    character: number;
    readinessScore: number;
  };
}

export default function CandidateDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  const candidate: CandidateDetail = {
    id: params.id as string,
    fullName: 'Jean Pierre',
    email: 'jean@example.com',
    phone: '+250 788 123 456',
    dateOfBirth: '1995-05-15',
    gender: 'male',
    address: { province: 'kigali', district: 'Kigali City', sector: 'Nyarugenge' },
    localChurch: 'Kigali Central Church',
    instructor: 'Pastor Marie',
    referralSource: 'Friend',
    previousAffiliation: 'Catholic',
    status: 'in_progress',
    registrationDate: '2025-04-15',
    notes: 'Very motivated candidate, attends all sessions regularly.',
    lessons: [
      { lessonId: '1', lessonTitle: "God's Love", completed: true, dateCompleted: '2025-04-20', understanding: 5 },
      { lessonId: '2', lessonTitle: 'Sin and Salvation', completed: true, dateCompleted: '2025-04-27', understanding: 4 },
      { lessonId: '3', lessonTitle: 'The Bible', completed: true, dateCompleted: '2025-05-04', understanding: 4 },
      { lessonId: '4', lessonTitle: "Jesus' Return", completed: false, understanding: 0 },
      { lessonId: '5', lessonTitle: 'The Church', completed: false, understanding: 0 },
    ],
    spiritualAssessment: { attendance: 90, prayerLife: 4, character: 5, readinessScore: 78 },
  };

  const getStatusBadge = (status: CandidateDetail['status']) => {
    switch (status) {
      case 'registered': return <Badge variant="info">{t.candidate.statusRegistered}</Badge>;
      case 'in_progress': return <Badge variant="warning">{t.candidate.statusInProgress}</Badge>;
      case 'ready': return <Badge variant="success">{t.candidate.statusReady}</Badge>;
      case 'baptized': return <Badge variant="default">{t.candidate.statusBaptized}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/candidates">
            <Button variant="ghost" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.common.back}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{candidate.fullName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.candidateId}: {candidate.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/candidates/${candidate.id}/edit`}>
            <Button variant="outline">{t.common.edit}</Button>
          </Link>
          <Button variant="outline">{t.bibleStudy.schedule}</Button>
        </div>
      </div>

      {/* Status and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title={t.common.status}>
          <div className="flex items-center justify-between">
            {getStatusBadge(candidate.status)}
          </div>
        </Card>
        <Card title={t.bibleStudy.overallProgress}>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round((candidate.lessons.filter(l => l.completed).length / candidate.lessons.length) * 100)}%
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {candidate.lessons.filter(l => l.completed).length} {t.bibleStudy.completedOf}
          </p>
        </Card>
        <Card title={t.spiritual.readinessScore}>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {candidate.spiritualAssessment.readinessScore}%
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.readiness}</p>
        </Card>
      </div>

      {/* Personal Information */}
      <Card title={t.candidate.personalInfo}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.fullName}</p>
            <p className="font-medium text-gray-900 dark:text-white">{candidate.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.email}</p>
            <p className="font-medium text-gray-900 dark:text-white">{candidate.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.phone}</p>
            <p className="font-medium text-gray-900 dark:text-white">{candidate.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.dateOfBirth}</p>
            <p className="font-medium text-gray-900 dark:text-white">{candidate.dateOfBirth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.localChurch}</p>
            <p className="font-medium text-gray-900 dark:text-white">{candidate.localChurch}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.candidate.instructor}</p>
            <p className="font-medium text-gray-900 dark:text-white">{candidate.instructor}</p>
          </div>
        </div>
      </Card>

      {/* Spiritual Assessment */}
      <Card title={t.spiritual.title}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{candidate.spiritualAssessment.attendance}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.attendance}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{candidate.spiritualAssessment.prayerLife}/5</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.prayerLife}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{candidate.spiritualAssessment.character}/5</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.character}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{candidate.spiritualAssessment.readinessScore}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.readiness}</p>
          </div>
        </div>
      </Card>

      {/* Verification and Signing */}
      <CandidateVerification 
        candidateId={candidate.id}
        candidateName={candidate.fullName}
        status={candidate.status}
        lessonsCompleted={candidate.lessons.filter(l => l.completed).length}
        totalLessons={candidate.lessons.length}
        readinessScore={candidate.spiritualAssessment.readinessScore}
      />

      {/* Lesson Progress */}
      <Card title={t.bibleStudy.lessonProgress}>
        <div className="space-y-3">
          {candidate.lessons.map((lesson) => (
            <div key={lesson.lessonId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                {lesson.completed ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  </svg>
                )}
                <span className="font-medium text-gray-900 dark:text-white">{lesson.lessonTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                {lesson.completed && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t.bibleStudy.understandingLevel}: {lesson.understanding}/5
                  </span>
                )}
                {lesson.completed ? (
                  <Badge variant="success">{t.bibleStudy.completed}</Badge>
                ) : (
                  <Badge variant="warning">{t.bibleStudy.notStarted}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card title={t.candidate.notes}>
        <p className="text-gray-700 dark:text-gray-300">{candidate.notes}</p>
      </Card>
    </div>
  );
}