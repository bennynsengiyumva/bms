import { Router } from 'express';
import { MfaController } from '../controllers/mfa.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const mfaController = new MfaController();

router.get('/setup', authenticate, mfaController.setupMfa);
router.post('/enable', authenticate, mfaController.enableMfa);
router.post('/disable', authenticate, mfaController.disableMfa);

export default router;
