import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class BaptismService {
  /**
   * Baptism Events
   */
  async createEvent(data: {
    churchId: string;
    eventDate: Date;
    location?: string;
    officiatingPastorId: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.baptismEvent.create({
      data,
      include: {
        church: true,
        officiatingPastor: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'CREATE_BAPTISM_EVENT',
        resource: 'BaptismEvent',
        resourceId: result.id,
        details: `Created baptism event for ${result.church.name} on ${data.eventDate}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getEvents(filters: any = {}) {
    return prisma.baptismEvent.findMany({
      where: filters,
      include: {
        church: true,
        officiatingPastor: {
          select: {
            fullName: true,
            email: true
          }
        },
        _count: {
          select: { records: true }
        }
      },
      orderBy: { eventDate: 'desc' }
    });
  }

  async getEventById(id: string) {
    return prisma.baptismEvent.findUnique({
      where: { id },
      include: {
        church: true,
        officiatingPastor: {
          select: {
            fullName: true,
            email: true
          }
        },
        records: {
          include: {
            candidate: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
  }

  async updateEvent(id: string, data: any) {
    return prisma.baptismEvent.update({
      where: { id },
      data
    });
  }

  async deleteEvent(id: string) {
    return prisma.baptismEvent.delete({
      where: { id }
    });
  }

  /**
   * Baptism Records & Confirmation
   */
  async recordBaptism(data: {
    eventId: string;
    candidateId: string;
    witnessName?: string;
    sponsorName?: string;
    certificateNumber?: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the baptism record
      const record = await tx.baptismRecord.create({
        data,
        include: {
          candidate: {
            include: {
              user: true
            }
          },
          event: {
            include: {
              church: true
            }
          }
        }
        });

        // 2. Update candidate status to 'baptized'
        await tx.candidate.update({
        where: { id: data.candidateId },
        data: { status: 'baptized' }
        });

        // 3. Create a member record
        await tx.member.create({
        data: {
          userId: record.candidate.userId,
          baptismRecordId: record.id,
          currentChurchId: record.event.churchId,
          joinDate: record.event.eventDate,
          status: 'active'
        }
        });

        // 4. Create notification for the newly baptized member
        await tx.notification.create({
        data: {
          userId: record.candidate.userId,
          title: 'Welcome to Membership!',
          message: `Congratulations on your baptism! You are now a member of ${record.event.church.name}.`
        }
        });

        return record;
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'RECORD_BAPTISM',
        resource: 'BaptismRecord',
        resourceId: result.id,
        details: `Recorded baptism for candidate ${result.candidate.user.fullName}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getRecords(filters: any = {}) {
    return prisma.baptismRecord.findMany({
      where: filters,
      include: {
        candidate: {
          include: {
            user: true
          }
        },
        event: {
          include: {
            church: true
          }
        }
      },
      orderBy: { recordedAt: 'desc' }
    });
  }

  async getRecordById(id: string) {
    return prisma.baptismRecord.findUnique({
      where: { id },
      include: {
        candidate: {
          include: {
            user: true
          }
        },
        event: {
          include: {
            church: true,
            officiatingPastor: true
          }
        },
        signedByPastor: {
          select: {
            fullName: true
          }
        }
      }
    });
  }

  async signRecord(recordId: string, pastorId: string, context?: { executorId?: string; ipAddress?: string }) {
    // Fetch record with candidate and lessons
    const record = await prisma.baptismRecord.findUnique({
      where: { id: recordId },
      include: {
        candidate: {
          include: {
            lessons: true,
            interviews: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!record) throw new Error('Baptism record not found');

    // a) Verify 100% lessons completed
    const totalLessons = await prisma.bibleLesson.count();
    const completedLessons = record.candidate.lessons.filter(l => l.completionDate).length;
    
    if (completedLessons < totalLessons) {
      throw new Error(`Candidate has only completed ${completedLessons}/${totalLessons} lessons.`);
    }

    // b) Verify spiritual readiness status is "Ready"
    const latestInterview = record.candidate.interviews[0];
    if (!latestInterview || !latestInterview.isReady) {
      throw new Error('Candidate is not marked as spiritually ready.');
    }

    // Perform signature
    const result = await prisma.baptismRecord.update({
      where: { id: recordId },
      data: {
        signedAt: new Date(),
        signedByPastorId: pastorId
      }
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'SIGN_BAPTISM_RECORD',
        resource: 'BaptismRecord',
        resourceId: result.id,
        details: `Pastor signed baptism record for candidate.`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async generateCertificateData(recordId: string) {
    const record = await this.getRecordById(recordId);
    if (!record) throw new Error('Record not found');

    if (!record.signedAt) {
      throw new Error('Certificate data cannot be generated for an unsigned record.');
    }

    return {
      certificateNumber: record.certificateNumber,
      fullName: record.candidate.user.fullName,
      baptismDate: record.event.eventDate,
      churchName: record.event.church.name,
      pastorName: record.event.officiatingPastor.fullName,
      witnessName: record.witnessName,
      sponsorName: record.sponsorName,
      signedAt: record.signedAt,
      signedBy: record.signedByPastor?.fullName
    };
  }
}
