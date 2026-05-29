import type { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as userService from '../services/user.service';
import { AuditService } from '../services/audit.service';
import { ScopeService } from '../services/scope.service';

const auditService = new AuditService();
const scopeService = new ScopeService();

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Scoped access based on role
    const filters: any = {};
    const { user } = req;

    if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.churchId = user.churchId;
    } else if (user?.role === 'district_admin') {
        filters.districtId = user.districtId;
    } else if (user?.role === 'field_admin') {
        filters.fieldId = user.fieldId;
    } else if (user?.role === 'union_admin') {
        filters.unionId = user.unionId;
    }

    const users = await userService.getAllUsers(filters);
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.user!.userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Hierarchy check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', id);
    if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: User out of scope' });
    }

    const updatedUser = await userService.updateUser(id, req.body);
    
    // Log the action
    await auditService.logAction({
      userId: req.user!.userId,
      action: 'UPDATE_USER',
      resource: 'User',
      resourceId: id,
      details: JSON.stringify(req.body),
      ipAddress: req.ip
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Hierarchy check
    const isAuthorized = await scopeService.checkScope(req.user!.userId, 'User', id);
    if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: User out of scope' });
    }

    // Only union_admin or field_admin can update roles (business rule)
    if (req.user?.role !== 'union_admin' && req.user?.role !== 'field_admin') {
        return res.status(403).json({ error: 'Access denied: Insufficient role to change roles' });
    }

    const updatedUser = await userService.updateUserRole(id, role);
    
    await auditService.logAction({
      userId: req.user!.userId,
      action: 'UPDATE_USER_ROLE',
      resource: 'User',
      resourceId: id,
      details: `Updated role to ${role}`,
      ipAddress: req.ip
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can view audit logs
    if (req.user?.role.includes('admin')) {
      const logs = await auditService.getLogs(req.query as any);
      res.status(200).json(logs);
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSecurityStatus = async (req: AuthRequest, res: Response) => {
  try {
    // Only union_admin can see the full security status
    if (req.user?.role !== 'union_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({
      encryptionStatus: 'AES-256-GCM Active',
      dataSensitivity: {
        pii: 'HIGH',
        spiritualRecords: 'HIGH',
        systemLogs: 'MEDIUM'
      },
      mfaUsageRate: 'Placeholder 15%',
      activeSessions: 'Placeholder 42'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
