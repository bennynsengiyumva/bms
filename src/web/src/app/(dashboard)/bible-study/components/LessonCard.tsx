'use client';

import Link from 'next/link';
import { Badge, Button, Card } from '@/components/ui';
import { useI18n } from '@/i18n';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  duration: string;
  order: number;
}

export function LessonCard({ id, title, description, objectives, duration, order }: LessonCardProps) {
  const { t } = useI18n();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-300 font-bold">{order}</span>
        </div>
        <Badge variant="info">{duration}</Badge>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {description}
      </p>
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {t.bibleStudy.learningObjectives}
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {objectives.map((obj, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <Link href={`/bible-study/progress/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            {t.bibleStudy.viewProgress}
          </Button>
        </Link>
        <Button variant="ghost" size="sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </Button>
      </div>
    </Card>
  );
}
