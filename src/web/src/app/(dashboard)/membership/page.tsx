'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/i18n';
import { Button, Card, Input, Select, Alert, Skeleton } from '@/components/ui';
import { MemberRow } from './components';
import { api } from '@/lib/api';

// Types
interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  church: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'transferred';
}

interface Church {
  id: string;
  name: string;
}

export default function MembershipPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [churches, setChurches] = useState<Church[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [churchFilter, setChurchFilter] = useState('');

  // Fetch members with current filters
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const filters: Record<string, string> = {};
    if (searchTerm) filters.search = searchTerm;
    if (statusFilter) filters.status = statusFilter;
    if (churchFilter) filters.churchId = churchFilter;
    
    try {
      const data = await api.membership.getAll(filters);
      setMembers(Array.isArray(data) ? data : data.members || []);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, churchFilter]);

  // Fetch churches for filter dropdown
  const fetchChurches = useCallback(async () => {
    try {
      const data = await api.churches.getAll();
      setChurches(Array.isArray(data) ? data : data.churches || []);
    } catch (err) {
      console.error('Error fetching churches:', err);
      // Use fallback churches if API fails
      setChurches([
        { id: '1', name: 'Kigali Central Church' },
        { id: '2', name: 'Remera Church' },
        { id: '3', name: 'Musanze Church' },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchChurches();
  }, [fetchMembers, fetchChurches]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '' || statusFilter !== '' || churchFilter !== '') {
        fetchMembers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, churchFilter, fetchMembers]);

  const handleRetry = () => {
    fetchMembers();
  };

  const statusOptions = [
    { value: '', label: t.common.all },
    { value: 'active', label: t.membership.active },
    { value: 'inactive', label: t.membership.inactive },
    { value: 'transferred', label: t.membership.transferred },
  ];

  const churchOptions = [
    { value: '', label: t.common.all },
    ...churches.map(c => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.membership.directory}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t.membership.subtitle}
          </p>
        </div>
        <Button>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.membership.addMember}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Error" onClose={() => setError(null)}>
          {error}
          <Button variant="ghost" size="sm" onClick={handleRetry} className="mt-2">
            Retry
          </Button>
        </Alert>
      )}

      {/* Filters */}
      <Card variant="outlined" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder={t.membership.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={churchOptions}
              value={churchFilter}
              onChange={(e) => setChurchFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card variant="outlined" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.fullName}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.phone}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.auth.church}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.membership.joinDate}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.status}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t.common.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Loading skeleton rows
                <>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Skeleton variant="circular" width={40} height={40} className="mr-3" />
                          <div className="space-y-2">
                            <Skeleton width={120} height={14} />
                            <Skeleton width={80} height={10} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Skeleton width={100} height={14} /></td>
                      <td className="px-4 py-3"><Skeleton width={140} height={14} /></td>
                      <td className="px-4 py-3"><Skeleton width={80} height={14} /></td>
                      <td className="px-4 py-3"><Skeleton width={60} height={24} /></td>
                      <td className="px-4 py-3"><Skeleton width={80} height={14} /></td>
                    </tr>
                  ))}
                </>
              ) : members.length > 0 ? (
                members.map((member) => (
                  <MemberRow
                    key={member.id}
                    id={member.id}
                    fullName={member.fullName}
                    email={member.email}
                    phone={member.phone}
                    church={member.church}
                    joinDate={member.joinDate}
                    status={member.status}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter || churchFilter
                      ? 'No members match your filters'
                      : t.membership.noMembersFound}
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