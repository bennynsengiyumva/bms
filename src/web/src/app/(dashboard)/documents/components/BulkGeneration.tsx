'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Button, Select, Badge } from '@/components/ui';

interface Candidate {
  id: string;
  name: string;
  church: string;
  status: string;
}

interface BulkGenerationProps {
  candidates: Candidate[];
  templates: any[];
  onGenerate: (data: any) => void;
}

export function BulkGeneration({ candidates, templates, onGenerate }: BulkGenerationProps) {
  const { t } = useI18n();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    onGenerate({ templateId: selectedTemplate, candidateIds: selectedCandidates });
  };

  return (
    <Card className="p-6">
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t.documents.bulkTab}
        </h3>
        <div className="max-w-md">
          <Select
            label={t.documents.selectTemplate}
            options={templates.map(t => ({ value: t.id, label: t.name }))}
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">
            Select Candidates ({selectedCandidates.length})
          </h4>
          <Button 
            size="sm" 
            variant="primary" 
            disabled={!selectedTemplate || selectedCandidates.length === 0}
            onClick={handleGenerate}
          >
            {t.documents.generateBulk}
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2 w-10">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-2">{t.common.name}</th>
                <th className="px-4 py-2">{t.auth.church}</th>
                <th className="px-4 py-2">{t.common.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {candidates.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 ${selectedCandidates.includes(candidate.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onClick={() => toggleCandidate(candidate.id)}
                >
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => {}} 
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{candidate.name}</td>
                  <td className="px-4 py-3">{candidate.church}</td>
                  <td className="px-4 py-3">
                    <Badge variant="success">{candidate.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
