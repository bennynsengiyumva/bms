'use client';

import { useI18n } from '@/i18n';
import { Card } from '@/components/ui';

interface Log {
  id: string;
  userName: string;
  documentName: string;
  action: string;
  date: string;
  ip: string;
}

interface AccessLogsProps {
  logs: Log[];
}

export function AccessLogs({ logs }: AccessLogsProps) {
  const { t } = useI18n();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        {t.documents.logsTab}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px]">
            <tr>
              <th className="px-4 py-2">{t.documents.accessDate}</th>
              <th className="px-4 py-2">{t.documents.user}</th>
              <th className="px-4 py-2">{t.documents.fileName}</th>
              <th className="px-4 py-2">{t.documents.action}</th>
              <th className="px-4 py-2">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-gray-500">{log.date}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{log.userName}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.documentName}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    log.action === 'view' ? 'bg-blue-100 text-blue-700' : 
                    log.action === 'download' ? 'bg-green-100 text-green-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
