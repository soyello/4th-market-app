import { AdapterUser } from 'next-auth/adapters';
import { BaseRow, UserRow } from './row';

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
