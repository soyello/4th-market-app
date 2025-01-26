import { AdapterSession, AdapterUser } from 'next-auth/adapters';
import { BaseRow, SessionRow, UserRow } from './row';

export const mapToBase = (row: BaseRow) => ({
  id: row.id,
  createdAt: row.created_at,
  updatedAt: row.updated_at ?? null,
});

export const mapToAdapterUser = (row: UserRow): AdapterUser => ({
  ...mapToBase(row),
  name: row.name,
  email: row.email,
  image: row.image ?? null,
  hashedPassword: row.hashed_password,
  emailVerified: row.email_verified ?? null,
});

export const mapToAdapterSession = (row: SessionRow): AdapterSession => ({
  sessionToken: row.session_token,
  userId: row.user_id,
  expires: row.expires,
});
