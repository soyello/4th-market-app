import { AdapterUser } from 'next-auth/adapters';
import pool from './db';
import { UserRow } from '@/helper/row';
import { mapToAdapterUser } from '@/helper/mapper';
import { ResultSetHeader } from 'mysql2';

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

const MySQLAdapter = {
  async getUser(email: string): Promise<AdapterUser | null> {
    if (!email) {
      throw new Error('Email must be provided.');
    }
    try {
      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, image, email_verified, hashed_password, created_at, updated_at FROM users WHERE id = ?',
        [email]
      );
      return rows[0] ? mapToAdapterUser(rows[0]) : null;
    } catch (error) {
      console.error('Error fetching user by Email:', error);
      throw new Error('Failed fetch user.');
    }
  },
  async createUser(user: Omit<AdapterUser, 'id' | 'emailVerified'>): Promise<AdapterUser> {
    const { name, email, hashedPassword } = user;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, hashed_password) VALUES (?,?,?)',
      [name, email, hashedPassword]
    );
    return { id: result.insertId.toString(), name, email, image: null, hashedPassword, emailVerified: null };
  },
  async updateUser(user: Nullable<AdapterUser> & { email: string }): Promise<AdapterUser> {
    const { name, email, image } = user;
    if (!email) {
      throw new Error('User ID is required for updating.');
    }
    try {
      const updates = { name, image };
      const keys = Object.keys(updates).filter((key) => updates[key as keyof typeof updates] !== undefined);
      if (keys.length === 0) {
        throw new Error('No fields to update. Provide at least one field.');
      }
      const fields = keys.map((key) => `${key}=?`).join(', ');
      const values = keys.map((key) => updates[key as keyof typeof updates]);

      await pool.query(`UPDATE users SET ${fields} WHERE email=?`, [...values, email]);

      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, image, created_at, updated_at, email_verified FROM users WHERE email=?',
        [email]
      );
      if (!rows[0]) {
        throw new Error(`User with Email: ${email} not found after update.`);
      }
      return mapToAdapterUser(rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user.');
    }
  },
  async deleteUser(email: string): Promise<void> {
    await pool.query('DELETE FROM uses WHERE email=?', [email]);
  },
};

export default MySQLAdapter;
