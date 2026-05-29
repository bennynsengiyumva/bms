'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { UserRole } from '@/types';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: UserRole;
}

export function Sidebar({ isOpen = true, onClose, userRole }: SidebarProps) {
  const { t } = useI18n();
  const pathname = usePathname();

  const mainNavItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: 'dashboard' },
    { href: '/candidates', label: t.nav.candidates, icon: 'people' },
    { href: '/bible-study', label: t.nav.bibleStudy, icon: 'book' },
    { href: '/spiritual-growth', label: t.nav.spiritualGrowth, icon: 'growth' },
    { href: '/baptism', label: t.nav.baptism, icon: 'water' },
    { href: '/membership', label: t.nav.membership, icon: 'card' },
  ];

  const canViewReports = [
    'union_admin',
    'field_admin',
    'district_admin',
    'church_admin',
    'pastor',
  ].includes(userRole || '');

  const adminNavItems = [
    { href: '/instructors', label: t.nav.instructors, icon: 'users' },
    { href: '/churches', label: t.nav.churches, icon: 'church' },
    { href: '/reports', label: t.nav.reports, icon: 'chart' },
    { href: '/documents', label: t.nav.documents, icon: 'folder' },
  ].filter(item => {
    if (item.href === '/reports') return canViewReports;
    return ['union_admin', 'field_admin', 'district_admin', 'church_admin'].includes(userRole || '');
  });

  const settingsNavItems = [
    { href: '/settings', label: t.nav.settings, icon: 'settings' },
    { href: '/notifications', label: t.nav.notifications, icon: 'bell' },
  ];

  const icons: Record<string, React.ReactNode> = {
    // ... rest of the file
  };

  const showAdminSection = adminNavItems.length > 0;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-200 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <nav className="flex flex-col h-full p-4 gap-1">
          {/* Main Navigation */}
          <div className="flex-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1
                  ${pathname === item.href
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }
                `}
              >
                {icons[item.icon]}
                {item.label}
              </Link>
            ))}

            {/* Admin Section */}
            {showAdminSection && (
              <>
                <div className="my-4 border-t border-gray-200 dark:border-gray-700" />
                <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1
                      ${pathname === item.href
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {icons[item.icon]}
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Settings Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {settingsNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1
                  ${pathname === item.href
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }
                `}
              >
                {icons[item.icon]}
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
