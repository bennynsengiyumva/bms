import prisma from '../models/prisma';

export class NotificationService {
  async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  async createNotification(data: { userId: string; title: string; message: string }) {
    return prisma.notification.create({ data });
  }

  // Templates
  async getTemplates() {
    return prisma.communicationTemplate.findMany();
  }

  async getTemplateById(id: string) {
    return prisma.communicationTemplate.findUnique({ where: { id } });
  }

  async createTemplate(data: {
    name: string;
    subject?: string;
    content: string;
    type: string;
    category: string;
  }) {
    return prisma.communicationTemplate.create({ data });
  }

  async updateTemplate(id: string, data: any) {
    return prisma.communicationTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    return prisma.communicationTemplate.delete({ where: { id } });
  }

  // Broadcast
  async broadcast(data: {
    title: string;
    message: string;
    targetRole?: string;
    targetChurchId?: string;
  }) {
    const { title, message, targetRole, targetChurchId } = data;
    
    const filters: any = {};
    if (targetRole) filters.role = targetRole;
    if (targetChurchId) filters.churchId = targetChurchId;

    const users = await prisma.user.findMany({ where: filters });

    if (users.length === 0) return { count: 0 };

    const notifications = users.map(user => ({
      userId: user.id,
      title,
      message
    }));

    return prisma.notification.createMany({
      data: notifications
    });
  }
}
