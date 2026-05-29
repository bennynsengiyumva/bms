'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Select } from '@/components/ui';

interface LessonLog {
  candidateId: string;
  lessonId: string;
  dateCompleted: string;
  understanding: number;
  notes: string;
  nextLessonDate: string;
}

const mockCandidates = [
  { id: '1', name: 'Jean Pierre' },
  { id: '2', name: 'Marie Mukamana' },
  { id: '3', name: 'Claude Habimana' },
];

const mockLessons = [
  { id: '1', title: "God's Love" },
  { id: '2', title: 'Sin and Salvation' },
  { id: '3', title: 'The Bible' },
  { id: '4', title: "Jesus' Return" },
  { id: '5', title: 'The Church' },
];

export default function LogLessonPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LessonLog>({
    candidateId: '',
    lessonId: '',
    dateCompleted: '',
    understanding: 3,
    notes: '',
    nextLessonDate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'understanding' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/bible-study');
    } catch (err) {
      console.error('Failed to log lesson:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const candidateOptions = [
    { value: '', label: 'Select candidate' },
    ...mockCandidates.map((c) => ({ value: c.id, label: c.name })),
  ];

  const lessonOptions = [
    { value: '', label: 'Select lesson' },
    ...mockLessons.map((l) => ({ value: l.id, label: l.title })),
  ];

  const understandingOptions = [
    { value: '1', label: '1 - Needs Review' },
    { value: '2', label: '2 - Partial Understanding' },
    { value: '3', label: '3 - Good Understanding' },
    { value: '4', label: '4 - Very Good Understanding' },
    { value: '5', label: '5 - Excellent Understanding' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/bible-study">
          <Button variant="ghost" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Log Lesson Completion
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Record a candidate's lesson completion
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Lesson Information">
          <div className="space-y-4">
            <Select
              label="Candidate"
              name="candidateId"
              options={candidateOptions}
              value={formData.candidateId}
              onChange={handleChange}
              required
            />
            <Select
              label="Lesson"
              name="lessonId"
              options={lessonOptions}
              value={formData.lessonId}
              onChange={handleChange}
              required
            />
            <Input
              label="Date Completed"
              name="dateCompleted"
              type="date"
              value={formData.dateCompleted}
              onChange={handleChange}
              required
            />
          </div>
        </Card>

        <Card title="Assessment">
          <div className="space-y-4">
            <Select
              label="Understanding Level"
              name="understanding"
              options={understandingOptions}
              value={formData.understanding.toString()}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructor Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observations about the candidate's progress..."
              />
            </div>
          </div>
        </Card>

        <Card title="Next Lesson">
          <div className="space-y-4">
            <Input
              label="Schedule Next Lesson"
              name="nextLessonDate"
              type="datetime-local"
              value={formData.nextLessonDate}
              onChange={handleChange}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/bible-study">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isSubmitting}>
            Log Lesson Completion
          </Button>
        </div>
      </form>
    </div>
  );
}