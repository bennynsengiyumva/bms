'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import type { TranslationStructure } from '@/i18n/translations';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: string;
  category: 'lesson' | 'baptism' | 'interview' | 'system' | 'assignment';
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  t: TranslationStructure;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  t,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
  t: TranslationStructure;
}) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.notifications.justNow;
    if (diffMins < 60) return `${diffMins} ${t.notifications.minutesAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.notifications.hoursAgo}`;
    return `${diffDays} ${t.notifications.daysAgo}`;
  };

  return (
    <div
      className={cn(
        'p-4 border rounded-lg transition-colors',
        !notification.read && 'bg-blue-50 border-blue-100',
        notification.read && 'bg-white border-gray-200 hover:bg-gray-50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('mt-1', getIconStyles(notification.type))}>
          {notification.type === 'success' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {notification.type === 'warning' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {notification.type === 'error' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {notification.type === 'info' && (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn('text-sm font-medium', !notification.read && 'text-blue-900', notification.read && 'text-gray-900')}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{notification.message}</p>
          <div className="mt-2 flex items-center gap-2">
            {!notification.read && (
              <Button variant="outline" size="sm" onClick={onMarkAsRead}>
                {t.notifications.markAsRead}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onDelete}>
              {t.common.delete}
            </Button>
          </div>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  t,
}: NotificationCenterProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'lesson' | 'baptism' | 'interview'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.category === activeTab;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'lesson':
        return t.bibleStudy.title;
      case 'baptism':
        return t.baptism.title;
      case 'interview':
        return t.candidate.baptismInterview;
      case 'system':
        return t.settings.security;
      case 'assignment':
        return t.instructor.assignCandidate;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.notifications.title}</h2>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `${unreadCount} ${t.notifications.unread}` : t.notifications.allRead}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            {t.notifications.markAllAsRead}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="all">{t.common.all}</TabsTrigger>
          <TabsTrigger value="unread">{t.notifications.unread}</TabsTrigger>
          <TabsTrigger value="lesson">{t.bibleStudy.title}</TabsTrigger>
          <TabsTrigger value="baptism">{t.baptism.title}</TabsTrigger>
          <TabsTrigger value="interview">{t.candidate.baptismInterview}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500">{t.notifications.noNotifications}</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => onMarkAsRead(notification.id)}
              onDelete={() => onDelete(notification.id)}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
}

export type { Notification };