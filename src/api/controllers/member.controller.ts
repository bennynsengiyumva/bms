import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { MemberService } from '../services/member.service';
import { ScopeService } from '../services/scope.service';

const memberService = new MemberService();
const scopeService = new ScopeService();

export class MemberController {
  async getMembers(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.currentChurchId = user.churchId;
      } else if (user?.role === 'district_admin') {
        filters.church = { districtId: user.districtId };
      } else if (user?.role === 'field_admin') {
        filters.church = { district: { fieldId: user.fieldId } };
      } else if (user?.role === 'union_admin') {
        filters.church = { district: { field: { unionId: user.unionId } } };
      }

      const members = await memberService.getMembers(filters);
      res.json(members);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMember(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Member', id);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Resource out of scope' });
      }

      const member = await memberService.getMemberById(id);
      if (!member) return res.status(404).json({ message: 'Member not found' });
      res.json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateMember(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Member', id);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Resource out of scope' });
      }

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const member = await memberService.updateMember(id, req.body, context);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async requestTransfer(req: AuthRequest, res: Response) {
    try {
      const { memberId, toChurchId, notes } = req.body;
      
      // Jurisdiction check for member
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Member', memberId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Member out of scope' });
      }

      const member = await memberService.getMemberById(memberId);
      if (!member) return res.status(404).json({ message: 'Member not found' });

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const transfer = await memberService.requestTransfer({
        memberId,
        fromChurchId: member.currentChurchId,
        toChurchId,
        notes,
      }, context);
      res.status(201).json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async approveTransfer(req: AuthRequest, res: Response) {
    try {
      const transferId = req.params.id;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'MembershipTransfer', transferId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Transfer out of scope' });
      }

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const transfer = await memberService.approveTransfer(transferId, context);
      res.json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async rejectTransfer(req: AuthRequest, res: Response) {
    try {
      const transferId = req.params.id;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'MembershipTransfer', transferId);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Transfer out of scope' });
      }

      const context = { executorId: req.user!.userId, ipAddress: req.ip };
      const transfer = await memberService.rejectTransfer(transferId, req.body.notes, context);
      res.json(transfer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTransfers(req: AuthRequest, res: Response) {
    try {
      const { user } = req;
      const filters: any = {};

      if (user?.role === 'church_admin' || user?.role === 'pastor') {
        filters.OR = [
          { fromChurchId: user.churchId },
          { toChurchId: user.churchId }
        ];
      } else if (user?.role === 'district_admin') {
        filters.OR = [
          { fromChurch: { districtId: user.districtId } },
          { toChurch: { districtId: user.districtId } }
        ];
      } else if (user?.role === 'field_admin') {
        filters.OR = [
          { fromChurch: { district: { fieldId: user.fieldId } } },
          { toChurch: { district: { fieldId: user.fieldId } } }
        ];
      }
      // union_admin sees all transfers (no filter)

      const transfers = await memberService.getTransfers(filters);
      res.json(transfers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCertificate(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Jurisdiction check
      const isAuthorized = await scopeService.checkScope(req.user!.userId, 'Member', id);
      if (!isAuthorized) {
        return res.status(403).json({ error: 'Access denied: Resource out of scope' });
      }

      const data = await memberService.generateCertificateData(id);
      res.json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
