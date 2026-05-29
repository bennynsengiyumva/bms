'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TranslationStructure } from '@/i18n/translations';

interface BroadcastComposerProps {
  t: TranslationStructure;
  onSend: (message: { subject: string; body: string; channels: string[]; recipients: string }) => void;
  isSending?: boolean;
}

type Channel = 'in-app' | 'sms' | 'email';

const channelIcons: Record<Channel, React.ReactNode> = {
  'in-app': (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  sms: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  email: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
};

const recipientGroups = [
  { id: 'all', label: 'All Users' },
  { id: 'pastors', label: 'Pastors' },
  { id: 'instructors', label: 'Instructors' },
  { id: 'candidates', label: 'Candidates' },
  { id: 'church-admins', label: 'Church Admins' },
];

export function BroadcastComposer({ t, onSend, isSending = false }: BroadcastComposerProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Channel[]>(['in-app']);
  const [selectedRecipients, setSelectedRecipients] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(false);

  const toggleChannel = (channel: Channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleSend = () => {
    onSend({
      subject,
      body,
      channels: selectedChannels,
      recipients: selectedRecipients,
    });
    // Reset form
    setSubject('');
    setBody('');
    setSelectedChannels(['in-app']);
    setSelectedRecipients('all');
  };

  const isValid = subject.trim() && body.trim() && selectedChannels.length > 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold">{t.notifications.broadcastTitle}</h3>
          <p className="text-sm text-gray-500">{t.notifications.broadcastSubtitle}</p>
        </div>

        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.recipients}
          </label>
          <div className="flex flex-wrap gap-2">
            {recipientGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedRecipients(group.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  selectedRecipients === group.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                )}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        {/* Channel Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.channels}
          </label>
          <div className="flex gap-3">
            {(['in-app', 'sms', 'email'] as Channel[]).map((channel) => (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                  selectedChannels.includes(channel)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {channelIcons[channel]}
                <span className="text-sm font-medium capitalize">{channel}</span>
                {selectedChannels.includes(channel) && (
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {selectedChannels.includes('sms') && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {t.notifications.smsWarning}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.subject}
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t.notifications.subjectPlaceholder}
          />
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.message}
          </label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.notifications.messagePlaceholder}
            rows={6}
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {body.length} / 500
          </div>
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? t.notifications.hidePreview : t.notifications.showPreview}
          </Button>
        </div>

        {/* Preview */}
        {showPreview && (
          <Card className="bg-gray-50 p-4 border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t.notifications.preview}</h4>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-500">{t.notifications.recipients}:</span>{' '}
                <span>{recipientGroups.find((g) => g.id === selectedRecipients)?.label}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-500">{t.notifications.channels}:</span>{' '}
                <span>{selectedChannels.join(', ')}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-500">{t.notifications.subject}:</span>{' '}
                <span>{subject || '(empty)'}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-500">{t.notifications.message}:</span>
              </div>
              <p className="text-sm text-gray-700 bg-white p-3 rounded border mt-1">
                {body || '(empty)'}
              </p>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="default">{selectedChannels.length} channel(s)</Badge>
            <Badge variant="secondary">{recipientGroups.find((g) => g.id === selectedRecipients)?.label}</Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setSubject(''); setBody(''); }}>
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleSend}
              disabled={!isValid || isSending}
            >
              {isSending ? t.common.loading : t.notifications.sendBroadcast}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}