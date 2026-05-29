import { Router } from 'express';
import { MemberController } from '../controllers/member.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const memberController = new MemberController();

const adminRoles = ['union_admin', 'field_admin', 'district_admin', 'church_admin', 'pastor'];

// Members
router.get('/', authenticate, authorize(adminRoles), memberController.getMembers);
router.get('/:id', authenticate, authorize(adminRoles), memberController.getMember);
router.patch('/:id', authenticate, authorize(adminRoles), memberController.updateMember);
router.get('/:id/certificate', authenticate, authorize(adminRoles), memberController.getCertificate);

// Transfers
router.get('/transfers/all', authenticate, authorize(adminRoles), memberController.getTransfers);
router.post('/transfers/request', authenticate, authorize(adminRoles), memberController.requestTransfer);
router.post('/transfers/:id/approve', authenticate, authorize(adminRoles), memberController.approveTransfer);
router.post('/transfers/:id/reject', authenticate, authorize(adminRoles), memberController.rejectTransfer);

export default router;
