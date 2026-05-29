import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { MfaService } from '../services/mfa.service';
import { AuditService } from '../services/audit.service';

const mfaService = new MfaService();
const auditService = new AuditService();

export class MfaController {
  /**
   * Initialize MFA setup for a user
   */
  async setupMfa(req: AuthRequest, res: Response) {
    try {
      const user = req.user!;
      const setup = await mfaService.generateMfaSecret(user.userId, user.email);
      
      res.json(setup);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Verify and enable MFA for a user
   */
  async enableMfa(req: AuthRequest, res: Response) {
    try {
      const { token, secret } = req.body;
      const result = await mfaService.verifyAndEnableMfa(req.user!.userId, token, secret);
      
      await auditService.logAction({
        userId: req.user!.userId,
        action: 'ENABLE_MFA',
        resource: 'User',
        resourceId: req.user!.userId,
        details: 'MFA enabled with TOTP',
        ipAddress: req.ip
      });

      res.json({
        message: 'MFA enabled successfully',
        backupCodes: result.backupCodes
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Disable MFA for a user
   */
  async disableMfa(req: AuthRequest, res: Response) {
    try {
      await mfaService.disableMfa(req.user!.userId);
      
      await auditService.logAction({
        userId: req.user!.userId,
        action: 'DISABLE_MFA',
        resource: 'User',
        resourceId: req.user!.userId,
        details: 'MFA disabled',
        ipAddress: req.ip
      });

      res.json({ message: 'MFA disabled successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
