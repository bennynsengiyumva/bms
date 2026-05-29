'use client';

import { useI18n } from '@/i18n';
import { Card, Badge } from '@/components/ui';

interface MemberProfileProps {
  member: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    joinDate: string;
    status: 'active' | 'inactive' | 'transferred';
    church: string;
    baptismDate?: string;
    baptismChurch?: string;
    departments: string[];
    roles: string[];
  };
}

export function MemberProfile({ member }: MemberProfileProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
              <span className="text-xl font-medium text-green-600 dark:text-green-300">
                {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {member.fullName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member.phone}</p>
            </div>
          </div>
          <Badge variant={member.status === 'active' ? 'success' : member.status === 'transferred' ? 'warning' : 'default'}>
            {member.status}
          </Badge>
        </div>
      </Card>

      {/* Church Info */}
      <Card variant="outlined" padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.membership.churchInfo}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.membership.currentChurch}</p>
            <p className="text-gray-900 dark:text-white font-medium">{member.church}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.membership.joinDate}</p>
            <p className="text-gray-900 dark:text-white font-medium">{member.joinDate}</p>
          </div>
        </div>
      </Card>

      {/* Baptism Info */}
      {member.baptismDate && (
        <Card variant="outlined" padding="md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.membership.baptismInfo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.membership.baptismDate}</p>
              <p className="text-gray-900 dark:text-white font-medium">{member.baptismDate}</p>
            </div>
            {member.baptismChurch && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t.membership.baptismChurch}</p>
                <p className="text-gray-900 dark:text-white font-medium">{member.baptismChurch}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Involvement */}
      <Card variant="outlined" padding="md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t.membership.involvement}
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.membership.departments}</p>
            <div className="flex flex-wrap gap-2">
              {member.departments.map((dept) => (
                <Badge key={dept} variant="default">{dept}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.membership.roles}</p>
            <div className="flex flex-wrap gap-2">
              {member.roles.map((role) => (
                <Badge key={role} variant="info">{role}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}