import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class MemberService {
  async getMembers(filters: any) {
    return prisma.member.findMany({
      where: filters,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
        church: true,
        baptismRecord: {
          include: {
            event: true,
          },
        },
      },
    });
  }

  async getMemberById(id: string) {
    return prisma.member.findUnique({
      where: { id },
      include: {
        user: true,
        church: true,
        baptismRecord: {
          include: {
            event: true,
          },
        },
        transfers: {
          include: {
            fromChurch: true,
            toChurch: true,
          },
          orderBy: { requestDate: 'desc' },
        },
      },
    });
  }

  async updateMember(id: string, data: any, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.member.update({
      where: { id },
      data,
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'UPDATE_MEMBER',
            resource: 'Member',
            resourceId: id,
            details: JSON.stringify(data),
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  /**
   * Transfers
   */
  async requestTransfer(data: {
    memberId: string;
    fromChurchId: string;
    toChurchId: string;
    notes?: string;
  }, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.membershipTransfer.create({
      data: {
        ...data,
        requestDate: new Date(),
        status: 'pending',
      },
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'REQUEST_TRANSFER',
            resource: 'Member',
            resourceId: data.memberId,
            details: `Requested transfer to church ${data.toChurchId}`,
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  async approveTransfer(transferId: string, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.$transaction(async (tx) => {
      const transfer = await tx.membershipTransfer.update({
        where: { id: transferId },
        data: {
          status: 'approved',
          approvalDate: new Date(),
        },
      });

      await tx.member.update({
        where: { id: transfer.memberId },
        data: {
          currentChurchId: transfer.toChurchId,
        },
      });

      return transfer;
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'APPROVE_TRANSFER',
            resource: 'MembershipTransfer',
            resourceId: transferId,
            details: `Approved transfer for member ${result.memberId}`,
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  async rejectTransfer(transferId: string, notes: string, context?: { executorId: string; ipAddress?: string }) {
    const result = await prisma.membershipTransfer.update({
      where: { id: transferId },
      data: {
        status: 'rejected',
        notes: notes ? `Rejected: ${notes}` : 'Rejected',
      },
    });

    if (context?.executorId) {
        await auditService.logAction({
            userId: context.executorId,
            action: 'REJECT_TRANSFER',
            resource: 'MembershipTransfer',
            resourceId: transferId,
            details: `Rejected transfer with notes: ${notes}`,
            ipAddress: context.ipAddress
        });
    }

    return result;
  }

  async getTransfers(filters: any) {
    return prisma.membershipTransfer.findMany({
      where: filters,
      include: {
        member: {
          include: {
            user: {
              select: { fullName: true },
            },
          },
        },
        fromChurch: true,
        toChurch: true,
      },
      orderBy: { requestDate: 'desc' },
    });
  }

  async generateCertificateData(memberId: string) {
    const member = await this.getMemberById(memberId);
    if (!member) throw new Error('Member not found');

    return {
      fullName: member.user.fullName,
      baptismDate: member.baptismRecord?.event.eventDate || member.joinDate,
      churchName: member.church.name,
      joinDate: member.joinDate,
      membershipId: member.id,
    };
  }
}
