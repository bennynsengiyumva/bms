import type { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    if (result.mfaRequired) {
      return res.status(200).json({ 
        message: 'MFA required', 
        mfaRequired: true, 
        userId: result.userId 
      });
    }

    const { user, token } = result as any;
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } 
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const verifyMfa = async (req: Request, res: Response) => {
  try {
    const { userId, token } = req.body;
    const authResult = await authService.verifyMfaLogin(userId, token);
    
    res.status(200).json({ 
      message: 'Login successful', 
      token: authResult.token, 
      user: { 
        id: authResult.user.id, 
        email: authResult.user.email, 
        role: authResult.user.role, 
        fullName: authResult.user.fullName 
      } 
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await authService.getUserById(req.user.userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
