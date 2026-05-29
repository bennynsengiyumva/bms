import prisma from '../models/prisma';
import bcrypt from 'bcryptjs';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export const generateCandidateNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.candidate.count();
  const sequence = (count + 1).toString().padStart(4, '0');
  return `CAN-${year}-${sequence}`;
};

export const registerCandidate = async (candidateData: any, context?: { executorId?: string; ipAddress?: string }) => {
  const { 
    email, 
    password, 
    fullName, 
    phone, 
    churchId,
    dateOfBirth,
    gender,
    addressProvince,
    addressDistrict,
    addressSector,
    referralSource,
    previousReligion,
    instructorId
  } = candidateData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const candidateNumber = await generateCandidateNumber();

  // Get church hierarchy info
  const church = await prisma.localChurch.findUnique({
    where: { id: churchId },
    include: {
      district: {
        include: {
          field: true
        }
      }
    }
  });

  if (!church) {
    throw new Error('Local church not found');
  }

  // We use a transaction to ensure both user and candidate are created
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        role: 'candidate',
        churchId,
        districtId: church.districtId,
        fieldId: church.district.fieldId,
        unionId: church.district.field.unionId
      },
    });

    const candidate = await tx.candidate.create({
      data: {
        userId: user.id,
        candidateNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        addressProvince,
        addressDistrict,
        addressSector,
        referralSource,
        previousReligion,
        instructorId,
        status: 'registered',
      },
      include: {
        user: true,
        instructor: true,
      }
    });

    // Create notification for the new candidate
    await tx.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to BMS!',
        message: 'Your baptism candidate registration was successful. Welcome to your spiritual journey.'
      }
    });

    return candidate;
  });

  // Audit Log
  if (context?.executorId) {
    await auditService.logAction({
        userId: context.executorId,
        action: 'REGISTER_CANDIDATE',
        resource: 'Candidate',
        resourceId: result.id,
        details: `Registered new candidate: ${fullName} (${email})`,
        ipAddress: context.ipAddress
    });
  }

  return result;
};

export const getCandidateById = async (id: string) => {
  return await prisma.candidate.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          church: true,
        }
      },
      instructor: true,
      lessons: {
        include: {
          lesson: true
        }
      },
      spiritualLogs: true,
      interviews: true,
      baptismRecord: true
    }
  });
};

export const getAllCandidates = async (filters: any = {}) => {
  return await prisma.candidate.findMany({
    where: filters,
    include: {
      user: {
        include: {
          church: true,
        }
      },
      instructor: true,
    },
    orderBy: {
      registrationDate: 'desc'
    }
  });
};

export const updateCandidate = async (id: string, updateData: any, context?: { executorId: string; ipAddress?: string }) => {
  const { user, ...candidateFields } = updateData;

  const result = await prisma.$transaction(async (tx) => {
    if (user) {
      const candidate = await tx.candidate.findUnique({ where: { id } });
      if (candidate) {
        await tx.user.update({
          where: { id: candidate.userId },
          data: user
        });
      }
    }

    if (candidateFields.dateOfBirth) {
      candidateFields.dateOfBirth = new Date(candidateFields.dateOfBirth);
    }

    return await tx.candidate.update({
      where: { id },
      data: candidateFields,
      include: {
        user: true,
        instructor: true
      }
    });
  });

  // Audit Log
  if (context?.executorId) {
      await auditService.logAction({
          userId: context.executorId,
          action: 'UPDATE_CANDIDATE',
          resource: 'Candidate',
          resourceId: id,
          details: JSON.stringify(updateData),
          ipAddress: context.ipAddress
      });
  }

  return result;
};

export const assignInstructor = async (candidateId: string, instructorId: string, context?: { executorId: string; ipAddress?: string }) => {
  // Verify instructor role
  const instructor = await prisma.user.findUnique({ where: { id: instructorId } });
  if (!instructor || instructor.role !== 'instructor') {
    throw new Error('User is not a valid instructor');
  }

  const result = await prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.update({
      where: { id: candidateId },
      data: { 
        instructorId,
        status: 'in_progress'
      },
      include: {
        instructor: true,
        user: true
      }
    });

    // Notify candidate
    await tx.notification.create({
      data: {
        userId: candidate.userId,
        title: 'Instructor Assigned',
        message: `Your instructor is ${instructor.fullName}. They will guide you through your Bible study lessons.`
      }
    });

    // Notify instructor
    await tx.notification.create({
      data: {
        userId: instructorId,
        title: 'New Candidate Assigned',
        message: `You have been assigned as the instructor for ${candidate.user.fullName}.`
      }
    });

    return candidate;
  });

  // Audit Log
  if (context?.executorId) {
    await auditService.logAction({
        userId: context.executorId,
        action: 'ASSIGN_INSTRUCTOR',
        resource: 'Candidate',
        resourceId: candidateId,
        details: `Assigned instructor ${instructor.fullName} to candidate ${result.user.fullName}`,
        ipAddress: context.ipAddress
    });
  }

  return result;
};

export const updateCandidateStatus = async (candidateId: string, status: string, context?: { executorId: string; ipAddress?: string }) => {
  const validStatuses = ['registered', 'in_progress', 'ready', 'baptized'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const result = await prisma.candidate.update({
    where: { id: candidateId },
    data: { status }
  });

  // Audit Log
  if (context?.executorId) {
      await auditService.logAction({
          userId: context.executorId,
          action: 'UPDATE_CANDIDATE_STATUS',
          resource: 'Candidate',
          resourceId: candidateId,
          details: `Updated status to ${status}`,
          ipAddress: context.ipAddress
      });
  }

  return result;
};
