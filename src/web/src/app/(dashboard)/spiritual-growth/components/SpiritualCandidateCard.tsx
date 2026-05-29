'use client';

import { Badge } from '@/components/ui';
import { getScoreBadgeVariant, getScoreColor } from '@/lib/utils';

interface SpiritualCandidateCardProps {
  id: string;
  candidateName: string;
  readinessScore: number;
  lastMeeting: string;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export function SpiritualCandidateCard({
  id,
  candidateName,
  readinessScore,
  lastMeeting,
  onSelect,
  isSelected,
}: SpiritualCandidateCardProps) {
  const badgeVariant = getScoreBadgeVariant(readinessScore);

  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{candidateName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{lastMeeting}</p>
        </div>
        <Badge variant={badgeVariant}>
          {readinessScore}%
        </Badge>
      </div>
    </button>
  );
}

interface ScoreCardProps {
  label: string;
  value: number;
  maxValue?: number;
  showPercentage?: boolean;
}

export function ScoreCard({ label, value, maxValue = 100, showPercentage = true }: ScoreCardProps) {
  const percentage = Math.round((value / maxValue) * 100);
  const colorClass = getScoreColor(percentage);

  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className={`text-2xl font-bold ${colorClass}`}>
        {showPercentage ? `${percentage}%` : `${value}/${maxValue}`}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}
