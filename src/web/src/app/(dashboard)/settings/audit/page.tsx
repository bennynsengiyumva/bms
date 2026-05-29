'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Input, Select, Button } from '@/components/ui';

interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  details?: string;
}

export default function AuditLogsPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  // Mock data - replace with API calls
  const mockLogs: AuditLogEntry[] = [
    {
      id: '1',
      userId: 'u1',
      userName: 'Admin User',
      action: 'UPDATE_CANDIDATE',
      resource: 'Candidate',
      resourceId: 'c1',
      timestamp: '2026-05-19T10:30:00Z',
      ipAddress: '192.168.1.1',
      details: 'Status changed to ready',
    },
    {
      id: '2',
      userId: 'u2',
      userName: 'Pastor John',
      action: 'LOG_LESSON_COMPLETION',
      resource: 'CandidateLesson',
      resourceId: 'cl1',
      timestamp: '2026-05-19T09:15:00Z',
      ipAddress: '192.168.1.2',
    },
    {
      id: '3',
      userId: 'u1',
      userName: 'Admin User',
      action: 'APPROVE_TRANSFER',
      resource: 'MembershipTransfer',
      resourceId: 'mt1',
      timestamp: '2026-05-18T16:45:00Z',
      ipAddress: '192.168.1.1',
    },
  ];

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const actionOptions = [
    { value: '', label: t.common.all },
    { value: 'UPDATE_CANDIDATE', label: 'Update Candidate' },
    { value: 'LOG_LESSON_COMPLETION', label: 'Log Lesson' },
    { value: 'APPROVE_TRANSFER', label: 'Approve Transfer' },
    { value: 'CREATE_ANNOUNCEMENT', label: 'Create Announcement' },
  ];

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.audit.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t.audit.subtitle}
        </p>
      </div>

      <Card variant="outlined" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t.common.search + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={actionOptions}
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card variant="outlined" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.name}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.audit.userActivity}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.audit.resourceAccess}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.audit.timestamp}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.audit.ipAddress}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{log.userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{log.userId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{log.resource}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{log.resourceId}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t.audit.noLogsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}