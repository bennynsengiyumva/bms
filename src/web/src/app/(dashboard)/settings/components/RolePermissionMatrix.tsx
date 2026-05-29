'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { useI18n } from '@/i18n';

interface Permission {
  id: string;
  name: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
}

export function RolePermissionMatrix() {
  const { t } = useI18n();

  const roles: Role[] = [
    { id: 'union_admin', name: t.roles.union_admin },
    { id: 'field_admin', name: t.roles.field_admin },
    { id: 'district_admin', name: t.roles.district_admin },
    { id: 'church_admin', name: t.roles.church_admin },
    { id: 'pastor', name: t.roles.pastor },
    { id: 'instructor', name: t.roles.instructor },
  ];

  const modules = ['Candidates', 'Baptism', 'Membership', 'Reporting', 'Settings'];
  
  const permissions: Record<string, string[]> = {
    union_admin: ['view', 'create', 'edit', 'delete', 'approve'],
    field_admin: ['view', 'create', 'edit', 'delete', 'approve'],
    district_admin: ['view', 'create', 'edit', 'delete'],
    church_admin: ['view', 'create', 'edit', 'delete'],
    pastor: ['view', 'edit', 'sign'],
    instructor: ['view', 'edit', 'log_lesson'],
  };

  const getPermissionBadge = (roleId: string, moduleName: string) => {
    // Mock logic for display
    if (roleId === 'union_admin') return <Badge variant="success">Full Access</Badge>;
    if (roleId === 'pastor' && moduleName === 'Baptism') return <Badge variant="info">View & Sign</Badge>;
    if (roleId === 'instructor' && moduleName === 'Candidates') return <Badge variant="info">View & Edit</Badge>;
    
    return <Badge variant="secondary">View Only</Badge>;
  };

  return (
    <Card title={t.settings.roleMatrix}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Module
              </th>
              {roles.map((role) => (
                <th key={role.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {modules.map((module) => (
              <tr key={module} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {module}
                </td>
                {roles.map((role) => (
                  <td key={`${module}-${role.id}`} className="px-4 py-3 text-center">
                    {getPermissionBadge(role.id, module)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
