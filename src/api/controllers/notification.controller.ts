import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const notifications = await notificationService.getNotifications(userId);
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    res.json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    await notificationService.markAllAsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Templates
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await notificationService.getTemplates();
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await notificationService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await notificationService.updateTemplate(id, req.body);
    res.json(template);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await notificationService.deleteTemplate(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Broadcast
export const broadcast = async (req: Request, res: Response) => {
  try {
    const result = await notificationService.broadcast(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
