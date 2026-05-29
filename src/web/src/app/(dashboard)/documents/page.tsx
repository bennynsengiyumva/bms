'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { api } from '@/lib/api';
import { DocumentRepository } from './components/DocumentRepository';
import { CertificateTemplates } from './components/CertificateTemplates';
import { BulkGeneration } from './components/BulkGeneration';
import { AccessLogs } from './components/AccessLogs';

export default function DocumentsPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    documents: [],
    templates: [],
    logs: [],
    candidates: []
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Mock data for demo purposes, since backend might not have real data yet
        const [templates, candidates] = await Promise.all([
          api.documents.getTemplates(),
          api.candidates.getAll({ status: 'ready' })
        ]);

        setData({
          documents: [
            { id: '1', name: 'Baptism_Manual.pdf', type: 'manual', size: '2.4 MB', uploadedBy: 'Admin', date: '2025-05-01' },
            { id: '2', name: 'Church_Policy.docx', type: 'policy', size: '1.1 MB', uploadedBy: 'Admin', date: '2025-04-15' },
          ],
          templates: templates.length > 0 ? templates : [
            { id: 't1', name: 'Standard Baptism Certificate', type: 'Baptism', lastUpdated: '2025-05-10', version: '1.2' },
            { id: 't2', name: 'Membership Certificate', type: 'Membership', lastUpdated: '2025-05-05', version: '1.0' },
          ],
          logs: [
            { id: 'l1', userName: 'Pastor John', documentName: 'Baptism_Manual.pdf', action: 'view', date: '2025-05-20 14:30', ip: '192.168.1.1' },
            { id: 'l2', userName: 'Admin', documentName: 'Church_Policy.docx', action: 'download', date: '2025-05-20 10:15', ip: '192.168.1.5' },
          ],
          candidates: candidates.length > 0 ? candidates : [
            { id: 'c1', name: 'Jean Pierre', church: 'Kigali Central', status: 'ready' },
            { id: 'c2', name: 'Marie Mukamana', church: 'Kigali Central', status: 'ready' },
          ]
        });
      } catch (error) {
        console.error('Error fetching document data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleUpload = () => {
    console.log('Opening upload modal');
  };

  const handleCreateTemplate = () => {
    console.log('Opening template editor');
  };

  const handleGenerateBulk = async (params: any) => {
    try {
      await api.documents.generateCertificate(params);
      alert('Certificates generated successfully!');
    } catch (error) {
      console.error('Error generating certificates:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.documents.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.documents.subtitle}
          </p>
        </div>
      </div>

      <Tabs defaultValue="repository" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="repository">{t.documents.repositoryTab}</TabsTrigger>
          <TabsTrigger value="templates">{t.documents.templatesTab}</TabsTrigger>
          <TabsTrigger value="bulk">{t.documents.bulkTab}</TabsTrigger>
          <TabsTrigger value="logs">{t.documents.logsTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="repository">
          <DocumentRepository 
            documents={data.documents} 
            onUpload={handleUpload} 
          />
        </TabsContent>

        <TabsContent value="templates">
          <CertificateTemplates 
            templates={data.templates} 
            onCreate={handleCreateTemplate} 
          />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkGeneration 
            candidates={data.candidates} 
            templates={data.templates} 
            onGenerate={handleGenerateBulk} 
          />
        </TabsContent>

        <TabsContent value="logs">
          <AccessLogs logs={data.logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
