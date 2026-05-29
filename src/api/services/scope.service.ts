import prisma from '../models/prisma';

export type ResourceType = 'Candidate' | 'Member' | 'BaptismRecord' | 'User' | 'BaptismEvent' | 'Document' | 'SpiritualGrowthLog' | 'BaptismInterview' | 'InstructorProfile' | 'MembershipTransfer' | 'CoordinationMeeting' | 'Announcement' | 'LocalChurch';

export class ScopeService {
  /**
   * Verify if a user has jurisdiction over a specific resource
   */
  async checkScope(userId: string, resourceType: ResourceType, resourceId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        unionId: true,
        fieldId: true,
        districtId: true,
        churchId: true,
      },
    });

    if (!user) return false;

    // Super admins (union_admin) have access to everything within their union
    // If we assume single union for now, they have access to everything.
    // But let's be precise.
    
    if (user.role === 'union_admin') {
       // In a multi-union system, we would check if resource.unionId === user.unionId
       // For now, we assume union_admin is global or scoped to their union.
       return true; 
    }

    const resourceHierarchy = await this.getResourceHierarchy(resourceType, resourceId);
    if (!resourceHierarchy) return false;

    switch (user.role) {
      case 'field_admin':
        return resourceHierarchy.fieldId === user.fieldId;
      case 'district_admin':
        return resourceHierarchy.districtId === user.districtId;
      case 'church_admin':
      case 'pastor':
        return resourceHierarchy.churchId === user.churchId;
      case 'instructor':
        // Instructors are usually scoped to their church, but might also be scoped to candidates assigned to them
        if (resourceType === 'Candidate') {
            const candidate = await prisma.candidate.findUnique({
                where: { id: resourceId },
                select: { instructorId: true }
            });
            if (candidate?.instructorId === userId) return true;
        }
        return resourceHierarchy.churchId === user.churchId;
      case 'candidate':
        // Candidates can only access their own data
        if (resourceType === 'Candidate') {
            const candidate = await prisma.candidate.findUnique({
                where: { id: resourceId },
                select: { userId: true }
            });
            return candidate?.userId === userId;
        }
        if (resourceType === 'User') {
            return resourceId === userId;
        }
        return false;
      default:
        return false;
    }
  }

  private async getResourceHierarchy(resourceType: ResourceType, resourceId: string) {
    switch (resourceType) {
      case 'Candidate':
        const candidate = await prisma.candidate.findUnique({
          where: { id: resourceId },
          include: { user: true },
        });
        return candidate?.user;
      case 'Member':
        const member = await prisma.member.findUnique({
          where: { id: resourceId },
          include: { user: true },
        });
        return member?.user;
      case 'BaptismRecord':
        const record = await prisma.baptismRecord.findUnique({
          where: { id: resourceId },
          include: { 
            event: {
                include: {
                    church: {
                        include: {
                            district: {
                                include: {
                                    field: true
                                }
                            }
                        }
                    }
                }
            } 
          },
        });
        if (!record) return null;
        return {
            churchId: record.event.churchId,
            districtId: record.event.church.districtId,
            fieldId: record.event.church.district.fieldId,
            unionId: record.event.church.district.field.unionId
        };
      case 'BaptismEvent':
          const event = await prisma.baptismEvent.findUnique({
              where: { id: resourceId },
              include: {
                  church: {
                      include: {
                          district: {
                              include: {
                                  field: true
                              }
                          }
                      }
                  }
              }
          });
          if (!event) return null;
          return {
              churchId: event.churchId,
              districtId: event.church.districtId,
              fieldId: event.church.district.fieldId,
              unionId: event.church.district.field.unionId
          };
      case 'User':
        return prisma.user.findUnique({
          where: { id: resourceId },
        });
      case 'Document':
        const doc = await prisma.document.findUnique({
          where: { id: resourceId },
          include: { candidate: { include: { user: true } } }
        });
        if (!doc || !doc.candidate) return null;
        return doc.candidate.user;
      case 'SpiritualGrowthLog':
        const log = await prisma.spiritualGrowthLog.findUnique({
          where: { id: resourceId },
          include: { candidate: { include: { user: true } } }
        });
        if (!log || !log.candidate) return null;
        return log.candidate.user;
      case 'BaptismInterview':
        const interview = await prisma.baptismInterview.findUnique({
          where: { id: resourceId },
          include: { candidate: { include: { user: true } } }
        });
        if (!interview || !interview.candidate) return null;
        return interview.candidate.user;
      case 'InstructorProfile':
        const profile = await prisma.instructorProfile.findUnique({
          where: { id: resourceId },
          include: { user: true }
        });
        return profile?.user || null;
      case 'MembershipTransfer':
        const transfer = await prisma.membershipTransfer.findUnique({
          where: { id: resourceId },
          include: {
            member: {
              include: { user: true }
            },
            fromChurch: {
              include: {
                district: {
                  include: {
                    field: true
                  }
                }
              }
            },
            toChurch: {
              include: {
                district: {
                  include: {
                    field: true
                  }
                }
              }
            }
          }
        });
        if (!transfer) return null;
        return {
          churchId: transfer.fromChurchId,
          districtId: transfer.fromChurch.districtId,
          fieldId: transfer.fromChurch.district.fieldId,
          unionId: transfer.fromChurch.district.field.unionId
        };
      case 'CoordinationMeeting':
        const meeting = await prisma.coordinationMeeting.findUnique({
          where: { id: resourceId },
          include: {
            church: {
              include: {
                district: {
                  include: {
                    field: true
                  }
                }
              }
            }
          }
        });
        if (!meeting) return null;
        return {
          churchId: meeting.churchId,
          districtId: meeting.church.districtId,
          fieldId: meeting.church.district.fieldId,
          unionId: meeting.church.district.field.unionId
        };
      case 'Announcement':
        const announcement = await prisma.announcement.findUnique({
          where: { id: resourceId },
          include: {
            church: {
              include: {
                district: {
                  include: {
                    field: true
                  }
                }
              }
            }
          }
        });
        if (!announcement) return null;
        return {
          churchId: announcement.churchId,
          districtId: announcement.church.districtId,
          fieldId: announcement.church.district.fieldId,
          unionId: announcement.church.district.field.unionId
        };
      case 'LocalChurch':
        const church = await prisma.localChurch.findUnique({
          where: { id: resourceId },
          include: {
            district: {
              include: {
                field: true
              }
            }
          }
        });
        if (!church) return null;
        return {
          churchId: church.id,
          districtId: church.districtId,
          fieldId: church.district.fieldId,
          unionId: church.district.field.unionId
        };
      default:
        return null;
    }
  }
}
