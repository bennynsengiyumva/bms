'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Input } from '@/components/ui';

interface Lesson {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  duration: string;
  order: number;
}

interface LessonCatalogManagerProps {
  lessons: Lesson[];
  onAddLesson: (lesson: Omit<Lesson, 'id'>) => void;
  onEditLesson: (id: string, lesson: Omit<Lesson, 'id'>) => void;
  onDeleteLesson: (id: string) => void;
}

export function LessonCatalogManager({ lessons, onAddLesson, onEditLesson, onDeleteLesson }: LessonCatalogManagerProps) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    objectives: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lessonData = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      objectives: formData.objectives.split('\n').filter(o => o.trim()),
      order: editingId ? lessons.find(l => l.id === editingId)?.order || lessons.length + 1 : lessons.length + 1,
    };

    if (editingId) {
      onEditLesson(editingId, lessonData);
    } else {
      onAddLesson(lessonData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', duration: '', objectives: '' });
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      objectives: lesson.objectives.join('\n'),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t.bibleStudy.confirmDelete)) {
      onDeleteLesson(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.bibleStudy.addLesson}
        </Button>
      </div>

      {/* Lesson List */}
      <div className="space-y-3">
        {lessons.map(lesson => (
          <Card key={lesson.id} variant="outlined" padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-bold">{lesson.order}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.duration}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(lesson)}>
                  {t.common.edit}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)}>
                  {t.common.delete}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingId ? t.bibleStudy.editLesson : t.bibleStudy.addLesson}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.bibleStudy.lessonTitle}
                  </label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t.bibleStudy.lessonTitle}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.bibleStudy.lessonDescription}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t.bibleStudy.lessonDescription}
                    className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[80px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.bibleStudy.duration}
                  </label>
                  <Input
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="45 min"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t.bibleStudy.objectives} (one per line)
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="Objective 1&#10;Objective 2&#10;Objective 3"
                    className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700 min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" type="button" onClick={resetForm}>
                    {t.bibleStudy.cancelLesson}
                  </Button>
                  <Button type="submit">
                    {editingId ? t.common.save : t.bibleStudy.saveLesson}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}