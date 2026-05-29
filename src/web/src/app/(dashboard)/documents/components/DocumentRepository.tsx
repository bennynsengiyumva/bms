'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Button, Input, Badge } from '@/components/ui';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

interface DocumentRepositoryProps {
  documents: FileItem[];
  onUpload: () => void;
}

export function DocumentRepository({ documents, onUpload }: DocumentRepositoryProps) {
  const { t } = useI18n();
  const [search, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState('All');

  const folders = ['All', 'Manuals', 'Policies', 'Forms', 'Other'];

  const filteredDocs = documents.filter(doc => 
    (currentFolder === 'All' || doc.type === currentFolder.toLowerCase().replace('s', '')) &&
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="lg:col-span-1 p-4 h-fit">
        <h4 className="font-semibold mb-4 text-sm text-gray-900 dark:text-white uppercase tracking-wider">Folders</h4>
        <nav className="space-y-1">
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setCurrentFolder(folder)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                currentFolder === folder 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className={`w-4 h-4 ${currentFolder === folder ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {folder}
              </div>
            </button>
          ))}
        </nav>
      </Card>

      <Card className="lg:col-span-3 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 w-full sm:max-w-md">
            <Input 
              placeholder={t.documents.searchPlaceholder} 
              value={search}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={onUpload}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.documents.uploadButton}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2">{t.documents.fileName}</th>
                <th className="px-4 py-2">{t.documents.fileType}</th>
                <th className="px-4 py-2">{t.documents.fileSize}</th>
                <th className="px-4 py-2">{t.documents.uploadedBy}</th>
                <th className="px-4 py-2">{t.common.date}</th>
                <th className="px-4 py-2 text-right">{t.documents.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No documents found</td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {doc.name}
                    </td>
                    <td className="px-4 py-3 capitalize">{doc.type}</td>
                    <td className="px-4 py-3 text-gray-500">{doc.size}</td>
                    <td className="px-4 py-3">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 text-gray-500">{doc.date}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">{t.documents.download}</button>
                      <button className="text-red-600 hover:text-red-700">{t.documents.delete}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
