'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { Button, Card, Badge, Alert, Skeleton } from '@/components/ui';
import { MemberProfile } from '../components';
import { TransferModal } from '../components';
import { api } from '@/lib/api';

interface Member {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  church: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'transferred';
  baptismDate?: string;
  baptismChurch?: string;
  departments: string[];
  roles: string[];
}

export default function MemberDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const memberId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const fetchMember = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.membership.getById(memberId);
      setMember(data as Member);
    } catch (err) {
      console.error('Error fetching member:', err);
      setError('Failed to load member details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  const handleTransfer = async (toChurchId: string, notes: string) => {
    await api.membership.requestTransfer(memberId, { toChurchId, notes });
    setShowTransferModal(false);
    fetchMember(); // Refresh data
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/membership" className="text-gray-500 hover:text-gray-700">
            ← Back to Members
          </Link>
        </div>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="space-y-6">
        <Link href="/membership" className="text-gray-500 hover:text-gray-700">
          ← Back to Members
        </Link>
        <Alert variant="error" title="Error">
          {error || 'Member not found'}
          <Button variant="ghost" size="sm" onClick={fetchMember} className="mt-2">
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/membership" className="text-gray-500 hover:text-gray-700">
          ← Back to Members
        </Link>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowTransferModal(true)}>
            {t.membership.requestTransfer}
          </Button>
        </div>
      </div>

      {/* Member Profile */}
      <MemberProfile member={member} />

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          memberId={member.id}
          memberName={member.fullName}
          currentChurch={member.church}
          onTransfer={handleTransfer}
          onClose={() => setShowTransferModal(false)}
        />
      )}
    </div>
  );
}