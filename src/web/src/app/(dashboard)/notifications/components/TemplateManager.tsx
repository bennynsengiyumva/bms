'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { TranslationStructure } from '@/i18n/translations';

export interface Template {
  id: string;
  name: string;
  type: 'sms' | 'email';
  subject?: string;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

interface TemplateManagerProps {
  t: TranslationStructure;
  templates: Template[];
  onCreateTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTemplate: (id: string, template: Partial<Template>) => void;
  onDeleteTemplate: (id: string) => void;
}

const availableVariables = [
  { key: '{{candidate_name}}', label: 'Candidate Name' },
  { key: '{{church_name}}', label: 'Church Name' },
  { key: '{{instructor_name}}', label: 'Instructor Name' },
  { key: '{{lesson_title}}', label: 'Lesson Title' },
  { key: '{{baptism_date}}', label: 'Baptism Date' },
  { key: '{{interview_date}}', label: 'Interview Date' },
  { key: '{{next_lesson}}', label: 'Next Lesson Date' },
  { key: '{{pastor_name}}', label: 'Pastor Name' },
];

const defaultTemplates: Template[] = [
  {
    id: '1',
    name: 'Lesson Reminder',
    type: 'sms',
    body: 'Hello {{candidate_name}}, this is a reminder for your {{lesson_title}} lesson scheduled for {{next_lesson}}. Please contact {{instructor_name}} if you have any questions.',
    variables: ['candidate_name', 'lesson_title', 'next_lesson', 'instructor_name'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Baptism Announcement',
    type: 'email',
    subject: 'Upcoming Baptism Service - {{baptism_date}}',
    body: 'Dear {{candidate_name}}, We are pleased to inform you that your baptism is scheduled for {{baptism_date}} at {{church_name}}. Please contact {{pastor_name}} for any questions.',
    variables: ['candidate_name', 'baptism_date', 'church_name', 'pastor_name'],
    createdAt: '2024-01-10',
    updatedAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Interview Schedule',
    type: 'sms',
    body: '{{candidate_name}}, your baptism interview is scheduled for {{interview_date}}. Please be prepared and contact {{instructor_name}} if you need any guidance.',
    variables: ['candidate_name', 'interview_date', 'instructor_name'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

function TemplateCard({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  t,
}: {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  t: TranslationStructure;
}) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
              {template.type.toUpperCase()}
            </Badge>
          </div>
          {template.subject && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Subject:</span> {template.subject}
            </p>
          )}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{template.body}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {t.notifications.updated}: {new Date(template.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {t.common.edit}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.common.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}

function TemplateEditor({
  template,
  onSave,
  onCancel,
  t,
}: {
  template?: Template | null;
  onSave: (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  t: TranslationStructure;
}) {
  const [name, setName] = useState(template?.name || '');
  const [type, setType] = useState<'sms' | 'email'>(template?.type || 'sms');
  const [subject, setSubject] = useState(template?.subject || '');
  const [body, setBody] = useState(template?.body || '');

  const handleInsertVariable = (variable: string) => {
    setBody((prev) => prev + variable);
  };

  const handleSave = () => {
    if (!name.trim() || !body.trim()) return;
    if (type === 'email' && !subject.trim()) return;

    onSave({
      name,
      type,
      subject: type === 'email' ? subject : undefined,
      body,
      variables: availableVariables
        .filter((v) => body.includes(v.key))
        .map((v) => v.key.replace(/[{}]/g, '')),
    });
  };

  const isValid = name.trim() && body.trim() && (type === 'sms' || subject.trim());

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {template ? t.notifications.editTemplate : t.notifications.createTemplate}
          </h3>
          <Button variant="ghost" onClick={onCancel}>
            {t.common.close}
          </Button>
        </div>

        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.templateName}
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.notifications.templateNamePlaceholder}
          />
        </div>

        {/* Template Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.templateType}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('sms')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                type === 'sms'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              SMS
            </button>
            <button
              type="button"
              onClick={() => setType('email')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                type === 'email'
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
          </div>
        </div>

        {/* Subject (Email only) */}
        {type === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.notifications.emailSubject}
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.notifications.emailSubjectPlaceholder}
            />
          </div>
        )}

        {/* Available Variables */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.insertVariable}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <button
                key={variable.key}
                type="button"
                onClick={() => handleInsertVariable(variable.key)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 text-gray-700"
              >
                {variable.key}
              </button>
            ))}
          </div>
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.notifications.messageBody}
          </label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.notifications.messageBodyPlaceholder}
            rows={6}
            className={type === 'sms' ? 'resize-none' : ''}
          />
          {type === 'sms' && (
            <div className="mt-1 text-xs text-gray-500 text-right">
              {body.length} / 160 {t.notifications.characters}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {t.common.save}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function TemplateManager({
  t,
  templates = defaultTemplates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}: TemplateManagerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'sms' | 'email'>('all');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((template) => {
    if (activeTab !== 'all' && template.type !== activeTab) return false;
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSaveTemplate = (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTemplate) {
      onUpdateTemplate(editingTemplate.id, data);
      setEditingTemplate(null);
    } else {
      onCreateTemplate(data);
      setIsCreating(false);
    }
  };

  const handleDuplicate = (template: Template) => {
    onCreateTemplate({
      name: `${template.name} (Copy)`,
      type: template.type,
      subject: template.subject,
      body: template.body,
      variables: template.variables,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t.notifications.templateManager}</h3>
          <p className="text-sm text-gray-500">{t.notifications.templateManagerSubtitle}</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t.notifications.newTemplate}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-xs">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.notifications.searchTemplates}
            className="pl-10"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            {t.common.all}
          </Button>
          <Button
            variant={activeTab === 'sms' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('sms')}
          >
            SMS
          </Button>
          <Button
            variant={activeTab === 'email' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('email')}
          >
            Email
          </Button>
        </div>
      </div>

      {/* Template List or Editor */}
      {isCreating || editingTemplate ? (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => { setIsCreating(false); setEditingTemplate(null); }}
          t={t}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500">{t.notifications.noTemplates}</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={() => setEditingTemplate(template)}
                onDelete={() => onDeleteTemplate(template.id)}
                onDuplicate={() => handleDuplicate(template)}
                t={t}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}