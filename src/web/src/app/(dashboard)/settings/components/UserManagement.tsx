'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n';
import { Card, Input, Select, Button, Badge } from '@/components/ui';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  church: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export function UserManagement() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Mock data - replace with API calls
  const mockUsers: User[] = [
    {
      id: 'u1',
      fullName: 'Admin User',
      email: 'admin@bms.rw',
      role: 'union_admin',
      church: 'Rwanda Union Mission',
      status: 'active',
      lastLogin: '2026-05-19T10:30:00Z',
    },
    {
      id: 'u2',
      fullName: 'Pastor John Kamanzi',
      email: 'pastor.john@bms.rw',
      role: 'instructor',
      church: 'Kigali Central Church',
      status: 'active',
      lastLogin: '2026-05-19T08:15:00Z',
    },
    {
      id: 'u3',
      fullName: 'Rev. Peter Habumuremyi',
      email: 'rev.peter@bms.rw',
      role: 'pastor',
      church: 'Kigali Central Church',
      status: 'active',
      lastLogin: '2026-05-18T16:45:00Z',
    },
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleOptions = [
    { value: '', label: t.common.all },
    { value: 'union_admin', label: t.roles.union_admin },
    { value: 'field_admin', label: t.roles.field_admin },
    { value: 'district_admin', label: t.roles.district_admin },
    { value: 'church_admin', label: t.roles.church_admin },
    { value: 'pastor', label: t.roles.pastor },
    { value: 'instructor', label: t.roles.instructor },
  ];

  const formatRole = (role: string) => {
    return t.roles[role as keyof typeof t.roles] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.settings.userManagement}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.settings.userManagementSubtitle}
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.settings.addUser}
        </Button>
      </div>

      <Card variant="outlined" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t.common.search + '...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card variant="outlined" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.fullName}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.email}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.role}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.church}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.status}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.settings.lastLogin}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role.includes('admin') ? 'default' : 'secondary'}>
                        {formatRole(user.role)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.church}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          {t.common.edit}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t.common.noData}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
