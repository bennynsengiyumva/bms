'use client';

import { useI18n } from '@/i18n';
import { Card, Button, Badge } from '@/components/ui';

interface Template {
  id: string;
  name: string;
  type: string;
  lastUpdated: string;
  version: string;
}

interface CertificateTemplatesProps {
  templates: Template[];
  onCreate: () => void;
}

export function CertificateTemplates({ templates, onCreate }: CertificateTemplatesProps) {
  const { t } = useI18n();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t.documents.templatesTab}
        </h3>
        <Button onClick={onCreate}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.documents.createTemplate}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
            <div className="aspect-[1/1.4] bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-4 rounded-t-lg border-b relative group">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-t-lg">
                <Button size="sm" variant="secondary">{t.documents.preview}</Button>
                <Button size="sm" variant="primary">{t.common.edit}</Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900 dark:text-white">{template.name}</h4>
                <Badge>{template.version}</Badge>
              </div>
              <p className="text-xs text-gray-500 mb-4">{t.documents.templateType}: {template.type}</p>
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>{t.documents.lastUpdated}: {template.lastUpdated}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
