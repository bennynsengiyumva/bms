'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n';

interface FooterProps {
  version?: string;
}

export function Footer({ version = '1.0.0' }: FooterProps) {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} BMS. {t.footer.rights}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.footer.version} {version}
          </p>
        </div>
      </div>
    </footer>
  );
}
