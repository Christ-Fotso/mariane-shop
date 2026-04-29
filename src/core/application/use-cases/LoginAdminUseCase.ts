import { prisma } from '../../infrastructure/db/prisma';
import { AuthService } from '../services/AuthService';

export class LoginAdminUseCase {
  async execute(username: string, password: string): Promise<string | null> {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return null;

    const isValid = await AuthService.verifyPassword(password, admin.password_hash);
    if (!isValid) return null;

    return AuthService.generateToken({ id: admin.id, username: admin.username });
  }
}
