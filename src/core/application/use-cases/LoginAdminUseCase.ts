import { prisma } from '../../infrastructure/db/prisma';
import { AuthService } from '../services/AuthService';

export class LoginAdminUseCase {
  async execute(username: string, password: string): Promise<string | null> {
    console.log(`[DEBUG] Recherche de l'admin: ${username}`);
    const admin = await prisma.admin.findUnique({ where: { username } });
    
    if (!admin) {
      console.log(`[DEBUG] Admin non trouvé: ${username}`);
      return null;
    }
    console.log(`[DEBUG] Admin trouvé. Vérification du mot de passe...`);

    const isValid = await AuthService.verifyPassword(password, admin.password_hash);
    console.log(`[DEBUG] Résultat vérification mot de passe: ${isValid}`);
    
    if (!isValid) return null;

    console.log(`[DEBUG] Génération du token JWT...`);
    const token = AuthService.generateToken({ id: admin.id, username: admin.username });
    console.log(`[DEBUG] Token généré avec succès.`);
    return token;
  }
}
