'use client';

import { useI18n } from '@/i18n';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { UserManagement } from './components/UserManagement';
import { RolePermissionMatrix } from './components/RolePermissionMatrix';
import { AuditLogs } from './components/AuditLogs';
import SecuritySettingsPage from './security/page';

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.nav.settings}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage system users, security, and access controls
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">{t.settings.userManagement}</TabsTrigger>
          <TabsTrigger value="roles">{t.settings.roleManagement}</TabsTrigger>
          <TabsTrigger value="audit">{t.audit.title}</TabsTrigger>
          <TabsTrigger value="security">{t.settings.security}</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          <TabsContent value="roles">
            <RolePermissionMatrix />
          </TabsContent>
          <TabsContent value="audit">
            <AuditLogs />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettingsPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
