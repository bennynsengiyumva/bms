import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-mfa', authController.verifyMfa);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

export default router;
