'use client';

import { useEffect, useState, useCallback } from 'react';
import { useI18n } from '@/i18n';
import { Card, Badge, Button, Alert, Skeleton, CardSkeleton, ListItemSkeleton, StatCardSkeleton } from '@/components/ui';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/components/auth/AuthProvider';

// Types
interface DashboardStats {
  activeCandidates: number;
  pendingBaptisms: number;
  lessonsCompleted: number;
  baptizedThisMonth: number;
}

interface ActivityItem {
  id: string;
  message: string;
  time: string;
}

interface BaptismEvent {
  id: string;
  date: string;
  location: string;
  candidates: number;
}

interface DashboardSectionProps {
  title: string;
  error?: string | null;
  isLoading: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
}

function DashboardSection({ title, error, isLoading, onRetry, children }: DashboardSectionProps) {
  return (
    <Card variant="outlined" padding="md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {error && onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <ListItemSkeleton key={i} />)}
        </div>
      ) : error ? (
        <Alert variant="error" title="Failed to load">
          {error}
        </Alert>
      ) : (
        children
      )}
    </Card>
  );
}

function StatsCard({ label, value, icon, colorClass, isLoading, error, onRetry }: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}) {
  if (isLoading) {
    return (
      <Card variant="outlined" padding="md">
        <StatCardSkeleton />
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="md" className={error ? 'opacity-50' : ''}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {error ? '-' : value}
          </p>
        </div>
        <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  
  // Granular loading and error states for each widget
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeCandidates: 0,
    pendingBaptisms: 0,
    lessonsCompleted: 0,
    baptizedThisMonth: 0,
  });

  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const [baptismsLoading, setBaptismsLoading] = useState(true);
  const [baptismsError, setBaptismsError] = useState<string | null>(null);
  const [upcomingBaptisms, setUpcomingBaptisms] = useState<BaptismEvent[]>([]);

  const [candidateData, setCandidateData] = useState<any>(null);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await api.reports.getCandidateProgress();
      setStats({
        activeCandidates: data.total || 0,
        pendingBaptisms: data.byStatus?.ready || 0,
        lessonsCompleted: Math.round((data.averageCompletion || 0) * (data.total || 0) / 100) || 0,
        baptizedThisMonth: data.byStatus?.baptized || 0,
      });
    } catch (err) {
      setStatsError('Unable to load statistics. Please try again.');
      console.error('Stats error:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch recent activity
  const fetchActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const logs = await api.audit.getLogs({ limit: 5 });
      setRecentActivity(logs.slice(0, 5).map((log: any) => ({
        id: log.id,
        message: log.details || `${log.action} on ${log.resource}`,
        time: new Date(log.createdAt).toLocaleString(),
      })));
    } catch (err) {
      setActivityError('Unable to load recent activity.');
      console.error('Activity error:', err);
    } finally {
      setActivityLoading(false);
    }
  }, []);

  // Fetch upcoming baptisms
  const fetchBaptisms = useCallback(async () => {
    setBaptismsLoading(true);
    setBaptismsError(null);
    try {
      const events = await api.baptism.getEvents({ limit: 5 });
      setUpcomingBaptisms(events.slice(0, 5).map((event: any) => ({
        id: event.id,
        date: event.eventDate,
        location: event.location || event.church?.name,
        candidates: event._count?.records || 0,
      })));
    } catch (err) {
      setBaptismsError('Unable to load upcoming baptisms.');
      console.error('Baptisms error:', err);
    } finally {
      setBaptismsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'candidate') {
      // Fetch candidate-specific data
      const fetchCandidateData = async () => {
        try {
          const candidates = await api.candidates.getAll();
          const me = candidates.find((c: any) => c.userId === user.id);
          if (me) {
            setCandidateData(me);
          }
        } catch (err) {
          console.error('Error fetching candidate data:', err);
        } finally {
          setStatsLoading(false);
        }
      };
      fetchCandidateData();
    } else {
      // Fetch all dashboard data in parallel with granular error handling
      fetchStats();
      fetchActivity();
      fetchBaptisms();
    }
  }, [user, fetchStats, fetchActivity, fetchBaptisms]);

  if (user?.role === 'candidate') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.dashboard.welcome}, {user.fullName}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="outlined" padding="md">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Status</span>
                <Badge variant={candidateData?.status === 'ready' ? 'success' : 'info'}>
                  {candidateData?.status || 'Registered'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Keep going with your Bible studies to prepare for baptism!</p>
            </div>
          </Card>
          <Card variant="outlined" padding="md">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <Link href="/bible-study" className="block text-blue-600 hover:underline">View Lessons</Link>
              <Link href="/spiritual-growth" className="block text-blue-600 hover:underline">Spiritual Growth Log</Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.dashboard.welcome}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.role === 'instructor' 
              ? "Here's an overview of the candidates you are mentoring"
              : "Here's an overview of your church's baptism preparation progress"
            }
          </p>
        </div>
      </div>

      {/* Stats Cards - Each loads independently */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label={t.dashboard.activeCandidates}
          value={stats.activeCandidates}
          isLoading={statsLoading}
          error={!!statsError}
          onRetry={fetchStats}
          colorClass="bg-blue-100 dark:bg-blue-900"
          icon={
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        <StatsCard
          label={t.dashboard.pendingBaptisms}
          value={stats.pendingBaptisms}
          isLoading={statsLoading}
          error={!!statsError}
          onRetry={fetchStats}
          colorClass="bg-yellow-100 dark:bg-yellow-900"
          icon={
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          }
        />

        <StatsCard
          label={t.dashboard.lessonsCompleted}
          value={stats.lessonsCompleted}
          isLoading={statsLoading}
          error={!!statsError}
          onRetry={fetchStats}
          colorClass="bg-green-100 dark:bg-green-900"
          icon={
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatsCard
          label={t.dashboard.baptizedThisMonth}
          value={stats.baptizedThisMonth}
          isLoading={statsLoading}
          error={!!statsError}
          onRetry={fetchStats}
          colorClass="bg-purple-100 dark:bg-purple-900"
          icon={
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <Card variant="outlined" padding="md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.dashboard.quickActions}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/candidates/new">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t.dashboard.registerCandidate}
            </Button>
          </Link>
          <Link href="/lessons/log">
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t.dashboard.logLesson}
            </Button>
          </Link>
          <Link href="/reports">
            <Button variant="secondary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t.dashboard.viewReports}
            </Button>
          </Link>
        </div>
      </Card>

      {/* Two Column Layout - Each section handles its own loading/error state */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <DashboardSection
          title={t.dashboard.recentActivity}
          isLoading={activityLoading}
          error={activityError}
          onRetry={fetchActivity}
        >
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                No recent activity
              </p>
            )}
          </div>
        </DashboardSection>

        {/* Upcoming Baptisms */}
        <DashboardSection
          title={t.dashboard.upcomingBaptisms}
          isLoading={baptismsLoading}
          error={baptismsError}
          onRetry={fetchBaptisms}
        >
          {upcomingBaptisms.length > 0 ? (
            <div className="space-y-4">
              {upcomingBaptisms.map((baptism) => (
                <div key={baptism.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(baptism.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {baptism.location}
                    </p>
                  </div>
                  <Badge variant="info">
                    {baptism.candidates} {t.nav.candidates?.toLowerCase() || 'candidates'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t.dashboard.noUpcomingBaptisms}
            </p>
          )}
        </DashboardSection>
      </div>
    </div>
  );
}