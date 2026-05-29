import prisma from '../models/prisma';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class DocumentService {
  /**
   * Documents
   */
  async uploadDocument(data: {
    candidateId?: string;
    name: string;
    fileUrl: string;
    fileType: string;
    category: string;
  }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.document.create({
      data,
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'UPLOAD_DOCUMENT',
        resource: 'Document',
        resourceId: result.id,
        details: `Uploaded document: ${data.name}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  async getCandidateDocuments(candidateId: string) {
    return prisma.document.findMany({
      where: { candidateId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async logAccess(data: { documentId: string; userId: string; action: string }, context?: { executorId?: string; ipAddress?: string }) {
    const result = await prisma.documentAccessLog.create({
      data: {
        ...data,
        accessedAt: new Date(),
      },
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'ACCESS_DOCUMENT',
        resource: 'DocumentAccessLog',
        resourceId: result.id,
        details: `Accessed document ${data.documentId}`,
        ipAddress: context.ipAddress
      });
    }

    return result;
  }

  /**
   * Certificate Templates
   */
  async createTemplate(data: { name: string; type: string; content: string; userId: string }, context?: { executorId?: string; ipAddress?: string }) {
    const template = await prisma.certificateTemplate.create({
      data: {
        name: data.name,
        type: data.type,
        content: data.content,
        version: 1,
      },
    });

    await prisma.certificateTemplateLog.create({
      data: {
        templateId: template.id,
        userId: data.userId,
        action: 'create',
        version: 1,
      },
    });

    if (context?.executorId) {
      await auditService.logAction({
        userId: context.executorId,
        action: 'CREATE_CERTIFICATE_TEMPLATE',
        resource: 'CertificateTemplate',
        resourceId: template.id,
        details: `Created certificate template: ${data.name}`,
        ipAddress: context.ipAddress
      });
    }

    return template;
  }

  async updateTemplate(id: string, data: { name?: string; content?: string; isActive?: boolean; userId: string }, context?: { executorId?: string; ipAddress?: string }) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.certificateTemplate.findUnique({ where: { id } });
      if (!current) throw new Error('Template not found');

      const nextVersion = current.version + 1;
      const updated = await tx.certificateTemplate.update({
        where: { id },
        data: {
          ...data,
          version: nextVersion,
        },
      });

      await tx.certificateTemplateLog.create({
        data: {
          templateId: id,
          userId: data.userId,
          action: 'update',
          version: nextVersion,
        },
      });

      if (context?.executorId) {
        await auditService.logAction({
          userId: context.executorId,
          action: 'UPDATE_CERTIFICATE_TEMPLATE',
          resource: 'CertificateTemplate',
          resourceId: id,
          details: `Updated certificate template to version ${nextVersion}`,
          ipAddress: context.ipAddress
        });
      }

      return updated;
    });
  }

  async getTemplates(type?: string) {
    return prisma.certificateTemplate.findMany({
      where: type ? { type } : {},
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getTemplateById(id: string) {
    return prisma.certificateTemplate.findUnique({
      where: { id },
      include: {
        logs: {
          include: { user: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
