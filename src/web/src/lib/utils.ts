/**
 * Shared utility functions for BMS frontend
 */

/**
 * Merge class names with tailwind-merge pattern
 * Simple implementation without external dependencies
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get badge variant based on readiness/progress score
 */
export function getScoreBadgeVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}

/**
 * Get text color class based on score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Get badge variant for candidate status
 */
export function getCandidateStatusVariant(
  status: 'registered' | 'in_progress' | 'ready' | 'baptized'
): 'info' | 'warning' | 'success' | 'default' {
  switch (status) {
    case 'registered':
      return 'info';
    case 'in_progress':
      return 'warning';
    case 'ready':
      return 'success';
    case 'baptized':
      return 'default';
    default:
      return 'default';
  }
}
