'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationCenter, Notification } from './components/NotificationCenter';
import { BroadcastComposer } from './components/BroadcastComposer';
import { TemplateManager, Template } from './components/TemplateManager';
import { MessageHistory, Message } from './components/MessageHistory';

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Lesson Reminder',
    message: 'Your Bible study lesson "God\'s Love" is scheduled for tomorrow at 10:00 AM.',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    category: 'lesson',
  },
  {
    id: '2',
    title: 'Baptism Date Confirmed',
    message: 'Your baptism has been scheduled for June 15, 2024 at Kigali Central Church.',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: 'baptism',
  },
  {
    id: '3',
    title: 'Interview Scheduled',
    message: 'Your baptism interview is scheduled for May 28, 2024 at 2:00 PM.',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    category: 'interview',
  },
  {
    id: '4',
    title: 'New Instructor Assigned',
    message: 'Pastor James has been assigned as your Bible study instructor.',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: 'assignment',
  },
  {
    id: '5',
    title: 'System Update',
    message: 'The BMS system will undergo maintenance on May 30th from 2:00 AM to 4:00 AM.',
    type: 'warning',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    category: 'system',
  },
];

// Mock data for message history
const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Welcome to BMS',
    body: 'Welcome to the Baptism Management System. We are excited to have you join us on your spiritual journey.',
    channels: ['in-app', 'email'],
    recipientGroup: 'All Candidates',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: 'delivered',
    readCount: 45,
    totalRecipients: 50,
    sentBy: 'System Admin',
  },
  {
    id: '2',
    subject: 'Upcoming Baptism Service',
    body: 'We have a baptism service scheduled for June 15th. All candidates should confirm their attendance.',
    channels: ['in-app', 'sms'],
    recipientGroup: 'Pending Baptisms',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'sent',
    readCount: 12,
    totalRecipients: 15,
    sentBy: 'Pastor John',
  },
  {
    id: '3',
    subject: 'Lesson Schedule Change',
    body: 'Due to unforeseen circumstances, the lesson schedule for next week has been modified. Please check your updated schedule.',
    channels: ['email'],
    recipientGroup: 'All Instructors',
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'failed',
    readCount: 0,
    totalRecipients: 20,
    sentBy: 'Admin',
  },
];

export default function NotificationsPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'notifications' | 'broadcast' | 'templates' | 'history'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Stats
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Broadcast handlers
  const handleSendBroadcast = (message: { subject: string; body: string; channels: string[]; recipients: string }) => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      // Add to message history
      const newMessage: Message = {
        id: String(Date.now()),
        subject: message.subject,
        body: message.body,
        channels: message.channels as Message['channels'],
        recipientGroup: message.recipients,
        sentAt: new Date().toISOString(),
        status: 'sent',
        readCount: 0,
        totalRecipients: 25,
        sentBy: 'Current User',
      };
      mockMessages.unshift(newMessage);
    }, 1500);
  };

  // Template handlers
  const handleCreateTemplate = (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: Template = {
      ...template,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
  };

  const handleUpdateTemplate = (id: string, template: Partial<Template>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...template, updatedAt: new Date().toISOString() } : t))
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Message history handlers
  const handleViewMessage = (message: Message) => {
    console.log('View message:', message);
  };

  const handleResendMessage = (messageId: string) => {
    console.log('Resend message:', messageId);
  };

  const handleDeleteMessage = (messageId: string) => {
    console.log('Delete message:', messageId);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Notifications & Communication' : 'Ibis通知 n\'Ibyerekana'}
          </h1>
          <p className="text-gray-500 mt-1">
            {language === 'en'
              ? 'Manage notifications, broadcasts, and message templates'
              : 'Gucunga ibis通知, ibyinshi, n\'ibishusho by\'ibyo washiranye'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="info" className="text-sm px-3 py-1">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="bg-white border">
          <TabsTrigger value="notifications">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {t?.notifications?.title || 'Notifications'}
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="broadcast">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            {t?.notifications?.broadcastTitle || 'Broadcast'}
          </TabsTrigger>
          <TabsTrigger value="templates">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            {t?.notifications?.templateManager || 'Templates'}
          </TabsTrigger>
          <TabsTrigger value="history">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t?.notifications?.messageHistory || 'History'}
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsTrigger value="notifications" className="hidden" />

        {/* Broadcast Tab */}
        <TabsTrigger value="broadcast" className="hidden" />

        {/* Templates Tab */}
        <TabsTrigger value="templates" className="hidden" />

        {/* History Tab */}
        <TabsTrigger value="history" className="hidden" />
      </Tabs>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'notifications' && (
          <Card className="p-6">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDelete={handleDeleteNotification}
              t={t}
            />
          </Card>
        )}

        {activeTab === 'broadcast' && (
          <BroadcastComposer
            t={t}
            onSend={handleSendBroadcast}
            isSending={isSending}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateManager
            t={t}
            templates={templates}
            onCreateTemplate={handleCreateTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
          />
        )}

        {activeTab === 'history' && (
          <MessageHistory
            t={t}
            messages={mockMessages}
            onViewDetails={handleViewMessage}
            onResend={handleResendMessage}
            onDelete={handleDeleteMessage}
          />
        )}
      </div>
    </div>
  );
}