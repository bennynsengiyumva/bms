import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import prisma from '../models/prisma';

export class MfaService {
  /**
   * Generate a new MFA secret and QR code for a user
   */
  async generateMfaSecret(userId: string, email: string) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, 'BMS-System', secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

    return {
      secret,
      qrCodeDataUrl,
    };
  }

  /**
   * Verify the first-time MFA setup and enable it
   */
  async verifyAndEnableMfa(userId: string, token: string, secret: string) {
    const isValid = authenticator.verify({ token, secret });
    if (!isValid) {
      throw new Error('Invalid MFA token');
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    const backupCodesHash = JSON.stringify(backupCodes);

    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: true,
        mfaSecret: secret,
        backupCodes: backupCodesHash,
      },
    });

    return { backupCodes };
  }

  /**
   * Disable MFA for a user
   */
  async disableMfa(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        backupCodes: null,
      },
    });
  }

  /**
   * Verify MFA token
   */
  async verifyMfaToken(userId: string, token: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true, mfaSecret: true, backupCodes: true },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return true; // MFA not enabled
    }

    // Check TOTP
    const isValidTotp = authenticator.verify({
      token,
      secret: user.mfaSecret,
    });

    if (isValidTotp) {
      return true;
    }

    // Check backup codes
    if (user.backupCodes) {
      const backupCodes: string[] = JSON.parse(user.backupCodes);
      const codeIndex = backupCodes.indexOf(token);
      
      if (codeIndex !== -1) {
        // Remove used backup code
        backupCodes.splice(codeIndex, 1);
        await prisma.user.update({
          where: { id: userId },
          data: {
            backupCodes: JSON.stringify(backupCodes),
          },
        });
        return true;
      }
    }

    return false;
  }

  private generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }
}
