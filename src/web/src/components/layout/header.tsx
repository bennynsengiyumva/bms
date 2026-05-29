'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { Language } from '@/types';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  userRole?: string;
  onLanguageChange?: (lang: Language) => void;
}

export function Header({ isAuthenticated = false, userName, userRole, onLanguageChange }: HeaderProps) {
  const { t, language, setLanguage } = useI18n();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.notifications.getAll().then(data => {
        const unread = data.filter((n: any) => !n.isRead).length;
        setUnreadCount(unread);
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BMS</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white hidden sm:block">
                Baptism & Membership
              </span>
            </Link>

            {/* Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {t.nav.dashboard}
                </Link>
                <Link
                  href="/candidates"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/candidates'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {t.nav.candidates}
                </Link>
                <Link
                  href="/baptism"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/baptism'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {t.nav.baptism}
                </Link>
                <Link
                  href="/membership"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/membership'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {t.nav.membership}
                </Link>
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-2 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">{t.language.english}</option>
              <option value="rw">{t.language.kinyarwanda}</option>
            </select>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/notifications" className="relative p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-[10px] text-white text-center leading-4">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{userRole}</p>
                </div>
                <button
                  onClick={() => logout()}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
