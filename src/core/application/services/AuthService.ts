import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readSecret } from '../secrets/readSecret';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12); // increased from 10 to 12 rounds
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(payload: object): string {
    const secret = readSecret('JWT_SECRET');
    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }

  static verifyToken(token: string): any {
    try {
      const secret = readSecret('JWT_SECRET');
      return jwt.verify(token, secret);
    } catch {
      return null;
    }
  }
}
