'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Button, Input } from '@/components/ui';

interface Message {
  id: string;
  sender: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

interface ChurchCommunicationProps {
  messages: Message[];
  onSendMessage: (data: any) => void;
}

export function ChurchCommunication({ messages, onSendMessage }: ChurchCommunicationProps) {
  const { t } = useI18n();
  const [showCompose, setShowCompose] = useState(false);
  const [newMsg, setNewMsg] = useState({ to: '', subject: '', content: '' });

  const handleSend = () => {
    onSendMessage(newMsg);
    setNewMsg({ to: '', subject: '', content: '' });
    setShowCompose(false);
  };

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t.churches.communicationTitle || 'Inter-church Communication'}
        </h3>
        <Button size="sm" onClick={() => setShowCompose(true)}>
          {t.churches.composeMessage || 'Compose'}
        </Button>
      </div>

      {showCompose ? (
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
          <Input 
            placeholder="To (Church/Admin ID)" 
            value={newMsg.to}
            onChange={e => setNewMsg({...newMsg, to: e.target.value})}
          />
          <Input 
            placeholder="Subject" 
            value={newMsg.subject}
            onChange={e => setNewMsg({...newMsg, subject: e.target.value})}
          />
          <textarea
            className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[150px]"
            placeholder="Write your message..."
            value={newMsg.content}
            onChange={e => setNewMsg({...newMsg, content: e.target.value})}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowCompose(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSend}>{t.common.send}</Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t.churches.noMessages || 'No messages found'}
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${msg.read ? 'bg-white dark:bg-gray-900' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{msg.sender}</span>
                  <span className="text-[10px] text-gray-500">{msg.date}</span>
                </div>
                <div className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-200">{msg.subject}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{msg.content}</div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
