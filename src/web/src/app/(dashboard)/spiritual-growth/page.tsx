'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card } from '@/components/ui';
import { api } from '@/lib/api';
import {
  AttendanceTracker,
  PrayerRequestLogger,
  DisciplineTracker,
  CharacterAssessment,
  ReadinessAssessment,
} from './components';

// Types
interface AttendanceEntry {
  id: string;
  type: 'worship' | 'prayer_meeting';
  date: string;
  present: boolean;
  notes?: string;
}

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

interface DisciplineEntry {
  id: string;
  type: 'prayer' | 'scripture_reading' | 'worship' | 'service';
  duration: number;
  date: string;
  notes?: string;
}

interface CharacterTrait {
  id: string;
  trait: string;
  score: number;
  notes?: string;
}

interface ReadinessData {
  score: number;
  notes: string;
  isReady: boolean;
  lastUpdated: string;
}

interface SpiritualCandidate {
  id: string;
  candidateName: string;
  readinessScore: number;
  lastMeeting: string;
  notes: string;
  attendance: AttendanceEntry[];
  prayerRequests: PrayerRequest[];
  testimonies: Testimony[];
  disciplines: DisciplineEntry[];
  characterTraits: CharacterTrait[];
  readiness: ReadinessData;
}

// Mock data for development
const mockCandidates: SpiritualCandidate[] = [
  {
    id: '1',
    candidateName: 'Jean Pierre',
    readinessScore: 78,
    lastMeeting: '2025-05-10',
    notes: 'Showing great spiritual growth',
    attendance: [
      { id: 'a1', type: 'worship', date: '2025-05-04', present: true },
      { id: 'a2', type: 'worship', date: '2025-04-27', present: true },
      { id: 'a3', type: 'prayer_meeting', date: '2025-05-07', present: true },
    ],
    prayerRequests: [
      { id: 'p1', request: 'Family unity', date: '2025-05-01', answered: false },
      { id: 'p2', request: 'New job opportunity', date: '2025-04-15', answered: true },
    ],
    testimonies: [
      { id: 't1', testimony: 'God healed my back pain', date: '2025-05-08' },
    ],
    disciplines: [
      { id: 'd1', type: 'prayer', duration: 30, date: '2025-05-10' },
      { id: 'd2', type: 'scripture_reading', duration: 45, date: '2025-05-09' },
    ],
    characterTraits: [
      { id: 'c1', trait: 'honesty', score: 4, notes: 'Very truthful' },
      { id: 'c2', trait: 'kindness', score: 5 },
      { id: 'c3', trait: 'patience', score: 3 },
      { id: 'c4', trait: 'humility', score: 4 },
      { id: 'c5', trait: 'service', score: 4 },
    ],
    readiness: {
      score: 78,
      notes: 'Making good progress',
      isReady: false,
      lastUpdated: '2025-05-10',
    },
  },
  {
    id: '2',
    candidateName: 'Marie Mukamana',
    readinessScore: 92,
    lastMeeting: '2025-05-09',
    notes: 'Excellent progress, ready for interview',
    attendance: [
      { id: 'a4', type: 'worship', date: '2025-05-04', present: true },
      { id: 'a5', type: 'worship', date: '2025-04-27', present: true },
      { id: 'a6', type: 'prayer_meeting', date: '2025-05-07', present: true },
    ],
    prayerRequests: [
      { id: 'p3', request: 'Baptism opportunity', date: '2025-05-05', answered: true },
    ],
    testimonies: [
      { id: 't2', testimony: 'God provided a car', date: '2025-05-06' },
    ],
    disciplines: [
      { id: 'd3', type: 'prayer', duration: 60, date: '2025-05-10' },
      { id: 'd4', type: 'scripture_reading', duration: 30, date: '2025-05-10' },
      { id: 'd5', type: 'service', duration: 120, date: '2025-05-09' },
    ],
    characterTraits: [
      { id: 'c6', trait: 'honesty', score: 5 },
      { id: 'c7', trait: 'kindness', score: 5 },
      { id: 'c8', trait: 'patience', score: 5 },
      { id: 'c9', trait: 'humility', score: 5 },
      { id: 'c10', trait: 'service', score: 5 },
    ],
    readiness: {
      score: 92,
      notes: 'Excellent candidate, ready for baptism',
      isReady: true,
      lastUpdated: '2025-05-09',
    },
  },
  {
    id: '3',
    candidateName: 'Claude Habimana',
    readinessScore: 55,
    lastMeeting: '2025-05-08',
    notes: 'Needs more guidance on prayer life',
    attendance: [
      { id: 'a7', type: 'worship', date: '2025-05-04', present: false },
      { id: 'a8', type: 'worship', date: '2025-04-27', present: true },
      { id: 'a9', type: 'prayer_meeting', date: '2025-05-07', present: true },
    ],
    prayerRequests: [
      { id: 'p4', request: 'Better job', date: '2025-05-02', answered: false },
    ],
    testimonies: [],
    disciplines: [
      { id: 'd6', type: 'prayer', duration: 15, date: '2025-05-08' },
    ],
    characterTraits: [
      { id: 'c11', trait: 'honesty', score: 4 },
      { id: 'c12', trait: 'kindness', score: 3 },
      { id: 'c13', trait: 'patience', score: 3 },
      { id: 'c14', trait: 'humility', score: 4 },
      { id: 'c15', trait: 'service', score: 3 },
    ],
    readiness: {
      score: 55,
      notes: 'Needs improvement in consistency',
      isReady: false,
      lastUpdated: '2025-05-08',
    },
  },
];

export default function SpiritualGrowthPage() {
  const { t } = useI18n();
  const [candidates] = useState<SpiritualCandidate[]>(mockCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'prayer' | 'discipline' | 'character' | 'readiness'>('overview');

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  // Calculate overall stats
  const avgReadiness = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.readinessScore, 0) / candidates.length)
    : 0;
  const readyCount = candidates.filter(c => c.readiness.isReady).length;

  // Handlers
  const handleLogAttendance = (candidateId: string, entry: Omit<AttendanceEntry, 'id'>) => {
    console.log('Log attendance:', candidateId, entry);
    // Would call api.spiritual.logAttendance({ candidateId, ...entry })
  };

  const handleLogPrayerRequest = (candidateId: string, data: { request: string }) => {
    console.log('Log prayer request:', candidateId, data);
    // Would call api.spiritual.logPrayerRequest({ candidateId, ...data })
  };

  const handleLogTestimony = (candidateId: string, data: { testimony: string }) => {
    console.log('Log testimony:', candidateId, data);
    // Would call api.spiritual.logTestimony({ candidateId, ...data })
  };

  const handleLogDiscipline = (candidateId: string, entry: Omit<DisciplineEntry, 'id'>) => {
    console.log('Log discipline:', candidateId, entry);
    // Would call api.spiritual.logDiscipline({ candidateId, ...entry })
  };

  const handleUpdateCharacterTrait = (candidateId: string, trait: string, score: number, notes?: string) => {
    console.log('Update character trait:', candidateId, trait, score, notes);
    // Would call api.spiritual.updateCharacterAssessment(candidateId, { trait, score, notes })
  };

  const handleUpdateReadiness = (candidateId: string, data: { score: number; notes: string; isReady: boolean }) => {
    console.log('Update readiness:', candidateId, data);
    // Would call api.spiritual.updateReadiness(candidateId, data)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.spiritual.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.spiritual.spiritualGrowth}
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{candidates.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.candidate.title}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{readyCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.readyForBaptism}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{avgReadiness}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.overallReadiness}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {candidates.length - readyCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.spiritual.inProgress}</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Candidate List */}
        <Card title={t.candidate.candidateList} className="lg:col-span-1">
          <div className="space-y-2">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setSelectedCandidateId(candidate.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCandidateId === candidate.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{candidate.candidateName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.lastMeeting}</p>
                  </div>
                  <span className={`text-sm font-medium ${
                    candidate.readinessScore >= 80 
                      ? 'text-green-600 dark:text-green-400'
                      : candidate.readinessScore >= 60
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {candidate.readinessScore}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Detailed View */}
        <div className="lg:col-span-3 space-y-6">
          {selectedCandidate ? (
            <>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b dark:border-gray-700 pb-2">
                {[
                  { key: 'overview', label: t.common.inProgress },
                  { key: 'attendance', label: t.spiritual.attendanceTracking },
                  { key: 'prayer', label: t.spiritual.prayerRequests },
                  { key: 'discipline', label: t.spiritual.spiritualDisciplines },
                  { key: 'character', label: t.spiritual.characterAssessment },
                  { key: 'readiness', label: t.spiritual.candidateReadiness },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Attendance Summary */}
                  <Card title={t.spiritual.attendanceTracking}>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.round(selectedCandidate.attendance.filter(a => a.present).length / selectedCandidate.attendance.length * 100) || 0}%
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.spiritual.attendance}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {selectedCandidate.attendance.filter(a => a.type === 'worship').length}
                          </p>
                          <p className="text-xs text-gray-500">{t.spiritual.worshipServices}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {selectedCandidate.attendance.filter(a => a.type === 'prayer_meeting').length}
                          </p>
                          <p className="text-xs text-gray-500">{t.spiritual.prayerMeetings}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Prayer & Testimony Summary */}
                  <Card title={t.spiritual.prayerRequests}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {selectedCandidate.prayerRequests.length}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t.spiritual.prayerRequest}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {selectedCandidate.testimonies.length}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t.spiritual.testimony}</p>
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {selectedCandidate.disciplines.length}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.spiritual.spiritualDisciplines}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Character Summary */}
                  <Card title={t.spiritual.characterAssessment}>
                    <div className="space-y-3">
                      {selectedCandidate.characterTraits.map(trait => (
                        <div key={trait.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {trait.trait}
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span
                                key={s}
                                className={`w-5 h-5 rounded-full ${
                                  s <= trait.score 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                                style={{ fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Readiness Summary */}
                  <Card title={t.spiritual.candidateReadiness}>
                    <div className="text-center">
                      <p className={`text-5xl font-bold ${
                        selectedCandidate.readinessScore >= 80 
                          ? 'text-green-600 dark:text-green-400'
                          : selectedCandidate.readinessScore >= 60
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedCandidate.readinessScore}%
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {selectedCandidate.readiness.isReady 
                          ? t.spiritual.readyForBaptism 
                          : selectedCandidate.readinessScore >= 50 
                          ? t.spiritual.inProgress 
                          : t.spiritual.notReady}
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'attendance' && (
                <AttendanceTracker
                  candidateId={selectedCandidate.id}
                  entries={selectedCandidate.attendance}
                  onLogAttendance={(entry) => handleLogAttendance(selectedCandidate.id, entry)}
                />
              )}

              {activeTab === 'prayer' && (
                <PrayerRequestLogger
                  candidateId={selectedCandidate.id}
                  prayerRequests={selectedCandidate.prayerRequests}
                  testimonies={selectedCandidate.testimonies}
                  onLogPrayerRequest={(data) => handleLogPrayerRequest(selectedCandidate.id, data)}
                  onLogTestimony={(data) => handleLogTestimony(selectedCandidate.id, data)}
                />
              )}

              {activeTab === 'discipline' && (
                <DisciplineTracker
                  candidateId={selectedCandidate.id}
                  entries={selectedCandidate.disciplines}
                  onLogDiscipline={(entry) => handleLogDiscipline(selectedCandidate.id, entry)}
                />
              )}

              {activeTab === 'character' && (
                <CharacterAssessment
                  candidateId={selectedCandidate.id}
                  traits={selectedCandidate.characterTraits}
                  onUpdateTrait={(trait, score, notes) => handleUpdateCharacterTrait(selectedCandidate.id, trait, score, notes)}
                />
              )}

              {activeTab === 'readiness' && (
                <ReadinessAssessment
                  candidateId={selectedCandidate.id}
                  readiness={selectedCandidate.readiness}
                  onUpdateReadiness={(data) => handleUpdateReadiness(selectedCandidate.id, data)}
                />
              )}
            </>
          ) : (
            <Card>
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  {t.common.select} {t.candidate.title}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}