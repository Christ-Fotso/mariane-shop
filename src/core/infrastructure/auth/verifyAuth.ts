import { cookies } from 'next/headers';
import { AuthService } from '@/core/application/services/AuthService';

export interface AdminPayload {
  id: string;
  username: string;
}

/**
 * Verifies the admin JWT from the HTTP-only cookie.
 * Returns the decoded payload if valid, null otherwise.
 * Use this in every API route that requires admin authentication.
 */
export async function verifyAdminAuth(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return null;

  const payload = AuthService.verifyToken(token);
  if (!payload || !payload.id || !payload.username) return null;

  return { id: payload.id, username: payload.username };
}
