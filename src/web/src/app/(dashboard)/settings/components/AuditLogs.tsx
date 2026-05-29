'use client';

import React, { useState } from 'react';
import { Card, Input, Select, Badge } from '@/components/ui';
import { useI18n } from '@/i18n';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
}

export function AuditLogs() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');

  const mockLogs: AuditLog[] = [
    {
      id: 'l1',
      timestamp: '2026-05-20T14:30:00Z',
      user: 'admin@bms.rw',
      action: 'LOGIN',
      resource: 'Auth',
      ipAddress: '197.243.12.54',
    },
    {
      id: 'l2',
      timestamp: '2026-05-20T14:45:00Z',
      user: 'pastor.john@bms.rw',
      action: 'SIGN_CERTIFICATE',
      resource: 'Baptism/c1',
      ipAddress: '197.243.12.55',
    },
    {
      id: 'l3',
      timestamp: '2026-05-20T15:00:00Z',
      user: 'admin@bms.rw',
      action: 'UPDATE_ROLE',
      resource: 'User/u2',
      ipAddress: '197.243.12.54',
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="outlined" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t.common.search + ' logs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[
                { value: '', label: 'All Actions' },
                { value: 'LOGIN', label: 'Login' },
                { value: 'CREATE', label: 'Create' },
                { value: 'UPDATE', label: 'Update' },
                { value: 'DELETE', label: 'Delete' },
                { value: 'SIGN', label: 'Sign' },
              ]}
              onChange={() => {}}
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
                  {t.audit.timestamp}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.documents.user}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.documents.action}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.audit.ipAddress}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {log.user}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="info">{log.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {log.resource}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
