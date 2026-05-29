'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Button, Input, Select } from '@/components/ui';

export function ReportBuilder() {
  const { t } = useI18n();
  const [reportType, setReportType] = useState('candidates');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleGenerate = () => {
    // Logic to generate and potentially download the report
    console.log('Generating report:', { reportType, startDate, endDate });
    alert('Report generation started. Your download will begin shortly.');
  };

  return (
    <Card padding="md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t.reports.customReport}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Report Type
          </label>
          <Select
            options={[
              { value: 'candidates', label: 'Candidate Directory' },
              { value: 'baptism', label: 'Baptism Records' },
              { value: 'lessons', label: 'Lesson Completion' },
              { value: 'members', label: 'Membership List' },
            ]}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.reports.startDate}
          </label>
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t.reports.endDate}
          </label>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleGenerate}>
            {t.reports.generateReport}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t.reports.exportPdf}
        </Button>
        <Button variant="secondary" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {t.reports.exportExcel}
        </Button>
      </div>
    </Card>
  );
}
