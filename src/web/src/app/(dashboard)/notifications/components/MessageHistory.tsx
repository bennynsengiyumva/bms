'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { TranslationStructure } from '@/i18n/translations';

export interface Message {
  id: string;
  subject: string;
  body: string;
  channels: string[];
  recipientGroup: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed';
  readCount: number;
  totalRecipients: number;
  sentBy: string;
}

interface MessageHistoryProps {
  t: TranslationStructure;
  messages: Message[];
  onViewDetails: (message: Message) => void;
  onResend: (messageId: string) => void;
  onDelete: (messageId: string) => void;
}

function MessageCard({
  message,
  onViewDetails,
  onResend,
  onDelete,
  t,
}: {
  message: Message;
  onViewDetails: () => void;
  onResend: () => void;
  onDelete: () => void;
  t: TranslationStructure;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default">{t.notifications.statusSent}</Badge>;
      case 'delivered':
        return <Badge variant="success">{t.notifications.statusDelivered}</Badge>;
      case 'failed':
        return <Badge variant="danger">{t.notifications.statusFailed}</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 truncate">{message.subject}</h4>
            {getStatusBadge(message.status)}
          </div>

          {/* Preview */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{message.body}</p>

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(message.sentAt)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {message.totalRecipients} recipients
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {message.readCount} read
            </span>
            <span className="flex items-center gap-1">
              {message.channels.map((channel) => (
                <span key={channel} className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 uppercase text-[10px]">
                  {channel}
                </span>
              ))}
            </span>
          </div>

          {/* Delivery rate */}
          {message.totalRecipients > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(message.readCount / message.totalRecipients) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((message.readCount / message.totalRecipients) * 100)}% read
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t.common.view}
            </DropdownMenuItem>
            {message.status === 'failed' && (
              <DropdownMenuItem onClick={onResend}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t.notifications.resend}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.common.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

function MessageDetailsModal({
  message,
  onClose,
  t,
}: {
  message: Message;
  onClose: () => void;
  t: TranslationStructure;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t.notifications.messageDetails}</h3>
            <Button variant="ghost" onClick={onClose}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">{t.notifications.subject}</label>
              <p className="mt-1 text-gray-900">{message.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t.notifications.recipients}</label>
              <p className="mt-1 text-gray-900">{message.recipientGroup}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t.notifications.sentBy}</label>
              <p className="mt-1 text-gray-900">{message.sentBy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t.notifications.channels}</label>
              <div className="mt-1 flex gap-2">
                {message.channels.map((channel) => (
                  <Badge key={channel} variant="secondary">{channel}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t.notifications.message}</label>
              <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded border">{message.body}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{message.totalRecipients}</p>
                <p className="text-xs text-gray-500">{t.notifications.totalRecipients}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{message.readCount}</p>
                <p className="text-xs text-gray-500">{t.notifications.readCount}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {message.totalRecipients > 0 ? Math.round((message.readCount / message.totalRecipients) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">{t.notifications.readRate}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              {t.common.close}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function MessageHistory({
  t,
  messages,
  onViewDetails,
  onResend,
  onDelete,
}: MessageHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filteredMessages = messages.filter((msg) =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t.notifications.messageHistory}</h3>
          <p className="text-sm text-gray-500">{t.notifications.messageHistorySubtitle}</p>
        </div>
        <Badge variant="secondary">{messages.length} messages</Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.notifications.searchMessages}
          className="pl-10"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Message List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">{t.notifications.noMessagesFound}</p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onViewDetails={() => setSelectedMessage(message)}
              onResend={() => onResend(message.id)}
              onDelete={() => onDelete(message.id)}
              t={t}
            />
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedMessage && (
        <MessageDetailsModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          t={t}
        />
      )}
    </div>
  );
}