import { Request, Response } from 'express';
import { ChurchService } from '../services/church.service';
import { ScopeService } from '../services/scope.service';
import { AuthRequest } from '../middleware/auth.middleware';

const churchService = new ChurchService();
const scopeService = new ScopeService();

// Hierarchy
export const getHierarchy = async (req: AuthRequest, res: Response) => {
  try {
    const hierarchy = await churchService.getHierarchy();
    res.json(hierarchy);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Unions
export const getUnions = async (req: AuthRequest, res: Response) => {
  try {
    const unions = await churchService.getUnions();
    res.json(unions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUnion = async (req: AuthRequest, res: Response) => {
  try {
    // Only union_admin can create unions
    if (req.user?.role !== 'union_admin') {
      return res.status(403).json({ error: 'Access denied: Only union admins can create unions' });
    }
    const union = await churchService.createUnion(req.body);
    res.status(201).json(union);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Fields
export const getFields = async (req: AuthRequest, res: Response) => {
  try {
    const { unionId } = req.query;
    
    // Scope check: field_admin can only see their field, union_admin can see all
    if (req.user?.role === 'field_admin' && unionId !== req.user.fieldId) {
      return res.status(403).json({ error: 'Access denied: Cannot view fields outside your jurisdiction' });
    }
    if (req.user?.role === 'district_admin' || req.user?.role === 'church_admin' || req.user?.role === 'pastor' || req.user?.role === 'instructor') {
      return res.status(403).json({ error: 'Access denied: Insufficient role to view fields' });
    }
    
    const fields = await churchService.getFields(unionId as string);
    res.json(fields);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createField = async (req: AuthRequest, res: Response) => {
  try {
    // Only union_admin can create fields
    if (req.user?.role !== 'union_admin') {
      return res.status(403).json({ error: 'Access denied: Only union admins can create fields' });
    }
    const field = await churchService.createField(req.body);
    res.status(201).json(field);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Districts
export const getDistricts = async (req: AuthRequest, res: Response) => {
  try {
    const { fieldId } = req.query;
    
    // Scope check: district_admin can only see their district, field_admin can see all in their field
    if (req.user?.role === 'district_admin' && fieldId !== req.user.districtId) {
      return res.status(403).json({ error: 'Access denied: Cannot view districts outside your jurisdiction' });
    }
    if (req.user?.role === 'church_admin' || req.user?.role === 'pastor' || req.user?.role === 'instructor') {
      return res.status(403).json({ error: 'Access denied: Insufficient role to view districts' });
    }
    
    const districts = await churchService.getDistricts(fieldId as string);
    res.json(districts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createDistrict = async (req: AuthRequest, res: Response) => {
  try {
    // Only union_admin and field_admin can create districts
    if (req.user?.role !== 'union_admin' && req.user?.role !== 'field_admin') {
      return res.status(403).json({ error: 'Access denied: Only union/field admins can create districts' });
    }
    // Field admin can only create districts in their field
    if (req.user?.role === 'field_admin' && req.body.fieldId !== req.user.fieldId) {
      return res.status(403).json({ error: 'Access denied: Cannot create district in another field' });
    }
    const district = await churchService.createDistrict(req.body);
    res.status(201).json(district);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Local Churches
export const getChurches = async (req: AuthRequest, res: Response) => {
  try {
    const { districtId } = req.query;
    
    // Scope check: church_admin/pastor can only see their church, district_admin can see all in their district
    if (req.user?.role === 'church_admin' || req.user?.role === 'pastor') {
      // They can only see churches in their district - let service handle filtering
    }
    if (req.user?.role === 'instructor') {
      return res.status(403).json({ error: 'Access denied: Insufficient role to view churches' });
    }
    
    const churches = await churchService.getChurches(districtId as string);
    res.json(churches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createChurch = async (req: AuthRequest, res: Response) => {
  try {
    // Only union_admin, field_admin, district_admin can create churches
    if (req.user?.role !== 'union_admin' && req.user?.role !== 'field_admin' && req.user?.role !== 'district_admin') {
      return res.status(403).json({ error: 'Access denied: Only union/field/district admins can create churches' });
    }
    // District admin can only create churches in their district
    if (req.user?.role === 'district_admin' && req.body.districtId !== req.user.districtId) {
      return res.status(403).json({ error: 'Access denied: Cannot create church in another district' });
    }
    const church = await churchService.createChurch(req.body);
    res.status(201).json(church);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Coordination Meetings
export const createMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId, churchLevel } = req.body;
    
    // Scope check: user can only create meetings for their church hierarchy
    if (churchId) {
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'LocalChurch', churchId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Cannot create meeting for this church' });
      }
    }
    
    const context = { executorId: req.user!.userId, ipAddress: req.ip };
    const meeting = await churchService.createMeeting({
      ...req.body,
      organizerId: req.user!.userId,
      meetingDate: new Date(req.body.meetingDate),
    }, context);
    res.status(201).json(meeting);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId } = req.query;
    
    // Scope check for meetings - verify user has access to the church
    if (churchId && typeof churchId === 'string') {
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'LocalChurch', churchId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Cannot view meetings for this church' });
      }
    }
    
    // Build hierarchical filters based on role
    const filters: any = {};
    
    if (req.user?.role === 'church_admin' || req.user?.role === 'pastor') {
      filters.churchId = req.user.churchId;
    } else if (req.user?.role === 'district_admin') {
      filters.church = { districtId: req.user.districtId };
    } else if (req.user?.role === 'field_admin') {
      filters.church = { district: { fieldId: req.user.fieldId } };
    }
    // union_admin sees all meetings (no filter)
    
    const meetings = await churchService.getMeetings(filters);
    res.json(meetings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Announcements
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { targetType, targetId, churchId } = req.body;
    
    // Scope check based on target type
    if (targetType === 'church' && targetId) {
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'LocalChurch', targetId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Cannot create announcement for this church' });
      }
    } else if (churchId) {
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'LocalChurch', churchId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Cannot create announcement for this church' });
      }
    }
    
    const context = { executorId: req.user!.userId, ipAddress: req.ip };
    const announcement = await churchService.createAnnouncement({
      ...req.body,
      authorId: req.user!.userId,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
    }, context);
    res.status(201).json(announcement);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId, targetType, targetId } = req.query;
    
    // Scope check for announcements
    if (churchId && typeof churchId === 'string') {
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'LocalChurch', churchId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Cannot view announcements for this church' });
      }
    }
    
    // Build hierarchical filters based on role
    const filters: any = {};
    
    if (req.user?.role === 'church_admin' || req.user?.role === 'pastor' || req.user?.role === 'instructor') {
      filters.churchId = req.user.churchId;
    } else if (req.user?.role === 'district_admin') {
      filters.church = { districtId: req.user.districtId };
    } else if (req.user?.role === 'field_admin') {
      filters.church = { district: { fieldId: req.user.fieldId } };
    }
    // union_admin sees all announcements (no filter)
    
    const announcements = await churchService.getAnnouncements(filters);
    res.json(announcements);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Regional Stats
export const getRegionalStats = async (req: AuthRequest, res: Response) => {
  try {
    const { level, id } = req.query;
    
    // Scope check based on level
    if (level === 'field' && id && req.user?.role === 'field_admin' && id !== req.user.fieldId) {
      return res.status(403).json({ error: 'Access denied: Cannot view stats for another field' });
    }
    if (level === 'district' && id && (req.user?.role === 'district_admin' || req.user?.role === 'church_admin') && id !== req.user.districtId) {
      return res.status(403).json({ error: 'Access denied: Cannot view stats for another district' });
    }
    if (level === 'church' && id && (req.user?.role === 'church_admin' || req.user?.role === 'pastor' || req.user?.role === 'instructor') && id !== req.user.churchId) {
      return res.status(403).json({ error: 'Access denied: Cannot view stats for another church' });
    }
    
    const stats = await churchService.getRegionalStats(level as string, id as string);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Communication
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId } = req.body;
    
    // Scope check: can only send message if recipient is in user's scope
    if (recipientId) {
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', recipientId);
      if (!isAuthorized && req.user?.role !== 'union_admin' && req.user?.role !== 'field_admin') {
        return res.status(403).json({ error: 'Access denied: Cannot send message to user outside your jurisdiction' });
      }
    }
    
    const message = await churchService.logCommunication({
      ...req.body,
      senderId: req.user!.userId
    });
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const messages = await churchService.getCommunicationLogs(userId);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};