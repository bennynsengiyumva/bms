import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../models/prisma';
import { MfaService } from './mfa.service';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const mfaService = new MfaService();

export const register = async (userData: any) => {
  const { email, password, fullName, phone, role, unionId, fieldId, districtId, churchId } = userData;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      phone,
      role,
      unionId,
      fieldId,
      districtId,
      churchId,
    },
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  if (user.mfaEnabled) {
    return { mfaRequired: true, userId: user.id };
  }

  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role, 
      email: user.email,
      churchId: user.churchId,
      districtId: user.districtId,
      fieldId: user.fieldId,
      unionId: user.unionId
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return { user, token };
};

export const verifyMfaLogin = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await mfaService.verifyMfaToken(userId, token);
  if (!isValid) {
    throw new Error('Invalid MFA token');
  }

  const jwtToken = jwt.sign(
    { 
      userId: user.id, 
      role: user.role, 
      email: user.email,
      churchId: user.churchId,
      districtId: user.districtId,
      fieldId: user.fieldId,
      unionId: user.unionId
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return { user, token: jwtToken };
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { message: 'Password reset successful' };
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      unionId: true,
      fieldId: true,
      districtId: true,
      churchId: true,
      mfaEnabled: true,
      status: true,
    }
  });
};
